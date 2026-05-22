export default {
  app: { name: "NODUS HN Radar", brand: "Создано NODUS", openHN: "Открыть Hacker News" },
  master: { enabled: "Lens включён", hint: "Визуальный слой чтения на news.ycombinator.com" },
  panels: { pinned: "Закреплённые", radar: "Радар", settings: "Настройки Lens", comingSoon: "скоро" },
  pinned: {
    empty: "Нет закреплённых постов.",
    hint: "Нажмите 📌 рядом с любым постом на Hacker News, чтобы отслеживать его здесь.",
    pointsUnit: "очк.", commentsUnit: "комм.", unpin: "Открепить",
    hoverHint: "Наведите для просмотра комментариев",
    addTag: "+ тег", tagPlaceholder: "Название тега…", removeTag: "Нажмите, чтобы удалить",
    collapse: "Свернуть", expand: "Развернуть"
  },
  comments: {
    loading: "Загрузка комментариев…", empty: "Пока нет комментариев.",
    error: "Не удалось загрузить комментарии",
    viewAll: "Все {count} комментариев →", reply: "ответ", replies: "ответы"
  },
  radar: {
    placeholder: "Растущие посты, оценки скорости и сигналы",
    placeholderHint: "Фаза 2 будет отслеживать рост постов в реальном времени.",
    rising: "Растущие", refresh: "Обновить",
    empty: "Данных пока нет — откройте панель после нескольких минут на HN.",
    sources: { top: "Топ", best: "Лучшие", show: "Show HN", ask: "Ask HN" }
  },
  settings: {
    theme: "Тема", themeAuto: "Авто", themeLight: "Светлая", themeDark: "Тёмная",
    fontSize: "Размер шрифта", sizeSmall: "Маленький", sizeMedium: "Средний", sizeLarge: "Большой",
    width: "Ширина чтения", widthNormal: "Обычная", widthWide: "Широкая",
    behavior: "Поведение", compact: "Компактные строки", grayVisited: "Затемнять посещённые",
    highlights: "Выделять типы постов", showHN: "Show HN", askHN: "Ask HN", launchHN: "Launch HN",
    language: "Язык интерфейса", translation: "Перевод", beta: "бета",
    transScope: "Эти настройки влияют только на содержимое этой панели. Для перевода постов на странице HN используйте кнопки 🌐 там.",
    autoTransPinned: "Переводить заголовки закреплённых постов",
    autoTransComments: "Переводить превью комментариев",
    targetLang: "Целевой язык (общий)", targetAuto: "Авто (браузер)",
    transReady: "Использует встроенный переводчик Chrome — локально, бесплатно, без API-ключа.",
    transUnavailable: "Встроенный переводчик недоступен в этом браузере. Требуется Chrome 138+."
  },
  page: {
    translatePage: "Перевести страницу на {lang}", restoreOriginals: "↩ Восстановить оригиналы",
    translating: "Перевод…", translateOne: "Перевести этот заголовок"
  }
};
