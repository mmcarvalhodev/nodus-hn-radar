export default {
  app: { name: "NODUS HN Radar", brand: "Dibuat oleh NODUS", openHN: "Buka Hacker News", openSite: "Buka situs HN Radar" },
  master: { enabled: "Lens aktif", hint: "Lapisan baca visual di news.ycombinator.com" },
  watch: {
    tab:             "Pantau",
    intro:           "Dapatkan peringatan saat post melewati ambang batas Anda. Polling hanya berjalan saat panel ini terbuka — tanpa kerja latar belakang, tanpa izin notifikasi.",
    newRule:         "+ Aturan baru",
    edit:            "Edit",
    delete:          "Hapus",
    ruleName:        "Nama aturan",
    ruleNamePh:      "mis. Post Show HN besar",
    feeds:           "Pantau di",
    conditions:      "Kondisi",
    condsHint:       "Biarkan nilai kosong untuk melewati kondisi itu. Semua kondisi yang diisi harus cocok (DAN).",
    points:          "Poin",
    comments:        "Komentar",
    velocity:        "Kecepatan",
    save:            "Simpan aturan",
    cancel:          "Batal",
    notifications:   "Notifikasi",
    markAllRead:     "Tandai semua sudah dibaca",
    noNotifications: "Tidak ada kecocokan baru.",
    manageRules:     "Kelola aturan ⚙",
    lastMatchNever:  "Belum ada kecocokan",
    lastMatch:       "Kecocokan terakhir: {time}",
    matches:         "{n} kecocokan",
    match:           "1 kecocokan",
    deleteConfirm:   "Konfirmasi?",
    errNameRequired: "Mohon beri nama untuk aturan.",
    errFeedRequired: "Pilih setidaknya satu feed untuk dipantau.",
    errCondsRequired: "Isi setidaknya satu kondisi.",
    errMaxReached:   "Maksimum 5 aturan tercapai. Hapus satu untuk menambah aturan baru.",
    capHint:         "Semua {max} slot terpakai — hapus satu aturan untuk menambah yang baru.",
    toggleHint:      "Aktifkan atau matikan aturan ini"
  },
  cta: {
    lostAIPitch: "Kehilangan percakapan AI Anda?",
    lostAITitle: "Buka NODUS — tangkap percakapan AI"
  },
  panels: { pinned: "Disematkan", radar: "Radar", watch: "Pantau", settings: "Pengaturan Lens", comingSoon: "segera hadir" },
  pinned: {
    empty: "Tidak ada post yang disematkan.",
    hint: "Klik 📌 di sebelah post mana pun di Hacker News untuk melacaknya di sini.",
    pointsUnit: "poin", commentsUnit: "komentar", unpin: "Lepas",
    hoverHint: "Arahkan untuk pratinjau komentar",
    addTag: "+ tag", tagPlaceholder: "Nama tag…", removeTag: "Klik untuk hapus",
    collapse: "Ciutkan", expand: "Bentangkan"
  },
  comments: {
    loading: "Memuat komentar…", empty: "Belum ada komentar.",
    error: "Gagal memuat komentar",
    viewAll: "Lihat semua {count} komentar →", reply: "balasan", replies: "balasan"
  },
  radar: {
    placeholder: "Post yang naik, skor velocity, dan sinyal",
    placeholderHint: "Fase 2 akan melacak pertumbuhan post secara real-time.",
    rising: "Sedang naik", refresh: "Segarkan",
    empty: "Belum ada data — buka panel setelah beberapa menit di HN.",
    sources: { top: "Top", best: "Terbaik", show: "Show HN", ask: "Ask HN" }
  },
  settings: {
    theme: "Tema", themeAuto: "Auto", themeLight: "Terang", themeDark: "Gelap",
    fontSize: "Ukuran font", sizeSmall: "Kecil", sizeMedium: "Sedang", sizeLarge: "Besar",
    width: "Lebar baca", widthNormal: "Normal", widthWide: "Lebar",
    behavior: "Perilaku", compact: "Baris kompak", grayVisited: "Buramkan post yang dikunjungi",
    highlights: "Sorot tipe post", showHN: "Show HN", askHN: "Ask HN", launchHN: "Launch HN",
    language: "Bahasa antarmuka", translation: "Terjemahan", beta: "beta",
    transScope: "Pengaturan ini hanya memengaruhi konten di panel ini. Untuk menerjemahkan post di halaman HN, gunakan tombol 🌐 di sana.",
    autoTransPinned: "Terjemahkan judul post yang disematkan",
    autoTransComments: "Terjemahkan pratinjau komentar",
    targetLang: "Bahasa target (dibagikan)", targetAuto: "Auto (browser)",
    transReady: "Menggunakan penerjemah bawaan Chrome — lokal, gratis, tanpa kunci API.",
    transUnavailable: "Penerjemah bawaan tidak tersedia di browser ini. Chrome 138+ diperlukan."
  },
  page: {
    translatePage: "Terjemahkan halaman ke {lang}", restoreOriginals: "↩ Pulihkan asli",
    translating: "Menerjemahkan…", translateOne: "Terjemahkan judul ini"
  }
};
