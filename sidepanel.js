import {
  getSettings, saveSettings, DEFAULT_SETTINGS,
  getPinnedMap, removePin,
  getFromStorage, setToStorage,
  getCachedComments, setCachedComments,
  setPinnedTags, pushRecentTag, getRecentTags, normalizeTag, tagHue,
  getCollapsedCards, setCardCollapsed,
  getRadarStore, updateRadarSnapshots, computeVelocityDetail,
  getMutedDomains, setMutedDomains,
  getCachedOPActive, setCachedOPActive
} from "./storage.js";
import { fetchTopComments, relativeTime, commentToPlainText, translateText, isTranslatorAvailable } from "./hn-api.js";
import { fetchListIds, fetchItemsBatch, extractDomain, detectItemType, checkOPActive } from "./hn-data.js";
import { LANGUAGES, RTL_LANGS, detectLanguage, setLanguage, t, tr, applyI18n } from "./i18n.js";

const $ = (id) => document.getElementById(id);

let settings = { ...DEFAULT_SETTINGS };

document.addEventListener("DOMContentLoaded", async () => {
  settings = await getSettings();

  // ── i18n init ────
  const lang = settings.uiLanguage || detectLanguage();
  setLanguage(lang);
  applyI18n();
  document.documentElement.dir = RTL_LANGS.has(lang) ? "rtl" : "ltr";

  // Populate UI language picker
  const langSel = $("uiLanguage");
  if (langSel) {
    LANGUAGES.forEach(({ code, label }) => {
      const opt = document.createElement("option");
      opt.value = code;
      opt.textContent = label;
      langSel.appendChild(opt);
    });
    langSel.value = lang;
    langSel.addEventListener("change", async () => {
      const newLang = langSel.value;
      settings.uiLanguage = newLang;
      setLanguage(newLang);
      document.documentElement.dir = RTL_LANGS.has(newLang) ? "rtl" : "ltr";
      applyI18n();
      await saveSettings(settings);
      updateTransHint();
      renderPinned();
    });
  }

  // ── Master toggle ────
  $("enabled").checked = settings.enabled;
  $("enabled").addEventListener("change", () => {
    settings.enabled = $("enabled").checked;
    persistAndBroadcast();
    updateSettingsState();
  });

  // ── Segmented controls ────
  document.querySelectorAll(".seg").forEach((seg) => {
    const key = seg.dataset.key;
    seg.querySelectorAll("button").forEach((btn) => {
      const value = btn.dataset.value;
      if (settings[key] === value) btn.classList.add("active");
      btn.addEventListener("click", () => {
        settings[key] = value;
        seg.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        persistAndBroadcast();
      });
    });
  });

  // ── Checkboxes ────
  const checkIds = ["compact", "markVisited", "highlightShow", "highlightAsk", "highlightLaunch", "autoTranslate", "autoTranslatePinned", "zebraEnabled"];
  checkIds.forEach((id) => {
    $(id).checked = !!settings[id];
    $(id).addEventListener("change", () => {
      settings[id] = $(id).checked;
      persistAndBroadcast();
      if (id === "autoTranslatePinned") renderPinned();
    });
  });

  // ── Translation language picker ────
  $("translateTo").value = settings.translateTo || "";
  $("translateTo").addEventListener("change", () => {
    settings.translateTo = $("translateTo").value;
    persistAndBroadcast();
    if (settings.autoTranslatePinned) renderPinned();
  });

  updateTransHint();

  // ── Zebra color picker + intensity ────
  const zebraColorEl = $("zebraColor");
  if (zebraColorEl) {
    zebraColorEl.value = settings.zebraColor || "#ff8800";
    zebraColorEl.addEventListener("input", () => {
      settings.zebraColor = zebraColorEl.value;
      persistAndBroadcast();
    });
  }

  const zebraIntEl = $("zebraIntensity");
  const zebraIntValEl = $("zebraIntensityValue");
  if (zebraIntEl) {
    const initial = settings.zebraIntensity || 12;
    zebraIntEl.value = initial;
    if (zebraIntValEl) zebraIntValEl.textContent = `${initial}%`;
    zebraIntEl.addEventListener("input", () => {
      const v = Number(zebraIntEl.value) || 12;
      settings.zebraIntensity = v;
      if (zebraIntValEl) zebraIntValEl.textContent = `${v}%`;
      persistAndBroadcast();
    });
  }

  updateSettingsState();

  // ── Muted domains textarea ────
  const mutedEl = $("mutedDomains");
  if (mutedEl) {
    const initial = await getMutedDomains();
    mutedEl.value = initial.join("\n");
    let mutedTimer = null;
    mutedEl.addEventListener("input", () => {
      clearTimeout(mutedTimer);
      mutedTimer = setTimeout(async () => {
        const list = mutedEl.value.split(/\r?\n/);
        await setMutedDomains(list);
        loadRadar(activeRadarCat); // re-render radar with new filter
      }, 500);
    });
  }

  // ── Pinned section ────
  renderPinned();
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes.pinned) renderPinned();
  });

  // ── Collapsible panels ────
  initCollapsiblePanels();

  // ── Radar ────
  initRadar();
});

async function initCollapsiblePanels() {
  // Defaults: pinned + radar expanded, settings collapsed (matches HTML)
  const stored = (await getFromStorage("panelStates")) || { pinned: false, radar: false, settings: true };

  document.querySelectorAll(".panel[data-panel-key]").forEach((panel) => {
    const key = panel.dataset.panelKey;
    const collapsed = stored[key];
    if (typeof collapsed === "boolean") {
      panel.classList.toggle("collapsed", collapsed);
    }

    const head = panel.querySelector(".panel-head[data-collapsible]");
    if (!head) return;
    head.addEventListener("click", async () => {
      const nowCollapsed = panel.classList.toggle("collapsed");
      const states = (await getFromStorage("panelStates")) || {};
      states[key] = nowCollapsed;
      await setToStorage("panelStates", states);
    });
  });
}

function updateTransHint() {
  const hintEl = $("translate-hint");
  if (!hintEl) return;
  if (isTranslatorAvailable()) {
    hintEl.textContent = tr("settings.transReady");
    hintEl.classList.remove("warning");
  } else {
    hintEl.textContent = tr("settings.transUnavailable");
    hintEl.classList.add("warning");
  }
}

function updateSettingsState() {
  const panel = $("settings-panel");
  if (!panel) return;
  if (settings.enabled) panel.classList.remove("disabled");
  else panel.classList.add("disabled");
}

async function persistAndBroadcast() {
  await saveSettings(settings);
  chrome.runtime.sendMessage({ type: "BROADCAST_SETTINGS", settings }, () => {
    void chrome.runtime.lastError;
  });
}

// ── Pinned posts rendering ──────────────────────────────

async function renderPinned() {
  const map = await getPinnedMap();
  const collapsedMap = await getCollapsedCards();
  const entries = Object.values(map).sort((a, b) => (b.pinnedAt || 0) - (a.pinnedAt || 0));
  entries.forEach((p) => { p._collapsed = !!collapsedMap[p.id]; });

  const listEl  = $("pinned-list");
  const emptyEl = $("pinned-empty");
  const countEl = $("pinned-count");

  countEl.textContent = entries.length === 0 ? "0" : String(entries.length);

  if (entries.length === 0) {
    emptyEl.hidden = false;
    listEl.hidden = true;
    listEl.innerHTML = "";
    return;
  }

  emptyEl.hidden = true;
  listEl.hidden = false;
  listEl.innerHTML = "";

  // Optionally translate titles before rendering
  const target = resolveTargetLang();
  const doTranslate = settings.autoTranslatePinned && target && isTranslatorAvailable();

  if (doTranslate) {
    await Promise.all(entries.map(async (p) => {
      const res = await translateText(p.title || "", target);
      if (res && res.translated) {
        p._translatedTitle = res.translated;
        p._sourceLang = res.sourceLang;
        p._targetLang = target;
      }
    }));
  }

  entries.forEach((p) => listEl.appendChild(buildPinnedCard(p)));
}

function buildPinnedCard(post) {
  const card = document.createElement("div");
  card.className = "pinned-card";
  card.dataset.id = post.id;
  if (post._collapsed) card.classList.add("card-collapsed");

  const typeBadge = post.type
    ? `<span class="pinned-card-type ${escapeAttr(post.type)}">${escapeText(post.type)}</span>`
    : "";

  const hasTranslation = !!post._translatedTitle;
  const displayTitle = hasTranslation ? post._translatedTitle : (post.title || "(no title)");
  const transBadge = hasTranslation
    ? `<span class="pinned-card-trans" title="Click to see original" data-original="${escapeAttr(post.title || "")}" data-translated="${escapeAttr(post._translatedTitle)}">🌐 ${(post._sourceLang || "?").toUpperCase()}→${(post._targetLang || "?").toUpperCase()}</span>`
    : "";

  card.innerHTML = `
    <div class="pinned-card-actions">
      <button class="card-chevron" type="button" title="${escapeAttr(post._collapsed ? tr("pinned.expand") : tr("pinned.collapse"))}">▾</button>
      <button class="pinned-card-unpin" title="${escapeAttr(tr("pinned.unpin"))}">×</button>
    </div>
    <div class="pinned-card-title">${typeBadge}<span class="pinned-card-title-text">${escapeText(displayTitle)}</span>${transBadge}</div>
    <div class="pinned-card-collapsible">
      ${post.domain ? `<div class="pinned-card-domain">${escapeText(post.domain)}</div>` : ""}
      <div class="pinned-card-meta">
        <span class="pin-score">${post.score || 0} ${escapeText(tr("pinned.pointsUnit"))}</span>
        <span class="sep">·</span>
        <span class="pinned-card-comments" data-id="${escapeAttr(post.id)}" title="${escapeAttr(tr("pinned.hoverHint"))}">
          ${post.comments || 0} ${escapeText(tr("pinned.commentsUnit"))}
        </span>
        ${post.ageText ? `<span class="sep">·</span><span>${escapeText(post.ageText)}</span>` : ""}
      </div>
      <div class="pinned-card-tags" data-post-id="${escapeAttr(post.id)}"></div>
      <div class="pinned-card-preview" hidden></div>
    </div>
  `;

  renderTagsInCard(card, post);

  // Open post on card click — but ignore clicks on inner controls
  card.addEventListener("click", (e) => {
    if (e.target.closest(".pinned-card-unpin")) return;
    if (e.target.closest(".pinned-card-comments")) return;
    if (e.target.closest(".pinned-card-preview")) return;
    if (e.target.closest(".pinned-card-trans")) return;
    chrome.tabs.create({ url: post.itemUrl || `https://news.ycombinator.com/item?id=${post.id}` });
  });

  // Toggle translated/original title on badge click
  const transEl = card.querySelector(".pinned-card-trans");
  const titleTextEl = card.querySelector(".pinned-card-title-text");
  if (transEl && titleTextEl) {
    let showingTranslated = true;
    transEl.addEventListener("click", (e) => {
      e.stopPropagation();
      showingTranslated = !showingTranslated;
      titleTextEl.textContent = showingTranslated
        ? transEl.dataset.translated
        : transEl.dataset.original;
      transEl.style.opacity = showingTranslated ? "" : "0.55";
      transEl.title = showingTranslated ? "Click to see original" : "Click to see translation";
    });
  }

  // Unpin handler
  card.querySelector(".pinned-card-unpin").addEventListener("click", async (e) => {
    e.stopPropagation();
    await removePin(post.id);
    chrome.tabs.query({ url: "https://news.ycombinator.com/*" }, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id != null) {
          chrome.tabs.sendMessage(tab.id, { type: "LENS_PIN_CHANGED", postId: post.id, pinned: false }).catch(() => {});
        }
      });
    });
  });

  // Card-level collapse chevron
  card.querySelector(".card-chevron").addEventListener("click", async (e) => {
    e.stopPropagation();
    const nowCollapsed = card.classList.toggle("card-collapsed");
    await setCardCollapsed(post.id, nowCollapsed);
    const ch = card.querySelector(".card-chevron");
    if (ch) ch.title = nowCollapsed ? tr("pinned.expand") : tr("pinned.collapse");
  });

  // ── Comment preview on hover ────
  const commentsEl = card.querySelector(".pinned-card-comments");
  const previewEl  = card.querySelector(".pinned-card-preview");
  if (commentsEl && previewEl) {
    let openTimer = null;
    let closeTimer = null;

    const openPreview = async () => {
      clearTimeout(closeTimer);
      if (!previewEl.hidden) return;
      previewEl.hidden = false;
      if (!previewEl.dataset.loaded) {
        previewEl.innerHTML = `<div class="preview-loading">${escapeText(tr("comments.loading"))}</div>`;
        try {
          const comments = await loadComments(post.id);
          renderCommentsPreview(previewEl, comments, post);
          previewEl.dataset.loaded = "1";
        } catch (err) {
          previewEl.innerHTML = `<div class="preview-error">${escapeText(tr("comments.error"))}</div>`;
        }
      }
    };

    const closePreview = () => {
      clearTimeout(openTimer);
      previewEl.hidden = true;
    };

    commentsEl.addEventListener("mouseenter", () => {
      clearTimeout(closeTimer);
      openTimer = setTimeout(openPreview, 220);
    });

    // Once open, keep open while mouse is over the preview itself
    previewEl.addEventListener("mouseenter", () => clearTimeout(closeTimer));

    card.addEventListener("mouseleave", () => {
      clearTimeout(openTimer);
      closeTimer = setTimeout(closePreview, 280);
    });

    // Tap on touch: toggle
    commentsEl.addEventListener("click", (e) => {
      e.stopPropagation();
      if (previewEl.hidden) openPreview();
      else closePreview();
    });
  }

  return card;
}

async function loadComments(postId) {
  // Try cache first
  const cached = await getCachedComments(postId);
  if (cached) return cached;

  const fresh = await fetchTopComments(postId, 5);
  await setCachedComments(postId, fresh);
  return fresh;
}

async function renderCommentsPreview(container, comments, post) {
  if (!comments || comments.length === 0) {
    container.innerHTML = `<div class="preview-empty">${escapeText(tr("comments.empty"))}</div>`;
    return;
  }

  // Build snippets in plain text once
  const items = comments.map((c) => ({
    raw: c,
    original: commentToPlainText(c.text, 220),
    translated: null,
    sourceLang: null
  }));

  // Optional translation pass
  const targetLang = resolveTargetLang();
  const doTranslate = settings.autoTranslate && targetLang && isTranslatorAvailable();

  if (doTranslate) {
    container.innerHTML = `<div class="preview-loading">${escapeText(tr("page.translating"))}</div>`;
    await Promise.all(items.map(async (it) => {
      const result = await translateText(it.original, targetLang);
      if (result && result.translated) {
        it.translated = result.translated;
        it.sourceLang = result.sourceLang;
      }
    }));
  }

  // Build DOM
  const wrap = document.createElement("div");
  wrap.className = "cm-list";

  items.forEach((it) => {
    const c = it.raw;
    const div = document.createElement("div");
    div.className = "cm-item";

    const showTranslated = !!it.translated;
    const initialText = showTranslated ? it.translated : it.original;

    div.innerHTML = `
      <div class="cm-head">
        <span class="cm-author">${escapeText(c.by)}</span>
        <span class="cm-sep">·</span>
        <span class="cm-time">${escapeText(relativeTime(c.time))}</span>
      </div>
      <div class="cm-text"></div>
      ${c.replies > 0 ? `<span class="cm-replies">↳ ${c.replies} ${escapeText(c.replies === 1 ? tr("comments.reply") : tr("comments.replies"))}</span>` : ""}
    `;

    div.querySelector(".cm-text").textContent = initialText;

    // Add translate indicator if we have a translation
    if (it.translated) {
      const head = div.querySelector(".cm-head");
      const badge = document.createElement("span");
      badge.className = "cm-translated";
      badge.textContent = `🌐 ${(it.sourceLang || "?").toUpperCase()} → ${targetLang.toUpperCase()}`;
      let showingTranslated = true;
      badge.title = "Click to see original";
      badge.addEventListener("click", (e) => {
        e.stopPropagation();
        showingTranslated = !showingTranslated;
        div.querySelector(".cm-text").textContent = showingTranslated ? it.translated : it.original;
        badge.title = showingTranslated ? "Click to see original" : "Click to see translation";
        badge.style.opacity = showingTranslated ? "" : "0.55";
      });
      head.appendChild(badge);
    }

    wrap.appendChild(div);
  });

  // "View all" link
  const moreA = document.createElement("a");
  moreA.className = "cm-all";
  moreA.href = post.itemUrl || `https://news.ycombinator.com/item?id=${post.id}`;
  moreA.target = "_blank";
  moreA.rel = "noopener noreferrer";
  moreA.textContent = tr("comments.viewAll", { count: post.comments || 0 });

  container.innerHTML = "";
  container.appendChild(wrap);
  container.appendChild(moreA);
}

function resolveTargetLang() {
  if (settings.translateTo) return settings.translateTo;
  const nav = (navigator.language || "en").split("-")[0].toLowerCase();
  return nav;
}

function escapeText(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c]);
}

// ── Tag rendering / editing on pinned cards ─────────────

function renderTagsInCard(card, post) {
  const wrap = card.querySelector(".pinned-card-tags");
  if (!wrap) return;
  wrap.innerHTML = "";

  const tags = Array.isArray(post.tags) ? post.tags : [];
  tags.forEach((tag) => wrap.appendChild(buildTagChip(post, tag)));

  // "+ tag" button
  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "tag-add-btn";
  addBtn.textContent = tr("pinned.addTag");
  addBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openTagInput(card, post);
  });
  wrap.appendChild(addBtn);
}

function buildTagChip(post, tag) {
  const chip = document.createElement("span");
  chip.className = "tag-chip";
  chip.title = tr("pinned.removeTag");
  chip.style.setProperty("--tag-hue", tagHue(tag));
  chip.innerHTML = `<span class="tag-text">${escapeText(tag)}</span><span class="tag-x">×</span>`;
  chip.addEventListener("click", async (e) => {
    e.stopPropagation();
    const next = (post.tags || []).filter((t) => t !== tag);
    await setPinnedTags(post.id, next);
    post.tags = next;
    chip.remove();
    broadcastTagsChanged(post.id, next);
  });
  return chip;
}

async function openTagInput(card, post) {
  const wrap = card.querySelector(".pinned-card-tags");
  if (!wrap) return;
  if (wrap.querySelector(".tag-input-row")) return; // already open

  const row = document.createElement("span");
  row.className = "tag-input-row";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "tag-input";
  input.placeholder = tr("pinned.tagPlaceholder");
  input.maxLength = 30;

  const suggBox = document.createElement("div");
  suggBox.className = "tag-suggestions";
  suggBox.hidden = true;

  row.appendChild(input);
  row.appendChild(suggBox);

  // Remove the "+ tag" button while editing
  const addBtn = wrap.querySelector(".tag-add-btn");
  if (addBtn) addBtn.remove();
  wrap.appendChild(row);
  input.focus();

  const recent = await getRecentTags();

  const refreshSuggestions = () => {
    const q = normalizeTag(input.value);
    const existing = new Set((post.tags || []).map(normalizeTag));
    const candidates = recent.filter((t) => !existing.has(t) && (q ? t.includes(q) : true)).slice(0, 6);
    if (candidates.length === 0) {
      suggBox.hidden = true;
      suggBox.innerHTML = "";
      return;
    }
    suggBox.hidden = false;
    suggBox.innerHTML = candidates.map((t) =>
      `<button type="button" class="tag-sugg" data-tag="${escapeAttr(t)}" style="--tag-hue:${tagHue(t)}">${escapeText(t)}</button>`
    ).join("");
    suggBox.querySelectorAll(".tag-sugg").forEach((b) => {
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        commitTag(b.dataset.tag);
      });
    });
  };

  const commitTag = async (raw) => {
    const t = normalizeTag(raw);
    if (!t) { closeInput(); return; }
    const next = Array.from(new Set([...(post.tags || []), t]));
    await setPinnedTags(post.id, next);
    await pushRecentTag(t);
    post.tags = next;
    closeInput();
    renderTagsInCard(card, post);
    broadcastTagsChanged(post.id, next);
  };

  const closeInput = () => {
    row.remove();
    // Re-add the "+ tag" button
    const newAdd = document.createElement("button");
    newAdd.type = "button";
    newAdd.className = "tag-add-btn";
    newAdd.textContent = tr("pinned.addTag");
    newAdd.addEventListener("click", (e) => { e.stopPropagation(); openTagInput(card, post); });
    wrap.appendChild(newAdd);
  };

  input.addEventListener("input", refreshSuggestions);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); commitTag(input.value); }
    else if (e.key === "Escape") { e.preventDefault(); closeInput(); }
  });
  input.addEventListener("blur", () => {
    setTimeout(() => {
      if (document.activeElement && document.activeElement.closest(".tag-suggestions")) return;
      closeInput();
    }, 150);
  });

  refreshSuggestions();
}

function broadcastTagsChanged(postId, tags) {
  chrome.tabs.query({ url: "https://news.ycombinator.com/*" }, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id != null) {
        chrome.tabs.sendMessage(tab.id, { type: "LENS_TAGS_CHANGED", postId, tags }).catch(() => {});
      }
    });
  });
}

// ── Radar ─────────────────────────────────────────────────

let activeRadarCat = "top";
let radarLoading = false;

function initRadar() {
  const tabs = document.querySelectorAll(".radar-tab");
  tabs.forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (radarLoading) return;
      activeRadarCat = btn.dataset.cat;
      tabs.forEach((b) => b.classList.toggle("active", b === btn));
      await loadRadar(activeRadarCat);
    });
  });

  const refreshBtn = $("radar-refresh");
  if (refreshBtn) {
    refreshBtn.hidden = false;
    refreshBtn.addEventListener("click", () => loadRadar(activeRadarCat, true));
  }

  // Initial load
  loadRadar(activeRadarCat);
}

async function loadRadar(category, force = false) {
  const container = $("radar-content");
  if (!container || radarLoading) return;
  radarLoading = true;

  const statusEl = $("radar-status");
  if (statusEl) statusEl.textContent = tr("page.translating") /* reuse "loading-like" */ || "";

  // Show shimmer skeleton on first load or forced refresh
  const store = await getRadarStore();
  const cached = (store.lists[category] || []).map((id) => store.byPost[id]).filter(Boolean);
  if (force || cached.length === 0) {
    container.innerHTML = renderSkeleton();
  } else {
    // Render cached immediately, refresh in background
    renderRadarCards(container, await sortAndFilter(cached));
  }

  try {
    const ids = await fetchListIds(category);
    const items = await fetchItemsBatch(ids, 30);

    // Annotate type before storing
    items.forEach((it) => {
      it.type = detectItemType(it.title);
    });

    const updatedStore = await updateRadarSnapshots(category, items);
    const list = (updatedStore.lists[category] || [])
      .map((id) => updatedStore.byPost[id])
      .filter(Boolean);

    renderRadarCards(container, await sortAndFilter(list));

    if (statusEl) {
      const now = new Date();
      statusEl.textContent = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    }
  } catch (e) {
    console.warn("[HN Radar] load failed:", e);
    if (cached.length === 0) {
      container.innerHTML = `<div class="radar-error">${escapeText(tr("comments.error") || "Failed to load")}</div>`;
    }
  } finally {
    radarLoading = false;
  }
}

async function sortAndFilter(posts) {
  const muted = (await getMutedDomains()).map((d) => d.toLowerCase());
  const filtered = posts.filter((p) => {
    if (!p.url) return true; // Ask HN / Show HN without URL never filtered
    const dom = extractDomain(p.url).toLowerCase();
    return !muted.some((m) => dom === m || dom.endsWith("." + m));
  });
  return filtered
    .map((p) => {
      const { current, delta } = computeVelocityDetail(p);
      return { ...p, _velocity: current, _velocityDelta: delta };
    })
    .sort((a, b) => b._velocity - a._velocity)
    .slice(0, 15);
}

function renderSkeleton() {
  return `
    <div class="radar-list">
      <div class="radar-skeleton"></div>
      <div class="radar-skeleton"></div>
      <div class="radar-skeleton"></div>
      <div class="radar-skeleton"></div>
    </div>
  `;
}

function renderRadarCards(container, items) {
  container.innerHTML = "";
  if (!items || items.length === 0) {
    container.innerHTML = `<div class="radar-empty">${escapeText(tr("radar.empty"))}</div>`;
    return;
  }
  const list = document.createElement("div");
  list.className = "radar-list";
  items.forEach((post) => list.appendChild(buildRadarCard(post)));
  container.appendChild(list);

  // Async enrichment: OP active badge (top 10 only to keep API calls reasonable)
  enrichOPActive(items.slice(0, 10));
}

async function enrichOPActive(items) {
  for (const post of items) {
    if (!post.by || !Array.isArray(post.kids) || post.kids.length === 0) continue;
    let active = await getCachedOPActive(post.id);
    if (active === undefined) {
      try {
        active = await checkOPActive(post, 8);
        await setCachedOPActive(post.id, active);
      } catch {
        continue;
      }
    }
    if (active) {
      const card = document.querySelector(`.radar-card[data-id="${post.id}"]`);
      if (!card) continue;
      const flagsEl = card.querySelector(".radar-card-flags");
      if (flagsEl && !flagsEl.querySelector(".op-active")) {
        const flag = document.createElement("span");
        flag.className = "op-active";
        flag.textContent = tr("radar.opActive");
        flag.title = tr("radar.opActiveTip");
        flagsEl.appendChild(flag);
      }
    }
  }
}

function buildRadarCard(post) {
  const card = document.createElement("div");
  card.className = "radar-card";
  card.dataset.id = post.id;
  card.dataset.author = post.by || "";

  const typeBadge = post.type
    ? `<span class="radar-card-type ${escapeAttr(post.type)}">${escapeText(post.type)}</span>`
    : "";

  const domain = extractDomain(post.url) || "news.ycombinator.com";
  const ageSeconds = Math.max(1, Math.floor(Date.now() / 1000 - (post.time || 0)));
  const ageText = formatRelativeShort(ageSeconds);

  const velocity = Math.round(post._velocity || 0);
  const velTier  = velocity >= 60 ? "hot" : velocity >= 20 ? "warm" : "cool";
  const delta    = post._velocityDelta;

  // Velocity delta indicator
  let deltaHtml = "";
  if (delta != null && Math.abs(delta) >= 2) {
    const cls = delta > 0 ? "delta-up" : "delta-down";
    const sym = delta > 0 ? "▲" : "▼";
    deltaHtml = `<span class="vel-delta ${cls}">${sym} ${Math.abs(delta)}</span>`;
  }

  // Comment war indicator
  const comments = post.descendants || 0;
  let commentTag = "";
  if (comments >= 400) {
    commentTag = `<span class="cm-war heated">🔥 ${escapeText(tr("radar.heated"))}</span>`;
  } else if (comments >= 150) {
    commentTag = `<span class="cm-war active">💬 ${escapeText(tr("radar.active"))}</span>`;
  }

  card.innerHTML = `
    <div class="radar-card-row">
      <div class="radar-card-main">
        <div class="radar-card-title">${typeBadge}${escapeText(post.title || "")}</div>
        <div class="radar-card-meta">
          <span class="radar-domain">${escapeText(domain)}</span>
          <span class="sep">·</span>
          <span>${post.score || 0} ${escapeText(tr("pinned.pointsUnit"))}</span>
          <span class="sep">·</span>
          <span>${comments} ${escapeText(tr("pinned.commentsUnit"))}</span>
          <span class="sep">·</span>
          <span>${escapeText(ageText)}</span>
          ${commentTag}
        </div>
        <div class="radar-card-flags"></div>
      </div>
      <div class="radar-card-side">
        <div class="radar-velocity tier-${velTier}" title="${escapeAttr(tr("radar.velocityTip"))}">
          <span class="vel-arrow">↑</span>
          <span class="vel-num">${velocity}</span>
          ${deltaHtml}
        </div>
        <button class="radar-card-pin" type="button" title="Pin">📌</button>
      </div>
    </div>
  `;

  // Open post on card click
  card.addEventListener("click", (e) => {
    if (e.target.closest(".radar-card-pin")) return;
    chrome.tabs.create({ url: `https://news.ycombinator.com/item?id=${post.id}` });
  });

  // Pin handler
  card.querySelector(".radar-card-pin").addEventListener("click", async (e) => {
    e.stopPropagation();
    const map = await getPinnedMap();
    const id = String(post.id);
    if (map[id]) return; // already pinned
    map[id] = {
      id, title: post.title || "", url: post.url || `https://news.ycombinator.com/item?id=${post.id}`,
      domain: extractDomain(post.url) || "news.ycombinator.com",
      score: post.score || 0, comments: post.descendants || 0, author: post.by || "",
      ageText, itemUrl: `https://news.ycombinator.com/item?id=${post.id}`,
      type: post.type || "", pinnedAt: Date.now(), tags: []
    };
    await setToStorage("pinned", map);
    e.currentTarget.classList.add("pinned-flash");
    e.currentTarget.textContent = "✓";
    setTimeout(() => {
      e.currentTarget.classList.remove("pinned-flash");
      e.currentTarget.textContent = "📌";
    }, 1200);
    // Refresh pinned section + notify HN tab
    renderPinned();
    chrome.tabs.query({ url: "https://news.ycombinator.com/*" }, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id != null) {
          chrome.tabs.sendMessage(tab.id, { type: "LENS_PIN_CHANGED", postId: post.id, pinned: true }).catch(() => {});
        }
      });
    });
  });

  return card;
}

function formatRelativeShort(seconds) {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

function escapeAttr(s) {
  return String(s).replace(/[^a-z0-9_-]/gi, "");
}
