export default {
  app: { name: "NODUS HN Radar", brand: "Gemaakt door NODUS", openHN: "Open Hacker News", openSite: "HN Radar-website openen" },
  master: { enabled: "Lens ingeschakeld", hint: "Visuele leeslaag op news.ycombinator.com" },
  panels: { pinned: "Vastgezet", radar: "Radar", settings: "Lens-instellingen", comingSoon: "binnenkort" },
  pinned: {
    empty: "Geen vastgezette posts.",
    hint: "Klik op 📌 naast een post op Hacker News om hem hier te volgen.",
    pointsUnit: "pt", commentsUnit: "reacties", unpin: "Losmaken",
    hoverHint: "Beweeg om reacties te bekijken",
    addTag: "+ tag", tagPlaceholder: "Tagnaam…", removeTag: "Klik om te verwijderen",
    collapse: "Invouwen", expand: "Uitvouwen"
  },
  comments: {
    loading: "Reacties laden…", empty: "Nog geen reacties.",
    error: "Kon reacties niet laden",
    viewAll: "Bekijk alle {count} reacties →", reply: "reactie", replies: "reacties"
  },
  radar: {
    placeholder: "Stijgende posts, snelheidsscores en signalen",
    placeholderHint: "Fase 2 volgt post-groei in realtime.",
    rising: "Stijgend", refresh: "Vernieuwen",
    empty: "Nog geen data — open het paneel na enkele minuten browsen op HN.",
    sources: { top: "Top", best: "Beste", show: "Show HN", ask: "Ask HN" }
  },
  settings: {
    theme: "Thema", themeAuto: "Auto", themeLight: "Licht", themeDark: "Donker",
    fontSize: "Tekstgrootte", sizeSmall: "Klein", sizeMedium: "Middel", sizeLarge: "Groot",
    width: "Leesbreedte", widthNormal: "Normaal", widthWide: "Breed",
    behavior: "Gedrag", compact: "Compacte rijen", grayVisited: "Bezochte posts grijs",
    highlights: "Posttypes markeren", showHN: "Show HN", askHN: "Ask HN", launchHN: "Launch HN",
    language: "Interfacetaal", translation: "Vertaling", beta: "bèta",
    transScope: "Deze instellingen gelden alleen voor inhoud in dit paneel. Gebruik de 🌐-knoppen op HN voor postvertalingen.",
    autoTransPinned: "Vertaal titels van vastgezette posts",
    autoTransComments: "Vertaal reactievoorbeelden",
    targetLang: "Doeltaal (gedeeld)", targetAuto: "Auto (browser)",
    transReady: "Gebruikt Chrome's ingebouwde vertaler — lokaal, gratis, geen API-sleutel.",
    transUnavailable: "Ingebouwde vertaler niet beschikbaar in deze browser. Chrome 138+ vereist."
  },
  page: {
    translatePage: "Vertaal pagina naar {lang}", restoreOriginals: "↩ Originelen herstellen",
    translating: "Vertalen…", translateOne: "Vertaal deze titel"
  }
};
