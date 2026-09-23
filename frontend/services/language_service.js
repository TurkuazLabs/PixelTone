// # 📄 Dosya Yolu: pixeltone/frontend/services/language_service.js
// # 📌 Amac: PixelTone aktif dil tercihini cozumlemek ve dogru Language paketini sunmak
// # 📌 Service - JavaScript
// # Version: 1.2.0
// # Aciklama: system/tr/en tercihini normalize eder, sistem dilini cozer ve runtime label paketini verir
//
// Bagimli Oldugu Katman: Service

import { APP_CONFIG } from "../config/app_config.js";
import { EN_LABELS } from "../language/en.js";
import { TR_LABELS } from "../language/tr.js";

let preference = APP_CONFIG.defaults.settings.language;
let resolvedLanguage = APP_CONFIG.languages.tr;

function normalize(value) {
  if (value === APP_CONFIG.languages.tr || value === APP_CONFIG.languages.en) {
    return value;
  }

  return APP_CONFIG.languages.system;
}

function resolveSystemLanguage() {
  const locale = String(globalThis.navigator?.language || "").toLowerCase();
  return locale.startsWith("tr")
    ? APP_CONFIG.languages.tr
    : APP_CONFIG.languages.en;
}

function resolve(value) {
  const normalized = normalize(value);
  return normalized === APP_CONFIG.languages.system
    ? resolveSystemLanguage()
    : normalized;
}

export const languageService = Object.freeze({
  apply(value) {
    preference = normalize(value);
    resolvedLanguage = resolve(preference);
    document.documentElement.lang = resolvedLanguage;
    return resolvedLanguage;
  },

  getLabels() {
    return resolvedLanguage === APP_CONFIG.languages.en ? EN_LABELS : TR_LABELS;
  },

  getPreference() {
    return preference;
  },

  getResolvedLanguage() {
    return resolvedLanguage;
  },

  normalize,
});
