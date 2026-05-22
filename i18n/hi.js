export default {
  app: { name: "NODUS HN Radar", brand: "NODUS द्वारा निर्मित", openHN: "Hacker News खोलें" },
  master: { enabled: "Lens सक्षम", hint: "news.ycombinator.com पर पठन परत" },
  panels: { pinned: "पिन किए गए", radar: "रडार", settings: "Lens सेटिंग्स", comingSoon: "जल्द आ रहा है" },
  pinned: {
    empty: "कोई पिन किया हुआ पोस्ट नहीं।",
    hint: "Hacker News पर किसी भी पोस्ट के बगल में 📌 क्लिक करें।",
    pointsUnit: "अंक", commentsUnit: "टिप्पणियाँ", unpin: "अनपिन",
    hoverHint: "टिप्पणियाँ देखने के लिए होवर करें",
    addTag: "+ टैग", tagPlaceholder: "टैग का नाम…", removeTag: "हटाने के लिए क्लिक करें",
    collapse: "संकुचित", expand: "विस्तार"
  },
  comments: {
    loading: "टिप्पणियाँ लोड हो रही हैं…", empty: "अभी तक कोई टिप्पणी नहीं।",
    error: "टिप्पणियाँ लोड नहीं हो सकीं",
    viewAll: "सभी {count} टिप्पणियाँ देखें →", reply: "उत्तर", replies: "उत्तर"
  },
  radar: {
    placeholder: "बढ़ते पोस्ट, वेलोसिटी स्कोर और संकेत",
    placeholderHint: "फेज़ 2 पोस्ट की वृद्धि को वास्तविक समय में ट्रैक करेगा।",
    rising: "बढ़ रहे", refresh: "रिफ्रेश",
    empty: "अभी कोई डेटा नहीं — HN ब्राउज़ करने के बाद पैनल खोलें।",
    sources: { top: "Top", best: "बेस्ट", show: "Show HN", ask: "Ask HN" }
  },
  settings: {
    theme: "थीम", themeAuto: "ऑटो", themeLight: "लाइट", themeDark: "डार्क",
    fontSize: "फ़ॉन्ट आकार", sizeSmall: "छोटा", sizeMedium: "मध्यम", sizeLarge: "बड़ा",
    width: "पठन चौड़ाई", widthNormal: "सामान्य", widthWide: "चौड़ा",
    behavior: "व्यवहार", compact: "कॉम्पैक्ट पंक्तियाँ", grayVisited: "देखे गए पोस्ट को धूसर करें",
    highlights: "पोस्ट प्रकार हाइलाइट करें", showHN: "Show HN", askHN: "Ask HN", launchHN: "Launch HN",
    language: "इंटरफ़ेस भाषा", translation: "अनुवाद", beta: "बीटा",
    transScope: "ये सेटिंग्स केवल इस पैनल के अंदर की सामग्री को प्रभावित करती हैं। HN पेज पर पोस्ट का अनुवाद करने के लिए वहाँ 🌐 बटन का उपयोग करें।",
    autoTransPinned: "पिन किए गए पोस्ट के शीर्षक अनुवाद करें",
    autoTransComments: "टिप्पणी पूर्वावलोकन अनुवाद करें",
    targetLang: "लक्ष्य भाषा (साझा)", targetAuto: "ऑटो (ब्राउज़र)",
    transReady: "Chrome के अंतर्निहित अनुवादक का उपयोग करता है — लोकल, मुफ्त, बिना API कुंजी के।",
    transUnavailable: "इस ब्राउज़र में अंतर्निहित अनुवादक उपलब्ध नहीं है। Chrome 138+ आवश्यक।"
  },
  page: {
    translatePage: "पेज को {lang} में अनुवाद करें", restoreOriginals: "↩ मूल पुनर्स्थापित करें",
    translating: "अनुवाद हो रहा है…", translateOne: "इस शीर्षक का अनुवाद करें"
  }
};
