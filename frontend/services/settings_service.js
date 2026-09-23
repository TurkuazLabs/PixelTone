// # 📄 Dosya Yolu: pixeltone/frontend/services/settings_service.js
// # 📌 Amac: Masaustu ayarlarini backend ile senkronlamak ve runtime servislere uygulamak
// # 📌 Service - JavaScript
// # Version: 1.2.0
// # Aciklama: Picker, tema ve dil ayarlarini normalize eder; backend kaydi ile runtime uygulamasini transactional yonetir
//
// Bagimli Oldugu Katman: Service

import { APP_CONFIG } from "../config/app_config.js";
import { pickerService } from "./picker_service.js";
import { preferenceService } from "./preference_service.js";
import { versionService } from "./version_service.js";
import { tauriBridge } from "../tools/tauri_bridge.js";
import { languageService } from "./language_service.js";
import { themeService } from "./theme_service.js";

let currentSettings = null;
let currentRuntime = null;
let initializePromise = null;

function fallbackSettings() {
  return {
    close_to_tray: APP_CONFIG.defaults.settings.closeToTray,
    check_updates_on_start: APP_CONFIG.defaults.settings.checkUpdatesOnStart,
    picker_shortcut: APP_CONFIG.defaults.settings.pickerShortcut,
    default_copy_format: APP_CONFIG.defaults.settings.defaultCopyFormat,
    theme: APP_CONFIG.defaults.settings.theme,
    language: APP_CONFIG.defaults.settings.language,
  };
}

function normalizeSettings(settings) {
  const fallback = fallbackSettings();

  return {
    close_to_tray: Boolean(
      settings?.close_to_tray ?? fallback.close_to_tray,
    ),
    check_updates_on_start: Boolean(
      settings?.check_updates_on_start ?? fallback.check_updates_on_start,
    ),
    picker_shortcut:
      String(settings?.picker_shortcut || "").trim() ||
      fallback.picker_shortcut,
    default_copy_format:
      settings?.default_copy_format === APP_CONFIG.picker.copyFormats.rgb
        ? APP_CONFIG.picker.copyFormats.rgb
        : APP_CONFIG.picker.copyFormats.hex,
    theme: themeService.normalize(settings?.theme),
    language: languageService.normalize(settings?.language),
  };
}

async function applyRuntime(settings, options = {}) {
  preferenceService.apply(settings);
  const runtime = await pickerService.configure(settings, options);
  currentSettings = settings;
  currentRuntime = runtime;

  return {
    settings,
    runtime,
  };
}

async function loadSettings() {
  let settings;

  try {
    settings = await tauriBridge.invokeCommand(APP_CONFIG.commands.getSettings);
  } catch (_error) {
    settings = fallbackSettings();
  }

  return applyRuntime(
    normalizeSettings(settings),
    { allowShortcutFailure: true },
  );
}

async function restoreRuntime(previousSettings) {
  preferenceService.apply(previousSettings);
  const restoredRuntime = await pickerService.configure(
    previousSettings,
    { allowShortcutFailure: true },
  );
  currentSettings = previousSettings;
  currentRuntime = restoredRuntime;
}

export const settingsService = Object.freeze({
  initialize() {
    if (!initializePromise) {
      initializePromise = loadSettings().then((state) => {
        const versionCheckPromise = state.settings.check_updates_on_start
          ? versionService.checkLatest()
          : Promise.resolve(null);

        return {
          ...state,
          versionCheckPromise,
        };
      });
    }

    return initializePromise;
  },

  async load() {
    return loadSettings();
  },

  async save(settings) {
    const normalized = normalizeSettings(settings);
    const previousSettings = currentSettings || fallbackSettings();
    const languageChanged = previousSettings.language !== normalized.language;

    try {
      const runtime = await pickerService.configure(normalized);
      const saved = await tauriBridge.invokeCommand(
        APP_CONFIG.commands.saveSettings,
        { settings: normalized },
      );

      currentSettings = normalizeSettings(saved);
      preferenceService.apply(currentSettings);
      currentRuntime = runtime;

      return {
        settings: currentSettings,
        runtime: currentRuntime,
        languageChanged,
      };
    } catch (error) {
      await restoreRuntime(previousSettings);
      throw error;
    }
  },

  async checkForUpdates() {
    return versionService.checkLatest();
  },

  getCurrent() {
    return currentSettings || fallbackSettings();
  },

  getRuntime() {
    return currentRuntime;
  },
});
