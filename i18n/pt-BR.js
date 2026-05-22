export default {
  app: {
    name: "NODUS HN Radar",
    brand: "Feito por NODUS",
    openHN: "Abrir Hacker News"
  },
  master: {
    enabled: "Lens ativado",
    hint: "Camada de leitura visual em news.ycombinator.com"
  },
  panels: {
    pinned:   "Fixados",
    radar:    "Radar",
    settings: "Configurações do Lens",
    comingSoon: "em breve"
  },
  pinned: {
    empty: "Nenhum post fixado.",
    hint:  "Clique no 📌 ao lado de qualquer post no Hacker News para acompanhá-lo aqui.",
    pointsUnit:   "pts",
    commentsUnit: "comentários",
    unpin: "Desfixar",
    hoverHint: "Passe o mouse para ver os comentários",
    addTag:    "+ tag",
    tagPlaceholder: "Nome da tag…",
    removeTag: "Clique para remover",
    collapse:  "Recolher",
    expand:    "Expandir"
  },
  comments: {
    loading: "Carregando comentários…",
    empty:   "Ainda sem comentários.",
    error:   "Não foi possível carregar os comentários",
    viewAll: "Ver todos os {count} comentários →",
    reply:   "resposta",
    replies: "respostas"
  },
  radar: {
    placeholder:      "Posts em ascensão, scores de velocidade e sinais",
    placeholderHint:  "A Fase 2 vai rastrear o crescimento dos posts em tempo real e destacar o que está prestes a explodir.",
    rising:           "Em ascensão",
    refresh:          "Atualizar",
    empty:            "Sem dados ainda — abra o painel após navegar no HN por alguns minutos.",
    sources: {
      top:  "Top",
      best: "Melhores",
      show: "Show HN",
      ask:  "Ask HN"
    },
    opActive:    "OP ATIVO",
    opActiveTip: "O autor respondeu na discussão",
    heated:      "quente",
    active:      "ativa",
    saveToNodus: "Salvar no NODUS",
    velocityTip: "Velocity: crescimento ponderado por hora"
  },
  settings: {
    theme:      "Tema",
    themeAuto:  "Auto",
    themeLight: "Claro",
    themeDark:  "Escuro",
    fontSize:   "Tamanho da fonte",
    sizeSmall:  "Pequeno",
    sizeMedium: "Médio",
    sizeLarge:  "Grande",
    width:      "Largura de leitura",
    widthNormal:"Normal",
    widthWide:  "Larga",
    behavior:   "Comportamento",
    compact:    "Linhas compactas",
    grayVisited:"Acinzentar posts visitados",
    highlights: "Destacar tipos de post",
    showHN:     "Show HN",
    askHN:      "Ask HN",
    launchHN:   "Launch HN",
    language:   "Idioma da interface",
    translation:"Tradução",
    beta:       "beta",
    transScope: "Essas configurações afetam apenas o conteúdo deste painel. Para traduzir posts na página do HN, use os botões 🌐 lá.",
    autoTransPinned:   "Traduzir títulos dos posts fixados",
    autoTransComments: "Traduzir prévias dos comentários",
    targetLang:        "Idioma de destino (compartilhado)",
    targetAuto:        "Auto (navegador)",
    transReady:        "Usa o tradutor embutido do Chrome — local, grátis, sem chave de API.",
    transUnavailable:  "Tradutor embutido indisponível neste navegador. Chrome 138+ necessário.",
    mutedDomains:      "Domínios silenciados",
    mutedDomainsHint:  "Um por linha. Posts desses domínios serão ocultados no Radar.",
    mutedDomainsPh:    "ex: medium.com\nx.com",
    zebraTitle:        "Linhas intercaladas",
    zebraEnable:       "Tingir linhas alternadas",
    zebraColor:        "Cor",
    zebraIntensity:    "Intensidade"
  },
  page: {
    translatePage:  "Traduzir página para {lang}",
    restoreOriginals: "↩ Restaurar originais",
    translating:    "Traduzindo…",
    translateOne:   "Traduzir este título"
  }
};
