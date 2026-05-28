export default {
  app: { name: "NODUS HN Radar", brand: "Realizzato da NODUS", openHN: "Apri Hacker News", openSite: "Apri il sito HN Radar" },
  master: { enabled: "Lens attivato", hint: "Layer di lettura visivo su news.ycombinator.com" },
  panels: { pinned: "Fissati", radar: "Radar", settings: "Impostazioni Lens", comingSoon: "presto" },
  pinned: {
    empty: "Nessun post fissato.",
    hint: "Clicca 📌 accanto a qualsiasi post di Hacker News per seguirlo qui.",
    pointsUnit: "pti", commentsUnit: "commenti", unpin: "Sfissa",
    hoverHint: "Passa il mouse per vedere i commenti",
    addTag: "+ tag", tagPlaceholder: "Nome tag…", removeTag: "Clic per rimuovere",
    collapse: "Comprimi", expand: "Espandi"
  },
  comments: {
    loading: "Caricamento commenti…", empty: "Ancora nessun commento.",
    error: "Impossibile caricare i commenti",
    viewAll: "Vedi tutti i {count} commenti →", reply: "risposta", replies: "risposte"
  },
  radar: {
    placeholder: "Post in crescita, punteggi di velocità e segnali",
    placeholderHint: "La Fase 2 traccerà la crescita dei post in tempo reale.",
    rising: "In crescita", refresh: "Aggiorna",
    empty: "Ancora nessun dato — apri il pannello dopo qualche minuto di navigazione su HN.",
    sources: { top: "Top", best: "Migliori", show: "Show HN", ask: "Ask HN" }
  },
  settings: {
    theme: "Tema", themeAuto: "Auto", themeLight: "Chiaro", themeDark: "Scuro",
    fontSize: "Dimensione carattere", sizeSmall: "Piccola", sizeMedium: "Media", sizeLarge: "Grande",
    width: "Larghezza di lettura", widthNormal: "Normale", widthWide: "Larga",
    behavior: "Comportamento", compact: "Righe compatte", grayVisited: "Posts visitati in grigio",
    highlights: "Evidenzia tipi di post", showHN: "Show HN", askHN: "Ask HN", launchHN: "Launch HN",
    language: "Lingua interfaccia", translation: "Traduzione", beta: "beta",
    transScope: "Queste impostazioni riguardano solo il contenuto in questo pannello. Per tradurre i post sulla pagina HN, usa i pulsanti 🌐 lì.",
    autoTransPinned: "Traduci titoli dei post fissati",
    autoTransComments: "Traduci anteprime dei commenti",
    targetLang: "Lingua di destinazione (condivisa)", targetAuto: "Auto (browser)",
    transReady: "Usa il traduttore integrato di Chrome — locale, gratis, senza chiave API.",
    transUnavailable: "Traduttore integrato non disponibile in questo browser. Chrome 138+ richiesto."
  },
  page: {
    translatePage: "Traduci la pagina in {lang}", restoreOriginals: "↩ Ripristina originali",
    translating: "Traducendo…", translateOne: "Traduci questo titolo"
  }
};
