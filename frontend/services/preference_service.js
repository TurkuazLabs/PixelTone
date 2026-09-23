// # 📄 Dosya Yolu: pixeltone/frontend/services/preference_service.js
// # 📌 Amac: Tema ve dil tercihlerini backend ayarlarindan yukleyip runtime'a uygulamak ve degisimleri yayinlamak
// # 📌 Service - JavaScript
// # Version: 1.2.1
// # Aciklama: get_settings ile theme/language yukler, runtime'a uygular ve ana arayuz abonelerine tercih degisimini bildirir
//
// Bagimli Oldugu Katman: Service

import { APP_CONFIG } from "../config/app_config.js";
import { tauriBridge } from "../tools/tauri_bridge.js";
import { languageService } from "./language_service.js";
import { themeService } from "./theme_service.js";

let current = null;
let initializePromise = null;
const listeners = new Set();

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

function samePreferences(left, right) {
  return left?.theme === right?.theme && left?.language === right?.language;
}

function notify(previous, next) {
  if (samePreferences(previous, next)) {
    return;
  }

  listeners.forEach((handler) => {
    handler({
      previous,
      current: next,
      themeChanged: previous?.theme !== next.theme,
      languageChanged: previous?.language !== next.language,
    });
  });
}

function apply(settings) {
  const normalized = normalize(settings || fallback());
  const previous = current;

  themeService.apply(normalized.theme);
  languageService.apply(normalized.language);
  current = normalized;
  notify(previous, normalized);

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

  async refresh() {
    return load();
  },

  apply,

  subscribe(handler) {
    listeners.add(handler);
    return () => listeners.delete(handler);
  },

  getCurrent() {
    return current || fallback();
  },
});
