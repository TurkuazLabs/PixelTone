// # 📄 Dosya Yolu: pixeltone/frontend/controllers/settings_controller.js
// # 📌 Amac: Ayarlar ekranindaki kullanici olaylarini SettingsService katmanina aktarmak
// # 📌 Controller - JavaScript
// # Version: 1.0.0
// # Aciklama: Ayar yukleme ve kaydetme olaylarini alir, Service sonucunu View katmanina iletir
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
    settingsView.setStatus(
      errorMessage(error, TR_LABELS.status.settingsSaveFailed),
    );
  }
}

async function boot() {
  settingsView.initialize();
  settingsView.bindSave(() => void saveSettings());

  try {
    const settings = await settingsService.load();
    settingsView.renderSettings(settings);
    settingsView.setStatus(TR_LABELS.status.settingsLoaded);
  } catch (error) {
    settingsView.setStatus(
      errorMessage(error, TR_LABELS.status.settingsLoadFailed),
    );
  }
}

void boot();
