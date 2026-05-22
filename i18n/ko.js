export default {
  app: { name: "NODUS HN Radar", brand: "NODUS 제작", openHN: "Hacker News 열기" },
  master: { enabled: "Lens 사용", hint: "news.ycombinator.com 가독성 레이어" },
  panels: { pinned: "고정됨", radar: "레이더", settings: "Lens 설정", comingSoon: "곧 공개" },
  pinned: {
    empty: "고정된 게시물이 없습니다.",
    hint: "Hacker News 게시물의 📌를 클릭해 여기서 추적하세요.",
    pointsUnit: "점", commentsUnit: "댓글", unpin: "고정 해제",
    hoverHint: "마우스를 올려 댓글 미리보기",
    addTag: "+ 태그", tagPlaceholder: "태그 이름…", removeTag: "클릭하여 제거",
    collapse: "접기", expand: "펼치기"
  },
  comments: {
    loading: "댓글 불러오는 중…", empty: "아직 댓글이 없습니다.",
    error: "댓글을 불러올 수 없습니다",
    viewAll: "전체 댓글 {count}개 보기 →", reply: "답글", replies: "답글"
  },
  radar: {
    placeholder: "상승 중인 게시물, 속도 점수, 시그널",
    placeholderHint: "2단계에서는 게시물 성장을 실시간으로 추적합니다.",
    rising: "상승 중", refresh: "새로고침",
    empty: "데이터 없음 — HN을 몇 분 둘러본 후 패널을 여세요.",
    sources: { top: "탑", best: "베스트", show: "Show HN", ask: "Ask HN" }
  },
  settings: {
    theme: "테마", themeAuto: "자동", themeLight: "밝게", themeDark: "어둡게",
    fontSize: "글꼴 크기", sizeSmall: "작게", sizeMedium: "중간", sizeLarge: "크게",
    width: "읽기 너비", widthNormal: "보통", widthWide: "넓게",
    behavior: "동작", compact: "컴팩트 행", grayVisited: "방문한 게시물 회색",
    highlights: "게시물 타입 강조", showHN: "Show HN", askHN: "Ask HN", launchHN: "Launch HN",
    language: "인터페이스 언어", translation: "번역", beta: "베타",
    transScope: "이 설정은 이 패널 내 콘텐츠에만 적용됩니다. HN 페이지의 게시물 번역은 그곳의 🌐 버튼을 사용하세요.",
    autoTransPinned: "고정된 게시물 제목 번역",
    autoTransComments: "댓글 미리보기 번역",
    targetLang: "대상 언어 (공유)", targetAuto: "자동 (브라우저)",
    transReady: "Chrome 내장 번역기 사용 — 로컬, 무료, API 키 불필요.",
    transUnavailable: "이 브라우저에서 내장 번역기를 사용할 수 없습니다. Chrome 138+ 필요."
  },
  page: {
    translatePage: "페이지를 {lang}로 번역", restoreOriginals: "↩ 원문 복원",
    translating: "번역 중…", translateOne: "이 제목 번역"
  }
};
