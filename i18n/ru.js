export default {
  app: { name: "NODUS HN Radar", brand: "Создано NODUS", openHN: "Открыть Hacker News", openSite: "Открыть сайт HN Radar" },
  master: { enabled: "Lens включён", hint: "Визуальный слой чтения на news.ycombinator.com" },
  watch: {
    tab:             "Наблюдение",
    intro:           "Получайте уведомления, когда посты пересекают ваши пороги. Опрос работает только пока эта панель открыта — без фоновых задач, без разрешения на уведомления.",
    newRule:         "+ Новое правило",
    edit:            "Изменить",
    delete:          "Удалить",
    ruleName:        "Название правила",
    ruleNamePh:      "напр.: Крупные Show HN посты",
    feeds:           "Наблюдать в",
    conditions:      "Условия",
    condsHint:       "Оставьте значение пустым, чтобы пропустить это условие. Все заполненные условия должны совпадать (И).",
    points:          "Очки",
    comments:        "Комментарии",
    velocity:        "Скорость",
    save:            "Сохранить правило",
    cancel:          "Отмена",
    notifications:   "Уведомления",
    markAllRead:     "Отметить всё как прочитанное",
    noNotifications: "Нет новых совпадений.",
    manageRules:     "Управление правилами ⚙",
    lastMatchNever:  "Пока нет совпадений",
    lastMatch:       "Последнее совпадение: {time}",
    matches:         "{n} совпадений",
    match:           "1 совпадение",
    deleteConfirm:   "Подтвердить?",
    errNameRequired: "Пожалуйста, дайте правилу название.",
    errFeedRequired: "Выберите хотя бы один источник для отслеживания.",
    errCondsRequired: "Заполните хотя бы одно условие."
  },
  cta: {
    lostAIPitch: "Теряете беседы с ИИ?",
    lostAITitle: "Открыть NODUS — сохранить беседы с ИИ"
  },
  panels: { pinned: "Закреплённые", radar: "Радар", watch: "Наблюдение", settings: "Настройки Lens", comingSoon: "скоро" },
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
