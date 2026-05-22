// NODUS HN Radar — HN list endpoints + batched item fetch
import { fetchItem } from "./hn-api.js";

const HN_BASE = "https://hacker-news.firebaseio.com/v0";

// listKey: "top" | "new" | "best" | "show" | "ask"
export async function fetchListIds(listKey) {
  const map = {
    top:  "topstories",
    new:  "newstories",
    best: "beststories",
    show: "showstories",
    ask:  "askstories"
  };
  const path = map[listKey] || "topstories";
  const res = await fetch(`${HN_BASE}/${path}.json`);
  if (!res.ok) throw new Error(`HN ${listKey} fetch failed: ${res.status}`);
  const ids = await res.json();
  return Array.isArray(ids) ? ids : [];
}

// Parallel fetch up to `max` items
export async function fetchItemsBatch(ids, max = 30) {
  const slice = ids.slice(0, max);
  const results = await Promise.all(slice.map((id) => fetchItem(id).catch(() => null)));
  return results.filter((it) => it && !it.deleted && !it.dead);
}

// Extract origin domain from item url (or null if Ask/Show without external url)
export function extractDomain(url) {
  if (!url) return "";
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

// Checks if the post's author replied in any top-level comment.
// item must already have its `kids` array populated.
export async function checkOPActive(item, sampleSize = 8) {
  if (!item || !item.by || !Array.isArray(item.kids) || item.kids.length === 0) return false;
  const slice = item.kids.slice(0, sampleSize);
  const results = await Promise.all(slice.map((id) => fetchItem(id).catch(() => null)));
  return results.some((c) => c && !c.deleted && !c.dead && c.by === item.by);
}

// Returns "show" | "ask" | "launch" | "tell" | "poll" | null based on title prefix
export function detectItemType(title) {
  if (!title) return null;
  const lower = title.toLowerCase();
  if (lower.startsWith("show hn:"))    return "show";
  if (lower.startsWith("ask hn:"))     return "ask";
  if (lower.startsWith("launch hn:"))  return "launch";
  if (lower.startsWith("tell hn:"))    return "tell";
  if (lower.startsWith("poll:"))       return "poll";
  return null;
}
