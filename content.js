// NODUS HN Radar — content script
// Applies Lens features: theme, visited tracking, post-type highlights.
// Runs at document_start so the body class is set before HN paints.

(function () {
  "use strict";

  let settings = null;

  // Apply settings as classes on <html> so CSS variables cascade everywhere.
  // Done as early as possible to avoid flash of un-styled content.
  init();

  async function init() {
    // Pull settings synchronously via chrome.storage (still async, but fast)
    try {
      const stored = await getSettings();
      settings = stored;
      applyRootClasses(settings);
    } catch {
      settings = defaultSettings();
      applyRootClasses(settings);
    }

    // Wait for DOM to be ready before annotating posts
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", onReady, { once: true });
    } else {
      onReady();
    }

    // Listen for settings changes + pin changes from side panel
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === "LENS_SETTINGS_UPDATED") {
        const prev = settings || {};
        settings = msg.settings;
        applyRootClasses(settings);
        // Update "Translate page to XX" label if target language changed
        if (prev.translateTo !== settings.translateTo) {
          const txEl = document.querySelector(".lens-translate-all .tx");
          if (txEl && translateAllState === "none") {
            txEl.textContent = `Translate page to ${resolveTargetLang().toUpperCase()}`;
          }
        }
      } else if (msg.type === "LENS_PIN_CHANGED") {
        const pinEl = document.querySelector(`.lens-pin[data-post-id="${msg.postId}"]`);
        const athingRow = document.getElementById(String(msg.postId));
        if (athingRow) setPinVisualState(athingRow, pinEl, !!msg.pinned);
      } else if (msg.type === "LENS_TAGS_CHANGED") {
        const athingRow = document.getElementById(String(msg.postId));
        if (athingRow) renderTagsOnRow(athingRow, msg.tags || []);
      }
    });
  }

  function onReady() {
    annotatePosts();
    annotateOP();
    attachClickTracking();
    // HN occasionally rewrites parts of the page — observe for new posts
    const main = document.getElementById("hnmain");
    if (main) {
      const obs = new MutationObserver(() => {
        annotatePosts();
        annotateOP();
      });
      obs.observe(main, { childList: true, subtree: true });
    }
  }

  // ── Settings ─────────────────────────────────────────────

  function defaultSettings() {
    return {
      enabled: true, theme: "auto", fontSize: "medium",
      width: "normal", compact: false, markVisited: true,
      highlightShow: true, highlightAsk: true, highlightLaunch: true,
      translateTo: "",
      zebraEnabled: false, zebraColor: "#ff8800"
    };
  }

  // Convert hex like "#ff8800" to rgba(...) with given alpha
  function hexToRgba(hex, alpha) {
    const m = String(hex || "").match(/#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
    if (!m) return `rgba(255,136,0,${alpha})`;
    return `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${alpha})`;
  }

  function resolveTargetLang() {
    if (settings?.translateTo) return settings.translateTo;
    return (navigator.language || "en").split("-")[0].toLowerCase();
  }

  // In-memory cache: text → translated result for this session
  const titleTransCache = new Map();

  function getSettings() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(["settings"], (res) => {
        if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
        resolve({ ...defaultSettings(), ...(res.settings || {}) });
      });
    });
  }

  function resolvedTheme(theme) {
    if (theme === "auto") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return theme;
  }

  function applyRootClasses(s) {
    const r = document.documentElement;
    // Wipe all our classes, then re-apply
    Array.from(r.classList).forEach(c => { if (c.startsWith("lens-")) r.classList.remove(c); });

    if (!s.enabled) {
      r.classList.add("lens-off");
      return;
    }

    r.classList.add("lens-on");
    r.classList.add(`lens-theme-${resolvedTheme(s.theme)}`);
    r.classList.add(`lens-font-${s.fontSize}`);
    r.classList.add(`lens-width-${s.width}`);
    if (s.compact) r.classList.add("lens-compact");
    if (s.markVisited) r.classList.add("lens-mark-visited");
    if (s.highlightShow) r.classList.add("lens-hl-show");
    if (s.highlightAsk) r.classList.add("lens-hl-ask");
    if (s.highlightLaunch) r.classList.add("lens-hl-launch");

    if (s.zebraEnabled) {
      r.classList.add("lens-zebra");
      const alpha = Math.max(0.02, Math.min(0.5, (s.zebraIntensity || 12) / 100));
      r.style.setProperty("--lens-zebra-color", hexToRgba(s.zebraColor || "#ff8800", alpha));
    } else {
      r.style.removeProperty("--lens-zebra-color");
    }
  }

  // React to OS color scheme changes when theme="auto"
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (settings && settings.theme === "auto") applyRootClasses(settings);
  });

  // ── Post annotation ──────────────────────────────────────

  function annotatePosts() {
    const rows = document.querySelectorAll("tr.athing");
    let plainIdx = 0; // counter that advances only for non-typed, non-pinned posts

    rows.forEach((row) => {
      // First-pass annotation (only once per row)
      if (row.dataset.lensAnnotated !== "1") {
        row.dataset.lensAnnotated = "1";

        const titleLink = row.querySelector(".titleline > a");
        if (titleLink) {
          const title = (titleLink.textContent || "").trim();
          const lower = title.toLowerCase();

          // Post type tagging via title prefix
          let type = null;
          if (lower.startsWith("show hn:"))         { row.classList.add("lens-show");   type = "show"; }
          else if (lower.startsWith("ask hn:"))     { row.classList.add("lens-ask");    type = "ask"; }
          else if (lower.startsWith("launch hn:"))  { row.classList.add("lens-launch"); type = "launch"; }
          else if (lower.startsWith("tell hn:"))    { row.classList.add("lens-tell");   type = "tell"; }
          else if (lower.startsWith("poll:"))       { row.classList.add("lens-poll");   type = "poll"; }
          row.dataset.lensType = type || "";

          if (type) injectTypeBadge(row, type);
          annotateVisited(row);
          injectPinButton(row);
          injectTranslateButton(row);
        }
      }

      // Zebra index — only increments for "plain" posts (no type, no pin).
      // Typed/pinned posts get their own tint and stay outside the zebra pattern.
      const isPlain = !row.classList.contains("lens-show")
                   && !row.classList.contains("lens-ask")
                   && !row.classList.contains("lens-launch")
                   && !row.classList.contains("lens-tell")
                   && !row.classList.contains("lens-poll")
                   && !row.classList.contains("lens-pinned");

      if (isPlain) {
        row.classList.toggle("lens-zebra-even", plainIdx % 2 === 0);
        row.classList.toggle("lens-zebra-odd",  plainIdx % 2 === 1);
        plainIdx++;
      } else {
        row.classList.remove("lens-zebra-even");
        row.classList.remove("lens-zebra-odd");
      }
    });

    // Inject the "Translate all" bar above the post list (once)
    injectTranslateAllBar();
  }

  // ── Per-post translate button + global bar ───────────────

  function injectTranslateButton(athingRow) {
    const titleline = athingRow.querySelector(".titleline");
    if (!titleline) return;
    if (titleline.querySelector(".lens-trans-btn")) return;
    if (titleline.querySelector(".lens-trans-badge")) return; // already translated

    const btn = document.createElement("button");
    btn.className = "lens-trans-btn";
    btn.type = "button";
    btn.title = "Translate this title";
    btn.textContent = "🌐";
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (btn.dataset.busy === "1") return;
      btn.dataset.busy = "1";
      btn.disabled = true;
      btn.classList.add("loading");
      btn.textContent = "⏳";

      const ok = await translatePostTitle(athingRow);

      if (ok) {
        btn.remove();
        return;
      }
      // No-op (same language) or translation unavailable — restore button with hint
      btn.classList.remove("loading");
      btn.classList.add("no-op");
      btn.textContent = "🌐";
      btn.disabled = false;
      delete btn.dataset.busy;
      btn.title = "Already in your target language, or translation unavailable";
      setTimeout(() => {
        btn.classList.remove("no-op");
        btn.title = "Translate this title";
      }, 2500);
    });
    titleline.appendChild(btn);
  }

  function injectTranslateAllBar() {
    if (document.getElementById("lens-translate-bar")) return;
    const list = document.querySelector(".itemlist");
    if (!list) return;

    const target = resolveTargetLang();
    const bar = document.createElement("div");
    bar.id = "lens-translate-bar";
    bar.className = "lens-translate-bar";
    bar.innerHTML = `
      <button class="lens-translate-all" type="button">
        <span class="ti">🌐</span>
        <span class="tx">Translate page to ${target.toUpperCase()}</span>
      </button>
    `;
    list.parentNode.insertBefore(bar, list);

    bar.querySelector(".lens-translate-all").addEventListener("click", onTranslateAllClick);
  }

  let translateAllState = "none"; // "none" | "translated"

  async function onTranslateAllClick(e) {
    e.preventDefault();
    const btn  = e.currentTarget;
    const txEl = btn.querySelector(".tx");
    const target = resolveTargetLang();

    if (translateAllState === "translated") {
      // Restore all originals
      document.querySelectorAll("tr.athing").forEach(restoreOriginalTitle);
      // Re-inject the per-post buttons that we removed earlier
      document.querySelectorAll("tr.athing").forEach(injectTranslateButton);
      translateAllState = "none";
      txEl.textContent = `Translate page to ${target.toUpperCase()}`;
      btn.classList.remove("active");
      return;
    }

    btn.disabled = true;
    btn.classList.add("loading");
    txEl.textContent = "Translating…";

    const rows = Array.from(document.querySelectorAll("tr.athing"));
    // Process in parallel but bounded to avoid hammering Translator API
    const CONCURRENCY = 5;
    for (let i = 0; i < rows.length; i += CONCURRENCY) {
      const batch = rows.slice(i, i + CONCURRENCY);
      await Promise.all(batch.map((r) => translatePostTitle(r)));
    }

    // Remove leftover per-post buttons (rows that were already translated)
    document.querySelectorAll(".lens-trans-btn").forEach((b) => b.remove());

    btn.disabled = false;
    btn.classList.remove("loading");
    btn.classList.add("active");
    translateAllState = "translated";
    txEl.textContent = `↩ Restore originals`;
  }

  function restoreOriginalTitle(athingRow) {
    const link = athingRow.querySelector(".titleline > a:first-of-type");
    if (!link) return;
    if (!link.dataset.lensOriginal) return;
    link.textContent = link.dataset.lensOriginal;
    delete link.dataset.lensOriginal;
    delete link.dataset.lensTranslated;
    delete link.dataset.lensShowing;
    const badge = athingRow.querySelector(".lens-trans-badge");
    if (badge) badge.remove();
  }

  // ── Post title translation (via background proxy) ────────

  async function translatePostTitle(athingRow) {
    const titleline = athingRow.querySelector(".titleline");
    if (!titleline) return false;
    const link = titleline.querySelector("a:first-of-type");
    if (!link) return false;
    if (link.dataset.lensTranslating === "1") return false;
    if (link.dataset.lensOriginal) return true; // already translated counts as success

    const original = (link.textContent || "").trim();
    if (!original) return false;

    const target = resolveTargetLang();
    if (!target) return false;

    const cacheKey = `${target}::${original}`;
    let result = titleTransCache.get(cacheKey);

    if (!result) {
      link.dataset.lensTranslating = "1";
      try {
        result = await new Promise((resolve) => {
          chrome.runtime.sendMessage(
            { type: "TRANSLATE_TEXT", text: original, targetLang: target },
            (res) => { void chrome.runtime.lastError; resolve(res); }
          );
        });
      } catch { result = null; }
      delete link.dataset.lensTranslating;
      if (result) titleTransCache.set(cacheKey, result);
    }

    if (!result || !result.translated) return false;
    applyTitleTranslation(link, original, result.translated, result.sourceLang || "??", target);
    return true;
  }

  function applyTitleTranslation(link, original, translated, sourceLang, targetLang) {
    link.dataset.lensOriginal   = original;
    link.dataset.lensTranslated = translated;
    link.dataset.lensShowing    = "translated";
    link.textContent            = translated;

    // Skip if badge already exists
    if (link.parentElement.querySelector(".lens-trans-badge")) return;

    const badge = document.createElement("span");
    badge.className = "lens-trans-badge";
    badge.textContent = `🌐 ${sourceLang.toUpperCase()}→${targetLang.toUpperCase()}`;
    badge.title = "Click to see original title";
    badge.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (link.dataset.lensShowing === "translated") {
        link.textContent = link.dataset.lensOriginal;
        link.dataset.lensShowing = "original";
        badge.style.opacity = "0.55";
        badge.title = "Click to see translation";
      } else {
        link.textContent = link.dataset.lensTranslated;
        link.dataset.lensShowing = "translated";
        badge.style.opacity = "1";
        badge.title = "Click to see original title";
      }
    });
    link.parentNode.insertBefore(badge, link.nextSibling);
  }

  // ── Type badge (SHOW / ASK / LAUNCH / TELL / POLL) ──────

  function injectTypeBadge(athingRow, type) {
    const titleline = athingRow.querySelector(".titleline");
    if (!titleline) return;
    if (titleline.querySelector(".lens-type-badge")) return;

    const badge = document.createElement("span");
    badge.className = `lens-type-badge lens-tb-${type}`;
    badge.textContent = type.toUpperCase();
    badge.title = "Open NODUS HN Radar";
    badge.addEventListener("click", openSidePanelHandler);

    // Insert at the very start of titleline (before any link or other badge)
    titleline.insertBefore(badge, titleline.firstChild);
  }

  function openSidePanelHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    chrome.runtime.sendMessage({ type: "OPEN_SIDE_PANEL" }, () => {
      void chrome.runtime.lastError;
    });
  }

  // ── Pin button ───────────────────────────────────────────

  function injectPinButton(athingRow) {
    const id = athingRow.id;
    if (!id) return;
    const subtextRow = athingRow.nextElementSibling;
    if (!subtextRow) return;
    const subline = subtextRow.querySelector(".subline");
    if (!subline) return;
    if (subline.querySelector(".lens-pin")) return; // already injected

    // Find the "hide" link to insert before it; fallback to end of subline
    const hider = subline.querySelector(".hider");

    const sep = document.createTextNode(" | ");
    const pin = document.createElement("a");
    pin.href = "#";
    pin.className = "lens-pin";
    pin.dataset.postId = id;
    pin.title = "Pin to follow";
    pin.innerHTML = `<span class="lens-pin-icon">📌</span>`;

    if (hider) {
      subline.insertBefore(pin, hider);
      subline.insertBefore(sep, hider);
    } else {
      subline.appendChild(sep);
      subline.appendChild(pin);
    }

    // Reflect current pin state
    isPinnedRaw(id).then((pinned) => {
      setPinVisualState(athingRow, pin, pinned);
    });

    pin.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const pinnedNow = await togglePin(athingRow);
      setPinVisualState(athingRow, pin, pinnedNow);
    });
  }

  // Centralized: update both the pin icon and the title badge.
  function setPinVisualState(athingRow, pinEl, pinned) {
    if (pinEl) {
      pinEl.classList.toggle("pinned", !!pinned);
      pinEl.title = pinned ? "Unpin" : "Pin to follow";
    }
    athingRow.classList.toggle("lens-pinned", !!pinned);

    const titleline = athingRow.querySelector(".titleline");
    if (!titleline) return;
    const existing = titleline.querySelector(".lens-pin-badge");

    if (pinned && !existing) {
      const badge = document.createElement("span");
      badge.className = "lens-pin-badge";
      badge.textContent = "PIN";
      badge.title = "Open NODUS HN Radar";
      badge.addEventListener("click", openSidePanelHandler);
      titleline.insertBefore(badge, titleline.firstChild);
    } else if (!pinned && existing) {
      existing.remove();
    }

    if (pinned) refreshTagsForPost(athingRow);
    else removeTagsFromPost(athingRow);

    // Pin/unpin changes the set of "plain" posts → re-index zebra
    reindexZebra();
  }

  function reindexZebra() {
    let plainIdx = 0;
    document.querySelectorAll("tr.athing").forEach((row) => {
      const isPlain = !row.classList.contains("lens-show")
                   && !row.classList.contains("lens-ask")
                   && !row.classList.contains("lens-launch")
                   && !row.classList.contains("lens-tell")
                   && !row.classList.contains("lens-poll")
                   && !row.classList.contains("lens-pinned");
      if (isPlain) {
        row.classList.toggle("lens-zebra-even", plainIdx % 2 === 0);
        row.classList.toggle("lens-zebra-odd",  plainIdx % 2 === 1);
        plainIdx++;
      } else {
        row.classList.remove("lens-zebra-even");
        row.classList.remove("lens-zebra-odd");
      }
    });
  }

  // ── Tag rendering on HN page (propagated from side panel) ──

  async function refreshTagsForPost(athingRow) {
    const id = athingRow.id;
    if (!id) return;
    const map = await new Promise((resolve) => {
      chrome.storage.local.get(["pinned"], (res) => resolve(res.pinned || {}));
    });
    const tags = (map[id] && Array.isArray(map[id].tags)) ? map[id].tags : [];
    renderTagsOnRow(athingRow, tags);
  }

  function removeTagsFromPost(athingRow) {
    const wrap = athingRow.querySelector(".lens-tags-inline");
    if (wrap) wrap.remove();
  }

  function tagHue(tag) {
    if (!tag) return 25;
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = ((hash << 5) - hash) + tag.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % 360;
  }

  function renderTagsOnRow(athingRow, tags) {
    const titleline = athingRow.querySelector(".titleline");
    if (!titleline) return;
    let wrap = titleline.querySelector(".lens-tags-inline");

    if (!tags || tags.length === 0) {
      if (wrap) wrap.remove();
      return;
    }

    if (!wrap) {
      wrap = document.createElement("span");
      wrap.className = "lens-tags-inline";
      titleline.appendChild(wrap);
    }
    wrap.innerHTML = "";
    tags.forEach((t) => {
      const chip = document.createElement("span");
      chip.className = "lens-tag-chip";
      chip.textContent = t;
      chip.style.setProperty("--tag-hue", tagHue(t));
      chip.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openSidePanelHandler(e);
      });
      wrap.appendChild(chip);
    });
  }

  function isPinnedRaw(id) {
    return new Promise((resolve) => {
      chrome.storage.local.get(["pinned"], (res) => resolve(!!(res.pinned && res.pinned[id])));
    });
  }

  async function togglePin(athingRow) {
    const id = athingRow.id;
    if (!id) return false;
    return new Promise((resolve) => {
      chrome.storage.local.get(["pinned"], (res) => {
        const map = res.pinned || {};
        if (map[id]) {
          delete map[id];
          chrome.storage.local.set({ pinned: map }, () => resolve(false));
        } else {
          map[id] = extractPostSnapshot(athingRow);
          chrome.storage.local.set({ pinned: map }, () => resolve(true));
        }
      });
    });
  }

  function extractPostSnapshot(athingRow) {
    const id = athingRow.id;
    const titleLink = athingRow.querySelector(".titleline > a");
    const siteEl    = athingRow.querySelector(".sitestr");
    const sub       = athingRow.nextElementSibling;
    const scoreEl   = sub?.querySelector(".score");
    const userEl    = sub?.querySelector(".hnuser");
    const ageEl     = sub?.querySelector(".age a");
    const commLink  = sub?.querySelector("a[href^='item?id=']:last-of-type");

    // Parse "142 points" → 142
    const score = scoreEl ? parseInt((scoreEl.textContent || "").replace(/\D/g, ""), 10) || 0 : 0;
    // Parse "42 comments" or "discuss"
    let comments = 0;
    if (commLink) {
      const m = (commLink.textContent || "").match(/(\d+)/);
      if (m) comments = parseInt(m[1], 10);
    }

    return {
      id,
      title:    (titleLink?.textContent || "").trim(),
      url:      titleLink?.href || `https://news.ycombinator.com/item?id=${id}`,
      domain:   siteEl?.textContent?.trim() || "news.ycombinator.com",
      score,
      comments,
      author:   userEl?.textContent?.trim() || "",
      ageText:  ageEl?.textContent?.trim() || "",
      itemUrl:  `https://news.ycombinator.com/item?id=${id}`,
      type:     athingRow.dataset.lensType || ""
    };
  }

  async function annotateVisited(row) {
    const id = row.id;
    if (!id) return;
    const raw = await getVisitedRaw();
    if (raw[id]) row.classList.add("lens-visited");
  }

  // On item pages, mark comments where the author is the same as the post author (OP).
  function annotateOP() {
    // Only run on item pages
    if (!/\/item\?/.test(location.search) && !/\/item$/.test(location.pathname)) return;

    // Find the original poster: first .hnuser inside the fatitem (story header)
    const fatitem = document.querySelector(".fatitem");
    if (!fatitem) return;
    const opLink = fatitem.querySelector(".hnuser");
    if (!opLink) return;
    const opName = (opLink.textContent || "").trim();
    if (!opName) return;

    // Mark every comment by this user
    document.querySelectorAll("tr.comtr").forEach((row) => {
      if (row.dataset.lensOp === "1") return;
      const userEl = row.querySelector(".comhead .hnuser");
      if (!userEl) return;
      const name = (userEl.textContent || "").trim();
      if (name === opName) {
        row.classList.add("lens-op");
        row.dataset.lensOp = "1";
      }
    });
  }

  function getVisitedRaw() {
    return new Promise((resolve) => {
      chrome.storage.local.get(["visited"], (res) => resolve(res.visited || {}));
    });
  }

  // ── Click tracking ───────────────────────────────────────

  function attachClickTracking() {
    document.addEventListener("click", (e) => {
      const link = e.target.closest(".titleline > a, .subtext a[href^='item?']");
      if (!link) return;

      // Find the post row
      const row = link.closest("tr.athing") ||
                  document.querySelector(`tr.athing#${(link.getAttribute("href") || "").match(/id=(\d+)/)?.[1]}`);
      if (!row) return;

      const id = row.id;
      if (!id) return;

      // Store and mark
      chrome.storage.local.get(["visited"], (res) => {
        const raw = res.visited || {};
        raw[id] = Date.now();
        chrome.storage.local.set({ visited: raw });
      });
      row.classList.add("lens-visited");
    }, true);
  }
})();
