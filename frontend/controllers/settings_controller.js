// # 📄 Dosya Yolu: pixeltone/frontend/controllers/settings_controller.js
// # 📌 Amac: Ayarlar ekranindaki kullanici olaylarini SettingsService katmanina aktarmak
// # 📌 Controller - JavaScript
// # Version: 1.0.0
// # Aciklama: Ayar yukleme/kaydetme ve surum kontrol olaylarini Service sonucuyla View katmanina iletir
//
// Bagimli Oldugu Katman: Controller

import { TR_LABELS } from "../language/tr.js";
import { settingsService } from "../services/settings_service.js";
import { settingsView } from "../views/settings_view.js";

function errorMessage(error, fallback) {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return error?.message || fallback;
}

async function saveSettings() {
  try {
    const settings = await settingsService.save(settingsView.getSettings());
    settingsView.renderSettings(settings);
    settingsView.setStatus(TR_LABELS.status.settingsSaved);
  } catch (error) {
    settingsView.renderSettings(settingsService.getCurrent());
    settingsView.setStatus(
      errorMessage(error, TR_LABELS.status.settingsSaveFailed),
    );
  }
}

async function checkUpdates() {
  settingsView.setStatus(TR_LABELS.status.updateCheckRunning);
  const result = await settingsService.checkForUpdates();
  settingsView.renderVersionStatus(result);
  settingsView.setStatus(TR_LABELS.status.updateCheckCompleted);
}

async function boot() {
  settingsView.initialize();
  settingsView.bindSave(() => void saveSettings());
  settingsView.bindCheckUpdates(() => void checkUpdates());

  try {
    const state = await settingsService.initialize();
    settingsView.renderSettings(state.settings);
    settingsView.renderVersionStatus(state.versionCheck);
    settingsView.setStatus(TR_LABELS.status.settingsLoaded);
  } catch (error) {
    settingsView.setStatus(
      errorMessage(error, TR_LABELS.status.settingsLoadFailed),
    );
  }
}

void boot();
