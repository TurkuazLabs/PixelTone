// # 📄 Dosya Yolu: pixeltone/frontend/services/settings_service.js
// # 📌 Amac: Masaustu ayarlarini backend ile senkronlamak ve runtime servislere uygulamak
// # 📌 Service - JavaScript
// # Version: 1.0.0
// # Aciklama: Rust settings komutlarini, PickerService runtime ayarlarini ve opsiyonel baslangic surum kontrolunu koordine eder
//
// Bagimli Oldugu Katman: Service

import { APP_CONFIG } from "../config/app_config.js";
import { pickerService } from "./picker_service.js";
import { versionService } from "./version_service.js";
import { tauriBridge } from "../tools/tauri_bridge.js";

let currentSettings = null;

function fallbackSettings() {
  return {
    close_to_tray: APP_CONFIG.defaults.settings.closeToTray,
    check_updates_on_start: APP_CONFIG.defaults.settings.checkUpdatesOnStart,
    picker_shortcut: APP_CONFIG.defaults.settings.pickerShortcut,
    default_copy_format: APP_CONFIG.defaults.settings.defaultCopyFormat,
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
  };
}

async function applyRuntime(settings) {
  await pickerService.configure(settings);
  currentSettings = settings;
  return settings;
}

async function loadSettings() {
  let settings;

  try {
    settings = await tauriBridge.invokeCommand(APP_CONFIG.commands.getSettings);
  } catch (_error) {
    settings = fallbackSettings();
  }

  const normalized = normalizeSettings(settings);

  try {
    return await applyRuntime(normalized);
  } catch (_error) {
    const repaired = {
      ...normalized,
      picker_shortcut: APP_CONFIG.defaults.settings.pickerShortcut,
    };

    await applyRuntime(repaired);

    try {
      await tauriBridge.invokeCommand(APP_CONFIG.commands.saveSettings, {
        settings: repaired,
      });
    } catch (_saveError) {
      // Runtime duzeltmesi storage yazma hatasindan etkilenmemelidir.
    }

    return repaired;
  }
}

export const settingsService = Object.freeze({
  async initialize() {
    const settings = await loadSettings();
    const versionCheck = settings.check_updates_on_start
      ? await versionService.checkLatest()
      : null;

    return {
      settings,
      versionCheck,
    };
  },

  async load() {
    return loadSettings();
  },

  async save(settings) {
    const normalized = normalizeSettings(settings);
    const previous = currentSettings || fallbackSettings();

    await pickerService.configure(normalized);

    try {
      const saved = await tauriBridge.invokeCommand(
        APP_CONFIG.commands.saveSettings,
        { settings: normalized },
      );
      currentSettings = normalizeSettings(saved);
      return currentSettings;
    } catch (error) {
      await pickerService.configure(previous);
      currentSettings = previous;
      throw error;
    }
  },

  async checkForUpdates() {
    return versionService.checkLatest();
  },

  getCurrent() {
    return currentSettings || fallbackSettings();
  },
});
