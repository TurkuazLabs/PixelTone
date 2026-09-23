// # 📄 Dosya Yolu: pixeltone/frontend/services/theme_service.js
// # 📌 Amac: PixelTone tema tercihini system/light/dark olarak uygulamak
// # 📌 Service - JavaScript
// # Version: 1.2.0
// # Aciklama: Sistem renk semasini cozer, document temasini uygular ve system modunda OS degisimlerini takip eder
//
// Bagimli Oldugu Katman: Service

import { APP_CONFIG } from "../config/app_config.js";

let preference = APP_CONFIG.defaults.settings.theme;
let mediaQuery = null;
let mediaHandler = null;

function normalize(value) {
  if (value === APP_CONFIG.themes.light || value === APP_CONFIG.themes.dark) {
    return value;
  }

  return APP_CONFIG.themes.system;
}

function resolveSystemTheme() {
  return globalThis.matchMedia?.("(prefers-color-scheme: dark)")?.matches
    ? APP_CONFIG.themes.dark
    : APP_CONFIG.themes.light;
}

function resolve(value) {
  const normalized = normalize(value);
  return normalized === APP_CONFIG.themes.system
    ? resolveSystemTheme()
    : normalized;
}

function detachSystemListener() {
  if (mediaQuery && mediaHandler) {
    mediaQuery.removeEventListener?.("change", mediaHandler);
  }

  mediaQuery = null;
  mediaHandler = null;
}

function applyResolvedTheme() {
  const resolved = resolve(preference);
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themePreference = preference;
  return resolved;
}

function attachSystemListener() {
  if (preference !== APP_CONFIG.themes.system || !globalThis.matchMedia) {
    return;
  }

  mediaQuery = globalThis.matchMedia("(prefers-color-scheme: dark)");
  mediaHandler = () => {
    applyResolvedTheme();
  };
  mediaQuery.addEventListener?.("change", mediaHandler);
}

export const themeService = Object.freeze({
  apply(value) {
    detachSystemListener();
    preference = normalize(value);
    const resolved = applyResolvedTheme();
    attachSystemListener();
    return resolved;
  },

  getPreference() {
    return preference;
  },

  getResolvedTheme() {
    return resolve(preference);
  },

  normalize,
});
