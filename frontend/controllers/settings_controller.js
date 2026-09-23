// # 📄 Dosya Yolu: pixeltone/frontend/controllers/settings_controller.js
// # 📌 Amac: Ayarlar sekmesindeki kullanici olaylarini SettingsService katmanina aktarmak
// # 📌 Controller - JavaScript
// # Version: 1.2.2
// # Aciklama: Tema/dil secimini aninda kalici uygular; kaydedilmemis masaustu alanlarini preference render sirasinda korur
//
// Bagimli Oldugu Katman: Controller

import { languageService } from "../services/language_service.js";
import { preferenceService } from "../services/preference_service.js";
import { settingsService } from "../services/settings_service.js";
import { settingsView } from "../views/settings_view.js";

function labels() {
  return languageService.getLabels();
}

function errorMessage(error, fallback) {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return error?.message || fallback;
}

function renderRuntimeStatus(runtime, successMessage) {
  if (runtime?.shortcutRegistered === false) {
    settingsView.setStatus(labels().status.pickerShortcutUnavailable);
    return;
  }

  settingsView.setStatus(successMessage);
}

function renderSettingsState(state, successMessage) {
  const currentLabels = labels();
  settingsView.initialize(currentLabels);
  settingsView.renderSettings(state.settings, currentLabels);
  renderRuntimeStatus(state.runtime, successMessage);
}

function renderPreferenceState(state, pendingSettings, successMessage) {
  const currentLabels = labels();
  const renderedSettings = {
    ...pendingSettings,
    theme: state.settings.theme,
    language: state.settings.language,
  };

  settingsView.initialize(currentLabels);
  settingsView.renderSettings(renderedSettings, currentLabels);
  renderRuntimeStatus(state.runtime, successMessage);
}

async function savePreferences() {
  const pendingSettings = settingsView.getSettings();

  try {
    const state = await settingsService.savePreferences(
      settingsView.getPreferences(),
    );
    renderPreferenceState(
      state,
      pendingSettings,
      labels().status.settingsSaved,
    );
  } catch (error) {
    const currentLabels = labels();
    settingsView.renderSettings(pendingSettings, currentLabels);
    settingsView.setStatus(
      errorMessage(error, currentLabels.status.settingsSaveFailed),
    );
  }
}

async function saveSettings() {
  try {
    const state = await settingsService.save(settingsView.getSettings());
    renderSettingsState(state, labels().status.settingsSaved);
  } catch (error) {
    const currentLabels = labels();
    settingsView.renderSettings(settingsService.getCurrent(), currentLabels);
    settingsView.setStatus(
      errorMessage(error, currentLabels.status.settingsSaveFailed),
    );
  }
}

async function checkUpdates() {
  settingsView.setStatus(labels().status.updateCheckRunning);
  const result = await settingsService.checkForUpdates();
  const currentLabels = labels();
  settingsView.renderVersionStatus(result, currentLabels);
  settingsView.setStatus(currentLabels.status.updateCheckCompleted);
}

async function boot() {
  await preferenceService.initialize();
  const currentLabels = labels();

  settingsView.initialize(currentLabels);
  settingsView.bindPreferenceChange(() => void savePreferences());
  settingsView.bindSave(() => void saveSettings());
  settingsView.bindCheckUpdates(() => void checkUpdates());

  try {
    const state = await settingsService.initialize();
    renderSettingsState(state, labels().status.settingsLoaded);

    const versionCheck = await state.versionCheckPromise;
    settingsView.renderVersionStatus(versionCheck, labels());
  } catch (error) {
    settingsView.setStatus(
      errorMessage(error, labels().status.settingsLoadFailed),
    );
  }
}

void boot();
