export default {
  app: { name: "NODUS HN Radar", brand: "Hecho por NODUS", openHN: "Abrir Hacker News", openSite: "Abrir sitio del HN Radar" },
  master: { enabled: "Lens activado", hint: "Capa de lectura visual en news.ycombinator.com" },
  panels: { pinned: "Fijados", radar: "Radar", settings: "Configuración del Lens", comingSoon: "pronto" },
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
