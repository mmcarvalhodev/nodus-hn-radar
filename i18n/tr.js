export default {
  app: { name: "NODUS HN Radar", brand: "NODUS tarafından", openHN: "Hacker News'i Aç", openSite: "HN Radar web sitesini aç" },
  master: { enabled: "Lens etkin", hint: "news.ycombinator.com için görsel okuma katmanı" },
  watch: {
    tab:             "İzle",
    intro:           "Gönderiler eşiklerinizi aştığında bildirim alın. Yoklama yalnızca bu panel açıkken çalışır — arka plan işi yok, bildirim izni gerekmez.",
    newRule:         "+ Yeni kural",
    edit:            "Düzenle",
    delete:          "Sil",
    ruleName:        "Kural adı",
    ruleNamePh:      "ör: Büyük Show HN gönderileri",
    feeds:           "Şurada izle",
    conditions:      "Koşullar",
    condsHint:       "Bir değeri boş bırakırsanız o koşul atlanır. Doldurulan tüm koşullar eşleşmeli (VE).",
    points:          "Puan",
    comments:        "Yorum",
    velocity:        "Hız",
    save:            "Kuralı kaydet",
    cancel:          "İptal",
    notifications:   "Bildirimler",
    markAllRead:     "Tümünü okundu işaretle",
    noNotifications: "Yeni eşleşme yok.",
    manageRules:     "Kuralları yönet ⚙",
    lastMatchNever:  "Henüz eşleşme yok",
    lastMatch:       "Son eşleşme: {time}",
    matches:         "{n} eşleşme",
    match:           "1 eşleşme",
    deleteConfirm:   "Onayla?",
    errNameRequired: "Lütfen kurala bir ad verin.",
    errFeedRequired: "İzlemek için en az bir akış seçin.",
    errCondsRequired: "En az bir koşul doldurun."
  },
  cta: {
    lostAIPitch: "AI sohbetlerinizi kaybediyor musunuz?",
    lostAITitle: "NODUS'u aç — AI sohbetlerini yakala"
  },
  panels: { pinned: "Sabitlenenler", radar: "Radar", watch: "İzle", settings: "Lens ayarları", comingSoon: "yakında" },
  pinned: {
    empty: "Sabitlenmiş gönderi yok.",
    hint: "Burada takip etmek için Hacker News'teki herhangi bir gönderinin yanındaki 📌'ye tıklayın.",
    pointsUnit: "puan", commentsUnit: "yorum", unpin: "Sabiti kaldır",
    hoverHint: "Yorumları görmek için üzerine gelin",
    addTag: "+ etiket", tagPlaceholder: "Etiket adı…", removeTag: "Kaldırmak için tıkla",
    collapse: "Daralt", expand: "Genişlet"
  },
  comments: {
    loading: "Yorumlar yükleniyor…", empty: "Henüz yorum yok.",
    error: "Yorumlar yüklenemedi",
    viewAll: "Tüm {count} yorumu gör →", reply: "yanıt", replies: "yanıt"
  },
  radar: {
    placeholder: "Yükselen gönderiler, hız puanları ve sinyaller",
    placeholderHint: "Faz 2 gönderi büyümesini gerçek zamanlı takip edecek.",
    rising: "Yükseliyor", refresh: "Yenile",
    empty: "Henüz veri yok — HN'de birkaç dakika gezdikten sonra paneli açın.",
    sources: { top: "Top", best: "En iyiler", show: "Show HN", ask: "Ask HN" }
  },
  settings: {
    theme: "Tema", themeAuto: "Otomatik", themeLight: "Açık", themeDark: "Koyu",
    fontSize: "Yazı boyutu", sizeSmall: "Küçük", sizeMedium: "Orta", sizeLarge: "Büyük",
    width: "Okuma genişliği", widthNormal: "Normal", widthWide: "Geniş",
    behavior: "Davranış", compact: "Kompakt satırlar", grayVisited: "Ziyaret edilenleri gri yap",
    highlights: "Gönderi türlerini vurgula", showHN: "Show HN", askHN: "Ask HN", launchHN: "Launch HN",
    language: "Arayüz dili", translation: "Çeviri", beta: "beta",
    transScope: "Bu ayarlar yalnızca bu paneldeki içeriği etkiler. HN sayfasındaki gönderileri çevirmek için oradaki 🌐 düğmelerini kullanın.",
    autoTransPinned: "Sabitlenmiş gönderi başlıklarını çevir",
    autoTransComments: "Yorum önizlemelerini çevir",
    targetLang: "Hedef dil (paylaşılan)", targetAuto: "Otomatik (tarayıcı)",
    transReady: "Chrome'un yerleşik çevirmenini kullanır — yerel, ücretsiz, API anahtarı gerekmez.",
    transUnavailable: "Bu tarayıcıda yerleşik çevirmen yok. Chrome 138+ gerekli."
  },
  page: {
    translatePage: "Sayfayı {lang} diline çevir", restoreOriginals: "↩ Orijinalleri geri yükle",
    translating: "Çeviriliyor…", translateOne: "Bu başlığı çevir"
  }
};
