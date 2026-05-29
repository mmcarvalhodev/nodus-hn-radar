export default {
  app: { name: "NODUS HN Radar", brand: "Hecho por NODUS", openHN: "Abrir Hacker News", openSite: "Abrir sitio del HN Radar" },
  master: { enabled: "Lens activado", hint: "Capa de lectura visual en news.ycombinator.com" },
  watch: {
    tab:             "Vigilar",
    intro:           "Recibe alertas cuando los posts crucen tus umbrales. El monitoreo solo se ejecuta mientras este panel está abierto — sin trabajo en segundo plano, sin permiso de notificaciones.",
    newRule:         "+ Nueva regla",
    edit:            "Editar",
    delete:          "Eliminar",
    ruleName:        "Nombre de la regla",
    ruleNamePh:      "ej: Grandes posts Show HN",
    feeds:           "Vigilar en",
    conditions:      "Condiciones",
    condsHint:       "Deja cualquier valor vacío para omitir esa condición. Todas las condiciones rellenadas deben coincidir (Y).",
    points:          "Puntos",
    comments:        "Comentarios",
    velocity:        "Velocidad",
    save:            "Guardar regla",
    cancel:          "Cancelar",
    notifications:   "Notificaciones",
    markAllRead:     "Marcar todo como leído",
    noNotifications: "Sin coincidencias nuevas.",
    manageRules:     "Gestionar reglas ⚙",
    lastMatchNever:  "Aún sin coincidencias",
    lastMatch:       "Última coincidencia: {time}",
    matches:         "{n} coincidencias",
    match:           "1 coincidencia",
    deleteConfirm:   "¿Confirmar?",
    errNameRequired: "Por favor, ponle un nombre a la regla.",
    errFeedRequired: "Elige al menos un feed para vigilar.",
    errCondsRequired: "Completa al menos una condición."
  },
  cta: {
    lostAIPitch: "¿Perdiendo tus conversaciones con IA?",
    lostAITitle: "Abrir NODUS — capturar conversaciones con IA"
  },
  panels: { pinned: "Fijados", radar: "Radar", watch: "Vigilar", settings: "Configuración del Lens", comingSoon: "pronto" },
  pinned: {
    empty: "Sin posts fijados.",
    hint: "Haz clic en el 📌 junto a cualquier post en Hacker News para seguirlo aquí.",
    pointsUnit: "pts", commentsUnit: "comentarios", unpin: "Desfijar",
    hoverHint: "Pasa el cursor para ver los comentarios",
    addTag: "+ tag", tagPlaceholder: "Nombre de etiqueta…", removeTag: "Haz clic para eliminar",
    collapse: "Contraer", expand: "Expandir"
  },
  comments: {
    loading: "Cargando comentarios…", empty: "Sin comentarios aún.",
    error: "No se pudieron cargar los comentarios",
    viewAll: "Ver los {count} comentarios →",
    reply: "respuesta", replies: "respuestas"
  },
  radar: {
    placeholder: "Posts en alza, puntajes de velocidad y señales",
    placeholderHint: "La Fase 2 rastreará el crecimiento de los posts en tiempo real.",
    rising: "En alza", refresh: "Actualizar",
    empty: "Sin datos aún — abre el panel después de navegar HN por unos minutos.",
    sources: { top: "Top", best: "Mejores", show: "Show HN", ask: "Ask HN" }
  },
  settings: {
    theme: "Tema", themeAuto: "Auto", themeLight: "Claro", themeDark: "Oscuro",
    fontSize: "Tamaño de fuente", sizeSmall: "Pequeño", sizeMedium: "Mediano", sizeLarge: "Grande",
    width: "Ancho de lectura", widthNormal: "Normal", widthWide: "Ancho",
    behavior: "Comportamiento", compact: "Filas compactas", grayVisited: "Atenuar posts visitados",
    highlights: "Resaltar tipos de post", showHN: "Show HN", askHN: "Ask HN", launchHN: "Launch HN",
    language: "Idioma de la interfaz", translation: "Traducción", beta: "beta",
    transScope: "Estas opciones afectan solo al contenido de este panel. Para traducir posts en la página de HN, usa los botones 🌐 allí.",
    autoTransPinned: "Traducir títulos de posts fijados",
    autoTransComments: "Traducir vistas previas de comentarios",
    targetLang: "Idioma de destino (compartido)", targetAuto: "Auto (navegador)",
    transReady: "Usa el traductor integrado de Chrome — local, gratis, sin clave de API.",
    transUnavailable: "Traductor integrado no disponible en este navegador. Chrome 138+ requerido."
  },
  page: {
    translatePage: "Traducir página a {lang}", restoreOriginals: "↩ Restaurar originales",
    translating: "Traduciendo…", translateOne: "Traducir este título"
  }
};
