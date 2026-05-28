export default {
  app: { name: "NODUS HN Radar", brand: "Créé par NODUS", openHN: "Ouvrir Hacker News", openSite: "Ouvrir le site HN Radar" },
  master: { enabled: "Lens activé", hint: "Couche de lecture visuelle sur news.ycombinator.com" },
  panels: { pinned: "Épinglés", radar: "Radar", settings: "Paramètres du Lens", comingSoon: "bientôt" },
  pinned: {
    empty: "Aucun post épinglé.",
    hint: "Cliquez sur 📌 à côté d'un post sur Hacker News pour le suivre ici.",
    pointsUnit: "pts", commentsUnit: "commentaires", unpin: "Désépingler",
    hoverHint: "Survolez pour voir les commentaires",
    addTag: "+ tag", tagPlaceholder: "Nom du tag…", removeTag: "Cliquez pour supprimer",
    collapse: "Réduire", expand: "Développer"
  },
  comments: {
    loading: "Chargement des commentaires…", empty: "Aucun commentaire pour l'instant.",
    error: "Impossible de charger les commentaires",
    viewAll: "Voir les {count} commentaires →", reply: "réponse", replies: "réponses"
  },
  radar: {
    placeholder: "Posts qui montent, scores de vélocité et signaux",
    placeholderHint: "La phase 2 suivra la croissance des posts en temps réel.",
    rising: "En hausse", refresh: "Actualiser",
    empty: "Pas encore de données — ouvrez le panneau après quelques minutes de navigation sur HN.",
    sources: { top: "Top", best: "Meilleurs", show: "Show HN", ask: "Ask HN" }
  },
  settings: {
    theme: "Thème", themeAuto: "Auto", themeLight: "Clair", themeDark: "Sombre",
    fontSize: "Taille de police", sizeSmall: "Petite", sizeMedium: "Moyenne", sizeLarge: "Grande",
    width: "Largeur de lecture", widthNormal: "Normal", widthWide: "Large",
    behavior: "Comportement", compact: "Lignes compactes", grayVisited: "Griser les posts visités",
    highlights: "Mettre en évidence les types", showHN: "Show HN", askHN: "Ask HN", launchHN: "Launch HN",
    language: "Langue de l'interface", translation: "Traduction", beta: "bêta",
    transScope: "Ces paramètres n'affectent que le contenu de ce panneau. Pour traduire les posts sur HN, utilisez les boutons 🌐 là-bas.",
    autoTransPinned: "Traduire les titres des posts épinglés",
    autoTransComments: "Traduire les aperçus de commentaires",
    targetLang: "Langue cible (partagée)", targetAuto: "Auto (navigateur)",
    transReady: "Utilise le traducteur intégré de Chrome — local, gratuit, sans clé API.",
    transUnavailable: "Traducteur intégré indisponible dans ce navigateur. Chrome 138+ requis."
  },
  page: {
    translatePage: "Traduire la page en {lang}", restoreOriginals: "↩ Restaurer les originaux",
    translating: "Traduction…", translateOne: "Traduire ce titre"
  }
};
