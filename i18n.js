import en    from "./i18n/en.js";
import ptBR  from "./i18n/pt-BR.js";
import es    from "./i18n/es.js";
import fr    from "./i18n/fr.js";
import de    from "./i18n/de.js";
import it    from "./i18n/it.js";
import nl    from "./i18n/nl.js";
import ja    from "./i18n/ja.js";
import ko    from "./i18n/ko.js";
import zh    from "./i18n/zh.js";
import ru    from "./i18n/ru.js";
import pl    from "./i18n/pl.js";
import trLang from "./i18n/tr.js";
import hi    from "./i18n/hi.js";
import id    from "./i18n/id.js";
import vi    from "./i18n/vi.js";

export const LANGUAGES = [
  { code: "en",    label: "English"           },
  { code: "pt-BR", label: "Português (BR)"    },
  { code: "es",    label: "Español"           },
  { code: "fr",    label: "Français"          },
  { code: "de",    label: "Deutsch"           },
  { code: "it",    label: "Italiano"          },
  { code: "nl",    label: "Nederlands"        },
  { code: "ja",    label: "日本語"             },
  { code: "ko",    label: "한국어"             },
  { code: "zh",    label: "中文"               },
  { code: "ru",    label: "Русский"           },
  { code: "pl",    label: "Polski"            },
  { code: "tr",    label: "Türkçe"            },
  { code: "hi",    label: "हिन्दी"             },
  { code: "id",    label: "Bahasa Indonesia"  },
  { code: "vi",    label: "Tiếng Việt"        }
];

export const RTL_LANGS = new Set();

const STRINGS = {
  "en": en, "pt-BR": ptBR, "es": es, "fr": fr, "de": de, "it": it,
  "nl": nl, "ja": ja, "ko": ko, "zh": zh, "ru": ru, "pl": pl,
  "tr": trLang, "hi": hi, "id": id, "vi": vi
};

let _lang = "en";

export function detectLanguage() {
  const nav = (navigator.language || "en").toLowerCase();
  if (nav.startsWith("pt")) return "pt-BR";
  const base = nav.split("-")[0];
  if (STRINGS[base]) return base;
  return "en";
}

export function setLanguage(code) {
  _lang = STRINGS[code] ? code : "en";
}

export function getLanguage() {
  return _lang;
}

export function t() {
  return STRINGS[_lang] || STRINGS.en;
}

// Resolve a dotted key like "ui.theme.dark" with {var} interpolation.
export function tr(key, vars = {}) {
  const parts = String(key).split(".");
  let val = STRINGS[_lang];
  for (const p of parts) val = val?.[p];
  if (val == null) {
    // Fallback to en
    val = STRINGS.en;
    for (const p of parts) val = val?.[p];
  }
  if (typeof val !== "string") return key;
  return val.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? String(vars[k]) : `{${k}}`));
}

// Apply data-i18n="key" attributes across the DOM
export function applyI18n(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const txt = tr(key);
    if (txt && txt !== key) el.textContent = txt;
  });
  root.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    const txt = tr(key);
    if (txt && txt !== key) el.setAttribute("title", txt);
  });
  root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    const txt = tr(key);
    if (txt && txt !== key) el.setAttribute("placeholder", txt);
  });
}
