# NODUS HN Radar

**Same Hacker News. Less eye pain. More signal.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-0.16.5-green.svg)](https://github.com/mmcarvalhodev/nodus-hn-radar)
[![Platform](https://img.shields.io/badge/Platform-Chrome%20%7C%20Firefox%20%7C%20Edge%20%7C%20Brave-orange.svg)](https://nodus-ai.app/hn-radar)
[![Privacy](https://img.shields.io/badge/Local--first-✓-brightgreen.svg)](https://nodus-ai.app/hn-radar-privacy)

> **A reading layer and a signal dashboard for the front page you already love.**

---

## What is HN Radar?

NODUS HN Radar is a browser extension that improves the Hacker News reading experience and surfaces what's gaining momentum in real time — without changing the site you love.

It does two things:

1. **Lens** — a quiet reading layer that adds dark/light themes, type badges, visited-post tracking, pin-and-tag for threads, and zebra striping. It respects HN's aesthetic instead of skinning over it.
2. **Radar** — a side-panel dashboard that watches `top`, `show`, `ask` and `best` lists, computes per-post velocity (points + comments per hour), shows delta indicators, and alerts you when authors are actively replying or when a thread crosses the comment-war threshold.

Everything runs locally. Zero backend, zero account, zero telemetry.

---

## The problem

- Long reading sessions on HN are visually fatiguing (white background, dense type)
- It's hard to tell at a glance which posts are SHOW HN, ASK HN, LAUNCH HN, etc.
- The "rising" signal is invisible — by the time something hits front page, the conversation may already have peaked
- There's no way to pin or organize threads you want to return to
- Comments worth reading are buried under hundreds of others

## The solution

- **Lens reading layer** — dark / light / auto, adjustable font, reading-width control, visited grayed out, compact mode
- **Type badges** — inline `SHOW` / `ASK` / `LAUNCH` / `TELL` / `POLL` pills directly on titles, with color-coded row tints
- **Pin & tag threads** — pin any post, add multicolored tags (color hashed from the tag name), tags propagate back onto the HN page next to the title
- **Radar dashboard** — Top / Show HN / Ask HN / Best with per-post velocity and delta over the last interval
- **OP active badge** — golden badge when the post author has replied in the thread (the "founder is here" signal HN readers love)
- **Comment-war alert** — subtle chip at 150+ comments, 🔥 fire at 400+
- **Inline comment preview** — hover "X comments" on a pinned card to see the top 5 inline; no tab-switching
- **In-browser translation** — Chrome's local Translator API (138+) for titles and comment previews
- **Mute domains** — tired of `medium.com`? Add it to your mute list
- **Zebra striping** — optional alternating row backgrounds with custom color and intensity
- **16 languages** — interface fully translated

---

## Privacy

### Local-first by design

```
HN page → HN Radar content script → Your browser storage (chrome.storage.local)
HN Firebase API → HN Radar background → Radar dashboard
```

- All settings, pinned posts, tags, mute list and Radar snapshots live in `chrome.storage.local`
- No NODUS server is contacted at any point — there is no NODUS backend for this extension
- Two network endpoints, both owned by Hacker News itself:
  - `https://news.ycombinator.com/*` — the site you're already reading
  - `https://hacker-news.firebaseio.com/v0/*` — HN's public Firebase API
- No telemetry, no analytics SDK, no third-party scripts
- Translation runs on-device via Chrome's built-in Translator API — no cloud calls

Full policy: [nodus-ai.app/hn-radar-privacy](https://nodus-ai.app/hn-radar-privacy)

---

## Repository structure

```
hn-radar/
├── manifest.json           # Chrome extension manifest (MV3, side_panel)
├── manifest-firefox.json   # Firefox manifest (sidebar_action + gecko id)
├── background.js           # Service worker / event page — translator proxy, side panel behavior
├── content.js              # Content script — Lens overlay, type badges, pin/tag injection
├── sidepanel.html          # Side panel UI shell
├── sidepanel.js            # Side panel logic — pinned cards, Radar, settings
├── sidepanel.css           # Side panel styles
├── lens.css                # Styles injected into news.ycombinator.com
├── hn-api.js               # HN Firebase API client + Chrome Translator API wrapper
├── hn-data.js              # List fetching, type detection, OP-active detection
├── storage.js              # chrome.storage helpers, pin/tag/mute state, velocity math
├── i18n.js                 # Runtime i18n + data-i18n DOM applier
├── i18n/                   # 16 locale files
└── icons/                  # Extension icons
```

No build step. No bundler. Plain ES modules.

---

## Installation

### Chrome Web Store

[Install for Chrome →](https://nodus-ai.app/hn-radar) *(link will go live once review completes)*

Works on Chrome, Edge, Brave and other Chromium-based browsers.

### Firefox Add-ons

[Install for Firefox →](https://nodus-ai.app/hn-radar) *(link will go live once review completes)*

### Manual (Developer Mode)

```bash
git clone https://github.com/mmcarvalhodev/nodus-hn-radar.git
cd nodus-hn-radar
```

1. Open Chrome → `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the cloned folder

For Firefox: open `about:debugging` → **This Firefox** → **Load Temporary Add-on** → pick `manifest-firefox.json`.

---

## Verify the code yourself

```bash
# How HN Radar fetches trending lists (the only outbound calls)
cat hn-data.js

# How translation runs entirely on-device
cat hn-api.js

# What ends up in chrome.storage.local
cat storage.js

# The full DOM injection layer
cat content.js
```

Nothing is minified. Nothing is obfuscated. If you can read JavaScript, you can audit the whole extension in under an hour.

---

## About the author

I'm M M Carvalho, a Brazilian solo full-stack developer. I build the NODUS family of browser extensions:

- **[NODUS](https://github.com/mmcarvalhodev/nodus)** — capture and organize AI conversations across 7 platforms
- **NODUS YT Radar** — a real-time view of YouTube's regional Top 50, surfacing rising videos before they peak
- **NODUS HN Radar** — this project

My bias is toward simple, local-first tools that respect the user. No accounts unless they're necessary. No telemetry I wouldn't be comfortable showing you the code for. If a feature can live entirely in the browser, it should.

If HN Radar saves you time or attention and you'd like to support more work like this, the support links below are appreciated — but the extension is and will remain free.

---

## License

MIT License — see [LICENSE](LICENSE).

Use it, fork it, ship it. A credit link back is appreciated but not required.

---

## Links

- **Product page:** [nodus-ai.app/hn-radar](https://nodus-ai.app/hn-radar)
- **Privacy policy:** [nodus-ai.app/hn-radar-privacy](https://nodus-ai.app/hn-radar-privacy)
- **NODUS main site:** [nodus-ai.app](https://nodus-ai.app)
- **Sister projects:** [NODUS](https://github.com/mmcarvalhodev/nodus)

## Support

- **Email:** mmcarvalho.dev@gmail.com
- **GitHub Issues:** [Report a bug](https://github.com/mmcarvalhodev/nodus-hn-radar/issues)
- **Ko-fi:** [ko-fi.com/mmcarvalho](https://ko-fi.com/mmcarvalho)
- **GitHub Sponsors:** [github.com/sponsors/mmcarvalhodev](https://github.com/sponsors/mmcarvalhodev)

---

*Built local-first. Made for HN readers, by an HN reader.*
