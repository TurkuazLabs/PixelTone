// # 📄 Dosya Yolu: pixeltone/frontend/services/preference_service.js
// # 📌 Amac: Tema ve dil tercihlerini backend ayarlarindan yukleyip runtime'a uygulamak
// # 📌 Service - JavaScript
// # Version: 1.2.0
// # Aciklama: get_settings komutundan theme/language degerlerini alir; hata halinde system varsayilanlarini uygular
//
// Bagimli Oldugu Katman: Service

import { APP_CONFIG } from "../config/app_config.js";
import { tauriBridge } from "../tools/tauri_bridge.js";
import { languageService } from "./language_service.js";
import { themeService } from "./theme_service.js";

let current = null;
let initializePromise = null;

function fallback() {
  return {
    theme: APP_CONFIG.defaults.settings.theme,
    language: APP_CONFIG.defaults.settings.language,
  };
}

function normalize(settings) {
  return {
    theme: themeService.normalize(settings?.theme),
    language: languageService.normalize(settings?.language),
  };
}

function apply(settings) {
  const normalized = normalize(settings || fallback());
  themeService.apply(normalized.theme);
  languageService.apply(normalized.language);
  current = normalized;
  return normalized;
}

async function load() {
  try {
    const settings = await tauriBridge.invokeCommand(APP_CONFIG.commands.getSettings);
    return apply(settings);
  } catch (_error) {
    return apply(fallback());
  }
}

export const preferenceService = Object.freeze({
  initialize() {
    if (!initializePromise) {
      initializePromise = load();
    }

    return initializePromise;
  },

  apply,

  getCurrent() {
    return current || fallback();
  },
});
