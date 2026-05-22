// NODUS HN Radar — background event page (Phase 1.5)
// Configures side panel, routes settings updates, proxies translation calls.

import { translateText } from "./hn-api.js";

// Enable opening the side panel by clicking the toolbar icon.
// Chrome 114+ feature. Firefox uses sidebar_action (toggles automatically).
if (chrome.sidePanel?.setPanelBehavior) {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    .catch((err) => console.warn("HN Radar: sidePanel behavior not set:", err));
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "BROADCAST_SETTINGS") {
    chrome.tabs.query({ url: "https://news.ycombinator.com/*" }, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id != null) {
          chrome.tabs.sendMessage(tab.id, {
            type: "LENS_SETTINGS_UPDATED",
            settings: msg.settings
          }).catch(() => {});
        }
      });
      sendResponse({ ok: true });
    });
    return true;
  }

  if (msg.type === "OPEN_SIDE_PANEL") {
    // Triggered by clicks on badges in the HN page. Tries Chrome's sidePanel API,
    // falls back to Firefox's sidebarAction.
    const tabId = sender.tab?.id;
    const windowId = sender.tab?.windowId;

    if (chrome.sidePanel?.open) {
      // Chrome 116+. Prefers windowId; tabId also works.
      const openArgs = windowId != null ? { windowId } : (tabId != null ? { tabId } : {});
      chrome.sidePanel.open(openArgs)
        .then(() => sendResponse({ ok: true }))
        .catch((err) => sendResponse({ ok: false, error: err?.message || "open failed" }));
      return true;
    }

    // Firefox sidebar
    if (typeof browser !== "undefined" && browser.sidebarAction?.open) {
      browser.sidebarAction.open()
        .then(() => sendResponse({ ok: true }))
        .catch((err) => sendResponse({ ok: false, error: err?.message || "open failed" }));
      return true;
    }

    sendResponse({ ok: false, error: "sidePanel API not available" });
    return false;
  }

  // Translate request from content script (content scripts can't directly call
  // self.Translator in some browser configurations — proxy through background).
  if (msg.type === "TRANSLATE_TEXT") {
    translateText(msg.text, msg.targetLang)
      .then((result) => sendResponse(result))
      .catch((err) => {
        console.warn("[HN Radar] translate proxy failed:", err);
        sendResponse(null);
      });
    return true;
  }
});
