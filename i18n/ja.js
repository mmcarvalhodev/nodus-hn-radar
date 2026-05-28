export default {
  app: { name: "NODUS HN Radar", brand: "NODUS 製作", openHN: "Hacker News を開く", openSite: "HN Radarのウェブサイトを開く" },
  master: { enabled: "Lens 有効", hint: "news.ycombinator.com の読みやすさレイヤー" },
  panels: { pinned: "ピン留め", radar: "レーダー", settings: "Lens 設定", comingSoon: "近日公開" },
  pinned: {
    empty: "ピン留めされた投稿はありません。",
    hint: "Hacker News の投稿の📌をクリックしてここで追跡できます。",
    pointsUnit: "ポイント", commentsUnit: "コメント", unpin: "ピン解除",
    hoverHint: "ホバーでコメントをプレビュー",
    addTag: "+ タグ", tagPlaceholder: "タグ名…", removeTag: "クリックで削除",
    collapse: "折りたたむ", expand: "展開"
  },
  comments: {
    loading: "コメントを読み込み中…", empty: "まだコメントはありません。",
    error: "コメントを読み込めませんでした",
    viewAll: "{count} 件のコメントを全て表示 →", reply: "返信", replies: "返信"
  },
  radar: {
    placeholder: "上昇中の投稿、速度スコア、シグナル",
    placeholderHint: "フェーズ2では投稿の成長をリアルタイムで追跡します。",
    rising: "上昇中", refresh: "更新",
    empty: "まだデータがありません — HNを数分間閲覧してからパネルを開いてください。",
    sources: { top: "トップ", best: "ベスト", show: "Show HN", ask: "Ask HN" }
  },
  settings: {
    theme: "テーマ", themeAuto: "自動", themeLight: "ライト", themeDark: "ダーク",
    fontSize: "フォントサイズ", sizeSmall: "小", sizeMedium: "中", sizeLarge: "大",
    width: "読み取り幅", widthNormal: "通常", widthWide: "広い",
    behavior: "動作", compact: "コンパクト表示", grayVisited: "既読をグレー表示",
    highlights: "投稿タイプを強調", showHN: "Show HN", askHN: "Ask HN", launchHN: "Launch HN",
    language: "インターフェース言語", translation: "翻訳", beta: "ベータ",
    transScope: "これらの設定はこのパネル内のコンテンツにのみ適用されます。HNページの投稿を翻訳するにはそちらの🌐ボタンを使用してください。",
    autoTransPinned: "ピン留め投稿のタイトルを翻訳",
    autoTransComments: "コメントプレビューを翻訳",
    targetLang: "ターゲット言語 (共有)", targetAuto: "自動 (ブラウザ)",
    transReady: "Chrome 内蔵の翻訳機能を使用 — ローカル、無料、APIキー不要。",
    transUnavailable: "このブラウザでは内蔵翻訳機能が利用できません。Chrome 138+ が必要です。"
  },
  page: {
    translatePage: "ページを {lang} に翻訳", restoreOriginals: "↩ 原文に戻す",
    translating: "翻訳中…", translateOne: "このタイトルを翻訳"
  }
};
