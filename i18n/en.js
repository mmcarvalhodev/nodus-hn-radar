export default {
  app: {
    name: "NODUS HN Radar",
    brand: "Made by NODUS",
    openHN: "Open Hacker News"
  },
  master: {
    enabled: "Lens enabled",
    hint: "Visual reading layer on news.ycombinator.com"
  },
  panels: {
    pinned:   "Pinned",
    radar:    "Radar",
    settings: "Lens settings",
    comingSoon: "coming soon"
  },
  pinned: {
    empty: "No pinned posts.",
    hint:  "Click the 📌 next to any post on Hacker News to track it here.",
    pointsUnit:   "pts",
    commentsUnit: "comments",
    unpin: "Unpin",
    hoverHint: "Hover to preview top comments",
    addTag:    "+ tag",
    tagPlaceholder: "Tag name…",
    removeTag: "Click to remove",
    collapse:  "Collapse",
    expand:    "Expand"
  },
  comments: {
    loading: "Loading top comments…",
    empty:   "No comments yet.",
    error:   "Couldn't load comments",
    viewAll: "View all {count} comments →",
    reply:   "reply",
    replies: "replies"
  },
  radar: {
    placeholder:      "Rising posts, Velocity scores, and signals",
    placeholderHint:  "Phase 2 will track post growth in real time and surface what's about to break out.",
    rising:           "Rising now",
    refresh:          "Refresh",
    empty:            "No data yet — open the panel after browsing HN for a few minutes.",
    sources: {
      top:  "Top",
      best: "Best",
      show: "Show HN",
      ask:  "Ask HN"
    },
    opActive:    "OP ACTIVE",
    opActiveTip: "Author has replied in the discussion",
    heated:      "heated",
    active:      "active",
    saveToNodus: "Save to NODUS",
    velocityTip: "Velocity score: weighted growth per hour"
  },
  settings: {
    theme:      "Theme",
    themeAuto:  "Auto",
    themeLight: "Light",
    themeDark:  "Dark",
    fontSize:   "Font size",
    sizeSmall:  "Small",
    sizeMedium: "Medium",
    sizeLarge:  "Large",
    width:      "Reading width",
    widthNormal:"Normal",
    widthWide:  "Wide",
    behavior:   "Behavior",
    compact:    "Compact rows",
    grayVisited:"Gray out visited posts",
    highlights: "Highlight post types",
    showHN:     "Show HN",
    askHN:      "Ask HN",
    launchHN:   "Launch HN",
    language:   "Interface language",
    translation:"Translation",
    beta:       "beta",
    transScope: "These settings affect content inside this panel only. To translate posts on the HN page, use the 🌐 buttons there.",
    autoTransPinned:   "Translate pinned post titles",
    autoTransComments: "Translate comment previews",
    targetLang:        "Target language (shared)",
    targetAuto:        "Auto (browser)",
    transReady:        "Uses Chrome's built-in translator — local, free, no API key.",
    transUnavailable:  "Built-in translator not available in this browser. Chrome 138+ required.",
    mutedDomains:      "Muted domains",
    mutedDomainsHint:  "One per line. Posts from these domains will be hidden in Radar.",
    mutedDomainsPh:    "e.g. medium.com\nx.com",
    zebraTitle:        "Alternating rows",
    zebraEnable:       "Tint every other post",
    zebraColor:        "Color",
    zebraIntensity:    "Intensity"
  },
  page: {
    translatePage:  "Translate page to {lang}",
    restoreOriginals: "↩ Restore originals",
    translating:    "Translating…",
    translateOne:   "Translate this title"
  }
};
