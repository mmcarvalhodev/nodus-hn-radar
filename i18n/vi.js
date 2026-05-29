export default {
  app: { name: "NODUS HN Radar", brand: "Tạo bởi NODUS", openHN: "Mở Hacker News", openSite: "Mở trang web HN Radar" },
  master: { enabled: "Lens đang bật", hint: "Lớp đọc trực quan trên news.ycombinator.com" },
  watch: {
    tab:             "Theo dõi",
    intro:           "Nhận thông báo khi bài viết vượt ngưỡng của bạn. Việc kiểm tra chỉ chạy khi panel này mở — không có công việc nền, không cần quyền thông báo.",
    newRule:         "+ Quy tắc mới",
    edit:            "Sửa",
    delete:          "Xóa",
    ruleName:        "Tên quy tắc",
    ruleNamePh:      "vd: Bài Show HN lớn",
    feeds:           "Theo dõi trên",
    conditions:      "Điều kiện",
    condsHint:       "Để trống giá trị nào để bỏ qua điều kiện đó. Tất cả điều kiện đã điền phải khớp (VÀ).",
    points:          "Điểm",
    comments:        "Bình luận",
    velocity:        "Vận tốc",
    save:            "Lưu quy tắc",
    cancel:          "Hủy",
    notifications:   "Thông báo",
    markAllRead:     "Đánh dấu tất cả đã đọc",
    noNotifications: "Không có kết quả khớp mới.",
    manageRules:     "Quản lý quy tắc ⚙",
    lastMatchNever:  "Chưa có kết quả khớp",
    lastMatch:       "Khớp gần nhất: {time}",
    matches:         "{n} kết quả khớp",
    match:           "1 kết quả khớp"
  },
  cta: {
    lostAIPitch: "Mất các cuộc trò chuyện AI?",
    lostAITitle: "Mở NODUS — lưu cuộc trò chuyện AI"
  },
  panels: { pinned: "Đã ghim", radar: "Radar", watch: "Theo dõi", settings: "Cài đặt Lens", comingSoon: "sắp ra mắt" },
  pinned: {
    empty: "Không có bài viết được ghim.",
    hint: "Nhấp 📌 cạnh bất kỳ bài viết nào trên Hacker News để theo dõi tại đây.",
    pointsUnit: "đ", commentsUnit: "bình luận", unpin: "Bỏ ghim",
    hoverHint: "Di chuột để xem trước bình luận",
    addTag: "+ thẻ", tagPlaceholder: "Tên thẻ…", removeTag: "Nhấn để xóa",
    collapse: "Thu gọn", expand: "Mở rộng"
  },
  comments: {
    loading: "Đang tải bình luận…", empty: "Chưa có bình luận.",
    error: "Không thể tải bình luận",
    viewAll: "Xem tất cả {count} bình luận →", reply: "phản hồi", replies: "phản hồi"
  },
  radar: {
    placeholder: "Bài viết đang lên, điểm vận tốc và tín hiệu",
    placeholderHint: "Giai đoạn 2 sẽ theo dõi sự phát triển của bài viết theo thời gian thực.",
    rising: "Đang lên", refresh: "Làm mới",
    empty: "Chưa có dữ liệu — mở panel sau khi duyệt HN vài phút.",
    sources: { top: "Top", best: "Tốt nhất", show: "Show HN", ask: "Ask HN" }
  },
  settings: {
    theme: "Giao diện", themeAuto: "Tự động", themeLight: "Sáng", themeDark: "Tối",
    fontSize: "Cỡ chữ", sizeSmall: "Nhỏ", sizeMedium: "Vừa", sizeLarge: "Lớn",
    width: "Độ rộng đọc", widthNormal: "Bình thường", widthWide: "Rộng",
    behavior: "Hành vi", compact: "Hàng gọn", grayVisited: "Làm xám bài đã xem",
    highlights: "Tô sáng loại bài", showHN: "Show HN", askHN: "Ask HN", launchHN: "Launch HN",
    language: "Ngôn ngữ giao diện", translation: "Dịch", beta: "beta",
    transScope: "Các cài đặt này chỉ áp dụng cho nội dung trong panel này. Để dịch bài viết trên trang HN, dùng nút 🌐 ở đó.",
    autoTransPinned: "Dịch tiêu đề bài đã ghim",
    autoTransComments: "Dịch xem trước bình luận",
    targetLang: "Ngôn ngữ đích (chung)", targetAuto: "Tự động (trình duyệt)",
    transReady: "Dùng trình dịch tích hợp của Chrome — cục bộ, miễn phí, không cần API key.",
    transUnavailable: "Trình dịch tích hợp không khả dụng trong trình duyệt này. Yêu cầu Chrome 138+."
  },
  page: {
    translatePage: "Dịch trang sang {lang}", restoreOriginals: "↩ Khôi phục bản gốc",
    translating: "Đang dịch…", translateOne: "Dịch tiêu đề này"
  }
};
