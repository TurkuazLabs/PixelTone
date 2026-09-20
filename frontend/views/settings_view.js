// # 📄 Dosya Yolu: pixeltone/frontend/views/settings_view.js
// # 📌 Amac: PixelTone masaustu ayarlarinin DOM ciktilarini ve event baglantilarini yonetmek
// # 📌 View - JavaScript
// # Version: 1.0.0
// # Aciklama: Tray, surum kontrolu, picker kisayolu ve varsayilan kopyalama formati alanlarini yonetir
//
// Bagimli Oldugu Katman: View

import { APP_CONFIG } from "../config/app_config.js";
import { TR_LABELS } from "../language/tr.js";

const dom = Object.freeze({
  title: document.getElementById("settings-title"),
  closeToTrayLabel: document.getElementById("settings-close-to-tray-label"),
  closeToTray: document.getElementById("settings-close-to-tray"),
  checkUpdatesLabel: document.getElementById("settings-check-updates-label"),
  checkUpdates: document.getElementById("settings-check-updates"),
  shortcutLabel: document.getElementById("settings-shortcut-label"),
  shortcut: document.getElementById("settings-shortcut"),
  copyFormatLabel: document.getElementById("settings-copy-format-label"),
  copyFormat: document.getElementById("settings-copy-format"),
  saveButton: document.getElementById("settings-save-button"),
  status: document.getElementById("settings-status"),
});

export const settingsView = Object.freeze({
  initialize() {
    dom.title.textContent = TR_LABELS.settings.title;
    dom.closeToTrayLabel.textContent = TR_LABELS.settings.closeToTray;
    dom.checkUpdatesLabel.textContent = TR_LABELS.settings.checkUpdatesOnStart;
    dom.shortcutLabel.textContent = TR_LABELS.settings.pickerShortcut;
    dom.copyFormatLabel.textContent = TR_LABELS.settings.defaultCopyFormat;
    dom.saveButton.textContent = TR_LABELS.settings.saveAction;

    dom.copyFormat.innerHTML = "";

    const hexOption = document.createElement("option");
    hexOption.value = APP_CONFIG.picker.copyFormats.hex;
    hexOption.textContent = TR_LABELS.settings.copyHex;

    const rgbOption = document.createElement("option");
    rgbOption.value = APP_CONFIG.picker.copyFormats.rgb;
    rgbOption.textContent = TR_LABELS.settings.copyRgb;

    dom.copyFormat.append(hexOption, rgbOption);
  },

  bindSave(handler) {
    dom.saveButton.addEventListener("click", handler);
  },

  getSettings() {
    return {
      close_to_tray: dom.closeToTray.checked,
      check_updates_on_start: dom.checkUpdates.checked,
      picker_shortcut: dom.shortcut.value,
      default_copy_format: dom.copyFormat.value,
    };
  },

  renderSettings(settings) {
    dom.closeToTray.checked = settings.close_to_tray;
    dom.checkUpdates.checked = settings.check_updates_on_start;
    dom.shortcut.value = settings.picker_shortcut;
    dom.copyFormat.value = settings.default_copy_format;
  },

  setStatus(message) {
    dom.status.textContent = message;
  },
});
