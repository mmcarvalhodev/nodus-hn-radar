export default {
  app: { name: "NODUS HN Radar", brand: "由 NODUS 制作", openHN: "打开 Hacker News", openSite: "打开 HN Radar 网站" },
  master: { enabled: "Lens 已启用", hint: "news.ycombinator.com 的视觉阅读层" },
  watch: {
    tab:             "监视",
    intro:           "当帖子越过您的阈值时收到提醒。轮询仅在此面板打开时运行 — 无后台任务,无需通知权限。",
    newRule:         "+ 新规则",
    edit:            "编辑",
    delete:          "删除",
    ruleName:        "规则名称",
    ruleNamePh:      "例如:大型 Show HN 帖子",
    feeds:           "监视来源",
    conditions:      "条件",
    condsHint:       "留空任意值以跳过该条件。所有填写的条件必须匹配(AND)。",
    points:          "点数",
    comments:        "评论",
    velocity:        "速度",
    save:            "保存规则",
    cancel:          "取消",
    notifications:   "通知",
    markAllRead:     "全部标为已读",
    noNotifications: "没有新的匹配。",
    manageRules:     "管理规则 ⚙",
    lastMatchNever:  "尚无匹配",
    lastMatch:       "最后匹配:{time}",
    matches:         "{n} 个匹配",
    match:           "1 个匹配"
  },
  cta: {
    lostAIPitch: "AI 对话正在丢失?",
    lostAITitle: "打开 NODUS — 捕获 AI 对话"
  },
  panels: { pinned: "已固定", radar: "雷达", watch: "监视", settings: "Lens 设置", comingSoon: "即将推出" },
  pinned: {
    empty: "没有已固定的帖子。",
    hint: "点击 Hacker News 帖子旁的 📌 在此追踪。",
    pointsUnit: "分", commentsUnit: "评论", unpin: "取消固定",
    hoverHint: "悬停预览评论",
    addTag: "+ 标签", tagPlaceholder: "标签名…", removeTag: "点击移除",
    collapse: "折叠", expand: "展开"
  },
  comments: {
    loading: "正在加载评论…", empty: "暂无评论。",
    error: "无法加载评论", viewAll: "查看全部 {count} 条评论 →",
    reply: "回复", replies: "回复"
  },
  radar: {
    placeholder: "上升帖子、速度评分和信号",
    placeholderHint: "第二阶段将实时追踪帖子增长。",
    rising: "上升中", refresh: "刷新",
    empty: "暂无数据 — 在 HN 浏览几分钟后打开面板。",
    sources: { top: "Top", best: "最佳", show: "Show HN", ask: "Ask HN" }
  },
  settings: {
    theme: "主题", themeAuto: "自动", themeLight: "浅色", themeDark: "深色",
    fontSize: "字体大小", sizeSmall: "小", sizeMedium: "中", sizeLarge: "大",
    width: "阅读宽度", widthNormal: "正常", widthWide: "宽",
    behavior: "行为", compact: "紧凑行", grayVisited: "已访问帖子变灰",
    highlights: "高亮帖子类型", showHN: "Show HN", askHN: "Ask HN", launchHN: "Launch HN",
    language: "界面语言", translation: "翻译", beta: "测试版",
    transScope: "这些设置仅影响此面板内的内容。要翻译 HN 页面上的帖子,请使用那里的 🌐 按钮。",
    autoTransPinned: "翻译已固定帖子的标题",
    autoTransComments: "翻译评论预览",
    targetLang: "目标语言(共享)", targetAuto: "自动(浏览器)",
    transReady: "使用 Chrome 内置翻译器 — 本地、免费、无需 API 密钥。",
    transUnavailable: "此浏览器不支持内置翻译器。需要 Chrome 138+。"
  },
  page: {
    translatePage: "将页面翻译为 {lang}", restoreOriginals: "↩ 恢复原文",
    translating: "翻译中…", translateOne: "翻译此标题"
  }
};
