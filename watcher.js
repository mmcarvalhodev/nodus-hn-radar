// NODUS HN Radar — Watchlist runtime (in-panel polling)
// ------------------------------------------------------
// Runs only while the side panel is open. setInterval-based polling.
// Uses the existing radar snapshot/cache so we don't duplicate fetches.
// Records matches to chrome.storage.local. The bell UI subscribes via
// onUnreadChange().

import { fetchListIds, fetchItemsBatch } from "./hn-data.js";
import {
  getWatchRules, getWatchFired, recordWatchFired, pruneWatchFired,
  getWatchUnread, addWatchUnread, updateRadarSnapshots
} from "./storage.js";
import { enrichPost, evaluateRule } from "./match-engine.js";

const DEFAULT_INTERVAL_MS = 90 * 1000;      // 90s — polite to the public HN API
const PER_FEED_BATCH      = 30;             // top 30 from each watched feed
const FEED_IDS            = ["top", "show", "ask", "best"];

let _timer    = null;
let _running  = false;
let _onChange = null; // (unreadCount) => void

export function startWatcher(intervalMs = DEFAULT_INTERVAL_MS) {
  if (_timer) return;
  _running = true;
  // Fire one tick immediately on start so the UI feels responsive
  tick().catch((err) => console.warn("[HN Radar] watcher tick:", err));
  _timer = setInterval(() => {
    tick().catch((err) => console.warn("[HN Radar] watcher tick:", err));
  }, intervalMs);
}

export function stopWatcher() {
  if (_timer) clearInterval(_timer);
  _timer = null;
  _running = false;
}

export function isRunning() {
  return _running;
}

export function onUnreadChange(cb) {
  _onChange = typeof cb === "function" ? cb : null;
}

async function tick() {
  const rules = (await getWatchRules()).filter((r) => r.enabled);
  if (rules.length === 0) {
    // Still prune the fired cache to keep storage tidy
    await pruneWatchFired();
    return;
  }

  // Union of feeds across enabled rules
  const feedsNeeded = new Set();
  rules.forEach((r) => (r.feeds || []).forEach((f) => {
    if (FEED_IDS.includes(f)) feedsNeeded.add(f);
  }));
  if (feedsNeeded.size === 0) return;

  // Fetch each needed feed and update the shared Radar snapshot store —
  // this means the Radar dashboard also benefits from the watcher polling.
  const postsByFeed = {};
  for (const feed of feedsNeeded) {
    try {
      const ids   = await fetchListIds(feed);
      const items = await fetchItemsBatch(ids, PER_FEED_BATCH);
      await updateRadarSnapshots(feed, items);
      postsByFeed[feed] = items;
    } catch (err) {
      console.warn(`[HN Radar] watcher fetch ${feed}:`, err);
    }
  }

  // Evaluate each rule against the posts in its feeds
  const fired = await getWatchFired();
  const now = Date.now();
  let anyNew = false;

  for (const rule of rules) {
    const seen = new Set();
    for (const feed of (rule.feeds || [])) {
      const posts = postsByFeed[feed] || [];
      for (const p of posts) {
        if (seen.has(p.id)) continue; // same post in multiple feeds: count once per rule
        seen.add(p.id);

        const enriched = enrichPost(p);
        if (!enriched) continue;
        if (!evaluateRule(rule, enriched)) continue;

        const key = `${rule.id}::${p.id}`;
        if (fired[key]) continue; // already notified for this (rule, post)

        // Record the fire so we don't notify again
        fired[key] = now;
        await addWatchUnread({
          ruleId:    rule.id,
          ruleName:  rule.name,
          postId:    enriched.id,
          title:     enriched.title,
          points:    enriched.points,
          comments:  enriched.comments,
          domain:    enriched.domain,
          hnUrl:     `https://news.ycombinator.com/item?id=${enriched.id}`,
          matchedAt: now,
        });
        anyNew = true;
      }
    }
  }

  await recordWatchFired(fired);
  await pruneWatchFired();

  if (anyNew && _onChange) {
    const unread = await getWatchUnread();
    _onChange(unread.length);
  }
}
