// # 📄 Dosya Yolu: pixeltone/frontend/views/settings_view.js
// # 📌 Amac: PixelTone ayarlar sekmesinin DOM ciktilarini ve event baglantilarini yonetmek
// # 📌 View - JavaScript
// # Version: 1.2.0
// # Aciklama: Tema, dil, tray, updater, picker kisayolu ve kopyalama formati alanlarini yonetir
//
// Bagimli Oldugu Katman: View

import { APP_CONFIG } from "../config/app_config.js";

const dom = Object.freeze({
  title: document.getElementById("settings-title"),
  appearanceSection: document.getElementById("settings-appearance-section"),
  desktopSection: document.getElementById("settings-desktop-section"),
  themeLabel: document.getElementById("settings-theme-label"),
  theme: document.getElementById("settings-theme"),
  languageLabel: document.getElementById("settings-language-label"),
  language: document.getElementById("settings-language"),
  closeToTrayLabel: document.getElementById("settings-close-to-tray-label"),
  closeToTray: document.getElementById("settings-close-to-tray"),
  checkUpdatesLabel: document.getElementById("settings-check-updates-label"),
  checkUpdates: document.getElementById("settings-check-updates"),
  shortcutLabel: document.getElementById("settings-shortcut-label"),
  shortcut: document.getElementById("settings-shortcut"),
  copyFormatLabel: document.getElementById("settings-copy-format-label"),
  copyFormat: document.getElementById("settings-copy-format"),
  saveButton: document.getElementById("settings-save-button"),
  updateButton: document.getElementById("settings-update-button"),
  versionStatus: document.getElementById("settings-version-status"),
  status: document.getElementById("settings-status"),
  pickerShortcutHint: document.getElementById("picker-shortcut-hint"),
});

function appendOption(select, value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  select.appendChild(option);
}

export const settingsView = Object.freeze({
  initialize(labels) {
    dom.title.textContent = labels.settings.title;
    dom.appearanceSection.textContent = labels.settings.appearanceSection;
    dom.desktopSection.textContent = labels.settings.desktopSection;
    dom.themeLabel.textContent = labels.settings.theme;
    dom.languageLabel.textContent = labels.settings.language;
    dom.closeToTrayLabel.textContent = labels.settings.closeToTray;
    dom.checkUpdatesLabel.textContent = labels.settings.checkUpdatesOnStart;
    dom.shortcutLabel.textContent = labels.settings.pickerShortcut;
    dom.copyFormatLabel.textContent = labels.settings.defaultCopyFormat;
    dom.saveButton.textContent = labels.settings.saveAction;
    dom.updateButton.textContent = labels.settings.checkUpdateAction;

    dom.theme.innerHTML = "";
    appendOption(dom.theme, APP_CONFIG.themes.system, labels.settings.themeSystem);
    appendOption(dom.theme, APP_CONFIG.themes.light, labels.settings.themeLight);
    appendOption(dom.theme, APP_CONFIG.themes.dark, labels.settings.themeDark);

    dom.language.innerHTML = "";
    appendOption(dom.language, APP_CONFIG.languages.system, labels.settings.languageSystem);
    appendOption(dom.language, APP_CONFIG.languages.tr, labels.settings.languageTr);
    appendOption(dom.language, APP_CONFIG.languages.en, labels.settings.languageEn);

    dom.copyFormat.innerHTML = "";
    appendOption(dom.copyFormat, APP_CONFIG.picker.copyFormats.hex, labels.settings.copyHex);
    appendOption(dom.copyFormat, APP_CONFIG.picker.copyFormats.rgb, labels.settings.copyRgb);
  },

  bindSave(handler) {
    dom.saveButton.addEventListener("click", handler);
  },

  bindCheckUpdates(handler) {
    dom.updateButton.addEventListener("click", handler);
  },

  getSettings() {
    return {
      close_to_tray: dom.closeToTray.checked,
      check_updates_on_start: dom.checkUpdates.checked,
      picker_shortcut: dom.shortcut.value,
      default_copy_format: dom.copyFormat.value,
      theme: dom.theme.value,
      language: dom.language.value,
    };
  },

  renderSettings(settings, labels) {
    dom.closeToTray.checked = settings.close_to_tray;
    dom.checkUpdates.checked = settings.check_updates_on_start;
    dom.shortcut.value = settings.picker_shortcut;
    dom.copyFormat.value = settings.default_copy_format;
    dom.theme.value = settings.theme;
    dom.language.value = settings.language;
    dom.pickerShortcutHint.textContent =
      `${labels.picker.shortcutPrefix}: ${settings.picker_shortcut}`;
  },

  renderVersionStatus(result, labels) {
    if (!result) {
      dom.versionStatus.textContent = "";
      return;
    }

    if (!result.available) {
      dom.versionStatus.textContent = labels.settings.versionUnavailable;
      return;
    }

    if (result.updateAvailable) {
      dom.versionStatus.textContent =
        `${labels.settings.updateAvailablePrefix} ${result.latestVersion} (${labels.settings.currentVersionPrefix} ${result.currentVersion})`;
      return;
    }

    dom.versionStatus.textContent =
      `${labels.settings.upToDatePrefix} ${result.currentVersion}`;
  },

  setStatus(message) {
    dom.status.textContent = message;
  },

  reloadApp() {
    window.location.reload();
  },
});
