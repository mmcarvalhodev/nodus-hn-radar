export default {
  app: { name: "NODUS HN Radar", brand: "Stworzone przez NODUS", openHN: "Otwórz Hacker News", openSite: "Otwórz stronę HN Radar" },
  master: { enabled: "Lens włączony", hint: "Wizualna warstwa czytania na news.ycombinator.com" },
  watch: {
    tab:             "Obserwuj",
    intro:           "Otrzymuj powiadomienia, gdy posty przekraczają twoje progi. Sprawdzanie działa tylko, gdy ten panel jest otwarty — bez pracy w tle, bez uprawnień do powiadomień.",
    newRule:         "+ Nowa reguła",
    edit:            "Edytuj",
    delete:          "Usuń",
    ruleName:        "Nazwa reguły",
    ruleNamePh:      "np. Duże posty Show HN",
    feeds:           "Obserwuj w",
    conditions:      "Warunki",
    condsHint:       "Zostaw dowolną wartość pustą, aby pominąć ten warunek. Wszystkie wypełnione warunki muszą się zgadzać (I).",
    points:          "Punkty",
    comments:        "Komentarze",
    velocity:        "Prędkość",
    save:            "Zapisz regułę",
    cancel:          "Anuluj",
    notifications:   "Powiadomienia",
    markAllRead:     "Oznacz wszystkie jako przeczytane",
    noNotifications: "Brak nowych trafień.",
    manageRules:     "Zarządzaj regułami ⚙",
    lastMatchNever:  "Brak trafień",
    lastMatch:       "Ostatnie trafienie: {time}",
    matches:         "{n} trafień",
    match:           "1 trafienie",
    deleteConfirm:   "Potwierdzić?",
    errNameRequired: "Nadaj regule nazwę.",
    errFeedRequired: "Wybierz co najmniej jeden kanał do śledzenia.",
    errCondsRequired: "Wypełnij co najmniej jeden warunek."
  },
  cta: {
    lostAIPitch: "Tracisz swoje rozmowy z AI?",
    lostAITitle: "Otwórz NODUS — zapisuj rozmowy z AI"
  },
  panels: { pinned: "Przypięte", radar: "Radar", watch: "Obserwuj", settings: "Ustawienia Lens", comingSoon: "wkrótce" },
  pinned: {
    empty: "Brak przypiętych postów.",
    hint: "Kliknij 📌 obok dowolnego posta na Hacker News, aby śledzić go tutaj.",
    pointsUnit: "pkt", commentsUnit: "komentarzy", unpin: "Odepnij",
    hoverHint: "Najedź, aby zobaczyć podgląd",
    addTag: "+ tag", tagPlaceholder: "Nazwa tagu…", removeTag: "Kliknij, aby usunąć",
    collapse: "Zwiń", expand: "Rozwiń"
  },
  comments: {
    loading: "Ładowanie komentarzy…", empty: "Brak komentarzy.",
    error: "Nie można załadować komentarzy",
    viewAll: "Zobacz wszystkie {count} komentarzy →", reply: "odpowiedź", replies: "odpowiedzi"
  },
  radar: {
    placeholder: "Rosnące posty, wskaźniki prędkości i sygnały",
    placeholderHint: "Faza 2 będzie śledzić wzrost postów w czasie rzeczywistym.",
    rising: "Rosnące", refresh: "Odśwież",
    empty: "Brak danych — otwórz panel po kilku minutach przeglądania HN.",
    sources: { top: "Top", best: "Najlepsze", show: "Show HN", ask: "Ask HN" }
  },
  settings: {
    theme: "Motyw", themeAuto: "Auto", themeLight: "Jasny", themeDark: "Ciemny",
    fontSize: "Rozmiar czcionki", sizeSmall: "Mały", sizeMedium: "Średni", sizeLarge: "Duży",
    width: "Szerokość czytania", widthNormal: "Normalna", widthWide: "Szeroka",
    behavior: "Zachowanie", compact: "Kompaktowe wiersze", grayVisited: "Wyszarzaj odwiedzone",
    highlights: "Podświetl typy postów", showHN: "Show HN", askHN: "Ask HN", launchHN: "Launch HN",
    language: "Język interfejsu", translation: "Tłumaczenie", beta: "beta",
    transScope: "Te ustawienia dotyczą tylko zawartości tego panelu. Aby przetłumaczyć posty na stronie HN, użyj przycisków 🌐 tam.",
    autoTransPinned: "Tłumacz tytuły przypiętych postów",
    autoTransComments: "Tłumacz podglądy komentarzy",
    targetLang: "Język docelowy (wspólny)", targetAuto: "Auto (przeglądarka)",
    transReady: "Używa wbudowanego tłumacza Chrome — lokalnie, za darmo, bez klucza API.",
    transUnavailable: "Wbudowany tłumacz nie jest dostępny w tej przeglądarce. Wymagany Chrome 138+."
  },
  page: {
    translatePage: "Przetłumacz stronę na {lang}", restoreOriginals: "↩ Przywróć oryginały",
    translating: "Tłumaczę…", translateOne: "Przetłumacz ten tytuł"
  }
};
