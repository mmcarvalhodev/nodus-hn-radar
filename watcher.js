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

let _timer       = null;
let _running     = false;
let _onChange    = null; // (unreadCount) => void
let _ticking     = false;
let _lastTickAt  = 0;
let _triggerTimer = null;

export function startWatcher(intervalMs = DEFAULT_INTERVAL_MS) {
  if (_timer) return;
  _running = true;
  // Fire one tick immediately on start so the UI feels responsive
  safeTick();
  _timer = setInterval(() => safeTick(), intervalMs);
}

export function stopWatcher() {
  if (_timer) clearInterval(_timer);
  if (_triggerTimer) clearTimeout(_triggerTimer);
  _timer = null;
  _triggerTimer = null;
  _running = false;
}

export function isRunning() {
  return _running;
}

export function isTicking() {
  return _ticking;
}

export function getLastTickAt() {
  return _lastTickAt;
}

export function onUnreadChange(cb) {
  _onChange = typeof cb === "function" ? cb : null;
}

// Run a tick out-of-band — called when the user adds/enables a rule so they
// don't have to wait up to DEFAULT_INTERVAL_MS for the next scheduled tick.
// Debounced so rapid changes (e.g., toggling 3 rules in 2 seconds) don't
// fire 3 fetches in a row.
export function triggerTick(delayMs = 300) {
  if (!_running) return;
  if (_triggerTimer) clearTimeout(_triggerTimer);
  _triggerTimer = setTimeout(() => {
    _triggerTimer = null;
    safeTick();
  }, delayMs);
}

function safeTick() {
  if (_ticking) return; // don't pile up if a fetch is in flight
  _ticking = true;
  tick()
    .catch((err) => console.warn("[HN Radar] watcher tick:", err))
    .finally(() => {
      _ticking = false;
      _lastTickAt = Date.now();
    });
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
