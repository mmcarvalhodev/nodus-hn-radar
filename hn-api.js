// NODUS HN Radar — Hacker News Firebase API client
// Public API, no auth, no rate limit beyond reasonable use.
// Docs: https://github.com/HackerNews/API

const HN_BASE = "https://hacker-news.firebaseio.com/v0";

export async function fetchItem(id) {
  const res = await fetch(`${HN_BASE}/item/${id}.json`);
  if (!res.ok) throw new Error(`HN item ${id} failed: ${res.status}`);
  return res.json();
}

// Fetches the top-N first-level comments of a post.
// Skips dead/deleted comments.
export async function fetchTopComments(postId, maxComments = 5) {
  const post = await fetchItem(postId);
  if (!post || !Array.isArray(post.kids) || post.kids.length === 0) return [];

  // Fetch a few extra to compensate for deleted ones
  const slice = post.kids.slice(0, maxComments + 2);
  const results = await Promise.all(slice.map((id) => fetchItem(id).catch(() => null)));

  const visible = results.filter((c) => c && !c.deleted && !c.dead && c.text);
  return visible.slice(0, maxComments).map((c) => ({
    id:      c.id,
    by:      c.by || "[deleted]",
    time:    c.time || 0,
    text:    c.text || "",
    replies: Array.isArray(c.kids) ? c.kids.length : 0
  }));
}

// Helper: turn HN's "time" (unix seconds) into a relative string like "2h ago".
export function relativeTime(unixSeconds) {
  if (!unixSeconds) return "";
  const diff = Math.floor(Date.now() / 1000) - Number(unixSeconds);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ── Translation via Chrome Translator API (built-in, free, local) ──
// Chrome 138+ exposes Translator and LanguageDetector globals.
// Older versions used self.ai.translator namespace — we try both.

function getTranslatorImpl() {
  const g = (typeof self !== "undefined") ? self : (typeof window !== "undefined" ? window : globalThis);
  if (!g) return null;
  if (g.Translator)            return g.Translator;           // Chrome 138+ stable
  if (g.ai?.translator)        return g.ai.translator;        // Older origin-trial path
  return null;
}

function getLanguageDetectorImpl() {
  const g = (typeof self !== "undefined") ? self : (typeof window !== "undefined" ? window : globalThis);
  if (!g) return null;
  if (g.LanguageDetector)      return g.LanguageDetector;
  if (g.ai?.languageDetector)  return g.ai.languageDetector;
  return null;
}

export function isTranslatorAvailable() {
  return !!getTranslatorImpl();
}

function describeErr(e) {
  if (!e) return "unknown";
  const name = e.name || e.constructor?.name || "Error";
  const msg = e.message || String(e);
  return `${name}: ${msg || "(no message)"}`;
}

// Detect source language. Returns "en" if anything fails (safe fallback).
async function detectSourceLang(text) {
  const LD = getLanguageDetectorImpl();
  if (!LD) return "en";

  try {
    // LanguageDetector has its own availability — skip if model not ready
    if (LD.availability) {
      const ldAvail = await LD.availability();
      if (ldAvail === "unavailable") {
        console.warn("[HN Radar] LanguageDetector model unavailable");
        return "en";
      }
      if (ldAvail !== "available") {
        // "downloadable" or "downloading" — don't block on download, just default to en
        console.debug(`[HN Radar] LanguageDetector state: ${ldAvail} — defaulting to en`);
        return "en";
      }
    }
    const det = await LD.create();
    const results = await det.detect(text);
    const top = results && results[0];
    if (top && top.detectedLanguage && top.confidence > 0.4) {
      return top.detectedLanguage;
    }
  } catch (e) {
    console.warn("[HN Radar] LanguageDetector threw:", describeErr(e));
  }
  return "en";
}

export async function translateText(text, targetLang) {
  if (!text || !targetLang) return null;

  const T = getTranslatorImpl();
  if (!T) {
    console.warn("[HN Radar] Translator API not exposed");
    return null;
  }

  const sourceLang = await detectSourceLang(text);
  if (sourceLang === targetLang) return null;

  // Step 1: check availability
  let avail;
  try {
    avail = await T.availability({ sourceLanguage: sourceLang, targetLanguage: targetLang });
  } catch (e) {
    console.warn(`[HN Radar] Translator.availability ${sourceLang}→${targetLang}:`, describeErr(e));
    return null;
  }
  console.debug(`[HN Radar] Translator ${sourceLang}→${targetLang}: ${avail}`);
  if (avail === "unavailable") return null;

  // Step 2: create translator (may trigger ~25MB model download on first use)
  let translator;
  try {
    translator = await T.create({ sourceLanguage: sourceLang, targetLanguage: targetLang });
  } catch (e) {
    console.warn(`[HN Radar] Translator.create ${sourceLang}→${targetLang}:`, describeErr(e));
    return null;
  }

  // Step 3: translate
  try {
    const translated = await translator.translate(text);
    return { translated, sourceLang };
  } catch (e) {
    console.warn(`[HN Radar] translate() ${sourceLang}→${targetLang}:`, describeErr(e));
    return null;
  }
}

// Strip HTML from HN comment text. HN uses <p>, <i>, <a>, <pre><code>.
// We render as plain text snippet to keep things safe and compact.
export function commentToPlainText(html, maxChars = 280) {
  if (!html) return "";
  // Replace <p> with double newline before stripping, to preserve structure
  let text = String(html)
    .replace(/<p>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&nbsp;/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (text.length > maxChars) text = text.slice(0, maxChars).replace(/\s+\S*$/, "") + "…";
  return text;
}
