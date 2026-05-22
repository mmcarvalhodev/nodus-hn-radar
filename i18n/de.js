export default {
  app: { name: "NODUS HN Radar", brand: "Von NODUS", openHN: "Hacker News öffnen" },
  master: { enabled: "Lens aktiviert", hint: "Visuelle Leseebene auf news.ycombinator.com" },
  panels: { pinned: "Angepinnt", radar: "Radar", settings: "Lens-Einstellungen", comingSoon: "bald" },
  pinned: {
    empty: "Keine angepinnten Posts.",
    hint: "Klicke auf 📌 neben einem Post auf Hacker News, um ihn hier zu verfolgen.",
    pointsUnit: "Pkt", commentsUnit: "Kommentare", unpin: "Loslösen",
    hoverHint: "Hover für Kommentar-Vorschau",
    addTag: "+ Tag", tagPlaceholder: "Tag-Name…", removeTag: "Klicken zum Entfernen",
    collapse: "Einklappen", expand: "Ausklappen"
  },
  comments: {
    loading: "Lade Kommentare…", empty: "Noch keine Kommentare.",
    error: "Kommentare konnten nicht geladen werden",
    viewAll: "Alle {count} Kommentare anzeigen →", reply: "Antwort", replies: "Antworten"
  },
  radar: {
    placeholder: "Aufsteigende Posts, Velocity-Scores und Signale",
    placeholderHint: "Phase 2 verfolgt das Post-Wachstum in Echtzeit.",
    rising: "Aufsteigend", refresh: "Aktualisieren",
    empty: "Noch keine Daten — öffne das Panel nach einigen Minuten HN-Browsen.",
    sources: { top: "Top", best: "Beste", show: "Show HN", ask: "Ask HN" }
  },
  settings: {
    theme: "Thema", themeAuto: "Auto", themeLight: "Hell", themeDark: "Dunkel",
    fontSize: "Schriftgröße", sizeSmall: "Klein", sizeMedium: "Mittel", sizeLarge: "Groß",
    width: "Lesebreite", widthNormal: "Normal", widthWide: "Breit",
    behavior: "Verhalten", compact: "Kompakte Zeilen", grayVisited: "Besuchte Posts ausgrauen",
    highlights: "Post-Typen hervorheben", showHN: "Show HN", askHN: "Ask HN", launchHN: "Launch HN",
    language: "Oberflächensprache", translation: "Übersetzung", beta: "Beta",
    transScope: "Diese Einstellungen wirken nur auf Inhalte in diesem Panel. Für Posts auf HN nutze die 🌐-Buttons dort.",
    autoTransPinned: "Titel angepinnter Posts übersetzen",
    autoTransComments: "Kommentar-Vorschauen übersetzen",
    targetLang: "Zielsprache (gemeinsam)", targetAuto: "Auto (Browser)",
    transReady: "Nutzt Chromes eingebauten Übersetzer — lokal, kostenlos, ohne API-Key.",
    transUnavailable: "Eingebauter Übersetzer in diesem Browser nicht verfügbar. Chrome 138+ benötigt."
  },
  page: {
    translatePage: "Seite nach {lang} übersetzen", restoreOriginals: "↩ Originale wiederherstellen",
    translating: "Übersetze…", translateOne: "Diesen Titel übersetzen"
  }
};
