export function getFromStorage(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => resolve(result[key] ?? null));
  });
}

export function setToStorage(key, value) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, resolve);
  });
}

export const DEFAULT_SETTINGS = {
  enabled:        true,        // master Lens toggle
  theme:          "auto",      // auto | light | dark
  fontSize:       "medium",    // small | medium | large
  width:          "normal",    // normal | wide
  compact:        false,       // tighter row spacing
  markVisited:    true,        // gray out visited posts
  highlightShow:  true,        // colored left bar for Show HN
  highlightAsk:   true,        // colored left bar for Ask HN
  highlightLaunch:true,        // colored left bar for Launch HN
  language:       "",          // "" = autodetect
  autoTranslate:        false, // translate comment previews in the side panel
  autoTranslatePinned:  false, // translate pinned card titles inside the side panel
  translateTo:          "",    // "" = browser language; "en", "pt", "es", etc.
  uiLanguage:           "",    // "" = autodetect; otherwise an i18n code like "pt-BR"
  zebraEnabled:         false, // alternating row backgrounds for plain posts
  zebraColor:           "#ff8800", // hex; applied with chosen intensity
  zebraIntensity:       12         // % opacity (5-40)
};

export async function getSettings() {
  const stored = await getFromStorage("settings");
  return { ...DEFAULT_SETTINGS, ...(stored || {}) };
}

export function saveSettings(settings) {
  return setToStorage("settings", settings);
}

// ── Visited posts (keyed by HN post id) ──
const VISITED_TTL_MS = 30 * 86400 * 1000; // 30 days

export async function getVisitedSet() {
  const raw = await getFromStorage("visited");
  if (!raw) return new Set();
  const now = Date.now();
  const fresh = {};
  for (const [id, ts] of Object.entries(raw)) {
    if (now - ts < VISITED_TTL_MS) fresh[id] = ts;
  }
  // Persist pruned version
  if (Object.keys(fresh).length !== Object.keys(raw).length) {
    await setToStorage("visited", fresh);
  }
  return new Set(Object.keys(fresh));
}

export async function markVisited(postId) {
  const raw = (await getFromStorage("visited")) || {};
  raw[String(postId)] = Date.now();
  await setToStorage("visited", raw);
}

// ── Pinned posts ──
// Stored as a map: { [postId]: { id, title, url, domain, score, comments, author, ageText, itemUrl, type, pinnedAt } }

export async function getPinnedMap() {
  return (await getFromStorage("pinned")) || {};
}

export async function isPinned(postId) {
  const map = await getPinnedMap();
  return !!map[String(postId)];
}

export async function addPin(postData) {
  const map = await getPinnedMap();
  const id = String(postData.id);
  map[id] = { ...postData, id, pinnedAt: Date.now() };
  await setToStorage("pinned", map);
  return map;
}

export async function removePin(postId) {
  const map = await getPinnedMap();
  delete map[String(postId)];
  await setToStorage("pinned", map);
  return map;
}

// ── Comment preview cache (10 minutes) ──
const COMMENTS_TTL_MS = 10 * 60 * 1000;

export async function getCachedComments(postId) {
  const cached = await getFromStorage(`comments_${postId}`);
  if (!cached) return null;
  if (Date.now() - cached.ts > COMMENTS_TTL_MS) return null;
  return cached.comments;
}

export async function setCachedComments(postId, comments) {
  return setToStorage(`comments_${postId}`, { ts: Date.now(), comments });
}

// ── Tags on pinned items ──
export function normalizeTag(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-_À-ɏЀ-ӿ]/g, "")
    .slice(0, 30);
}

// Deterministic hue (0-360) from a tag name. Same tag → same color, always.
export function tagHue(tag) {
  if (!tag) return 25;
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = ((hash << 5) - hash) + tag.charCodeAt(i);
    hash |= 0; // keep 32-bit
  }
  return Math.abs(hash) % 360;
}

export async function setPinnedTags(postId, tags) {
  const map = await getPinnedMap();
  const id = String(postId);
  if (!map[id]) return map;
  map[id].tags = Array.from(new Set(tags.map(normalizeTag).filter(Boolean)));
  await setToStorage("pinned", map);
  return map;
}

export async function getRecentTags() {
  return (await getFromStorage("recentTags")) || [];
}

export async function pushRecentTag(tag) {
  const n = normalizeTag(tag);
  if (!n) return;
  const list = await getRecentTags();
  const next = [n, ...list.filter(t => t !== n)].slice(0, 40);
  await setToStorage("recentTags", next);
}

// ── Per-card collapsed state in the side panel ──
export async function getCollapsedCards() {
  return (await getFromStorage("collapsedCards")) || {};
}

export async function setCardCollapsed(postId, collapsed) {
  const map = await getCollapsedCards();
  if (collapsed) map[postId] = true;
  else delete map[postId];
  await setToStorage("collapsedCards", map);
  return map;
}

// ── Radar snapshots + lists ──
// Store: { byPost: {id: {meta..., snapshots: [{ts,score,descendants}]}}, lists: {top:[ids], show:[ids], ask:[ids]}, lastFetch: {top:ts, ...} }

const RADAR_KEY = "radar";
const MAX_SNAPSHOTS_PER_POST = 12;
const MIN_SNAPSHOT_GAP_MS    = 4 * 60 * 1000; // don't snapshot more often than 4min

export async function getRadarStore() {
  return (await getFromStorage(RADAR_KEY)) || { byPost: {}, lists: {}, lastFetch: {} };
}

export async function updateRadarSnapshots(category, items) {
  const store = await getRadarStore();
  const now = Date.now();
  const ids = [];

  for (const item of items) {
    if (!item || !item.id) continue;
    ids.push(item.id);

    if (!store.byPost[item.id]) {
      store.byPost[item.id] = { id: item.id, snapshots: [] };
    }
    const post = store.byPost[item.id];

    // Update meta on every fetch
    post.id          = item.id;
    post.title       = item.title;
    post.by          = item.by;
    post.time        = item.time;
    post.url         = item.url;
    post.type        = item.type;
    post.score       = item.score       || 0;
    post.descendants = item.descendants || 0;

    // Add snapshot (throttled)
    const last = post.snapshots[post.snapshots.length - 1];
    if (!last || now - last.ts >= MIN_SNAPSHOT_GAP_MS) {
      post.snapshots.push({ ts: now, score: post.score, descendants: post.descendants });
      if (post.snapshots.length > MAX_SNAPSHOTS_PER_POST) {
        post.snapshots = post.snapshots.slice(-MAX_SNAPSHOTS_PER_POST);
      }
    }
  }

  store.lists[category]     = ids;
  store.lastFetch[category] = now;

  // Prune posts not in any list anymore
  const referenced = new Set();
  Object.values(store.lists).forEach((arr) => (arr || []).forEach((id) => referenced.add(Number(id))));
  for (const id of Object.keys(store.byPost)) {
    if (!referenced.has(Number(id))) delete store.byPost[id];
  }

  await setToStorage(RADAR_KEY, store);
  return store;
}

// Velocity = (score_delta * 2 + comments_delta * 3) per hour.
// Returns { current, delta } where delta compares recent half vs older half of snapshots.
// Falls back to lifetime average when fewer than 2 snapshots exist.
export function computeVelocityDetail(post) {
  if (!post) return { current: 0, delta: null };
  const snaps = post.snapshots || [];

  // ── Fallback when we have only one (or zero) snapshot ──
  if (snaps.length < 2) {
    const ageHours = Math.max(1, (Date.now() / 1000 - (post.time || 0)) / 3600);
    const lifetime = (post.score / ageHours) * 2 + ((post.descendants || 0) / ageHours) * 3;
    return { current: Math.max(0, lifetime), delta: null };
  }

  const first = snaps[0];
  const last  = snaps[snaps.length - 1];
  const hoursFull = (last.ts - first.ts) / 3600000;
  if (hoursFull <= 0.05) return { current: 0, delta: null };

  const current = Math.max(0,
    ((last.score - first.score) * 2 + (last.descendants - first.descendants) * 3) / hoursFull
  );

  // Compute delta from first-half vs second-half velocities when we have ≥3 snapshots
  let delta = null;
  if (snaps.length >= 3) {
    const midIdx = Math.floor(snaps.length / 2);
    const midSnap = snaps[midIdx];
    const h1 = (midSnap.ts - first.ts) / 3600000;
    const h2 = (last.ts - midSnap.ts) / 3600000;
    if (h1 > 0.05 && h2 > 0.05) {
      const vel1 = ((midSnap.score - first.score) * 2 + (midSnap.descendants - first.descendants) * 3) / h1;
      const vel2 = ((last.score - midSnap.score) * 2 + (last.descendants - midSnap.descendants) * 3) / h2;
      delta = Math.round(vel2 - vel1);
    }
  }

  return { current, delta };
}

// Back-compat
export function computeVelocity(post) {
  return computeVelocityDetail(post).current;
}

// ── Muted domains ──
export async function getMutedDomains() {
  const arr = (await getFromStorage("mutedDomains")) || [];
  return Array.isArray(arr) ? arr : [];
}

export async function setMutedDomains(arr) {
  const cleaned = Array.from(new Set(
    (arr || []).map((d) => String(d || "").trim().toLowerCase().replace(/^www\./, "")).filter(Boolean)
  ));
  await setToStorage("mutedDomains", cleaned);
  return cleaned;
}

// ── OP active cache (per post id, 10min TTL) ──
const OP_ACTIVE_TTL_MS = 10 * 60 * 1000;

export async function getOPActiveCache() {
  return (await getFromStorage("opActiveCache")) || {};
}

export async function getCachedOPActive(postId) {
  const map = await getOPActiveCache();
  const entry = map[String(postId)];
  if (!entry) return undefined;
  if (Date.now() - entry.ts > OP_ACTIVE_TTL_MS) return undefined;
  return entry.active;
}

export async function setCachedOPActive(postId, active) {
  const map = await getOPActiveCache();
  map[String(postId)] = { active: !!active, ts: Date.now() };
  await setToStorage("opActiveCache", map);
}
