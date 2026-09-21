// # 📄 Dosya Yolu: pixeltone/frontend/tools/shortcut_tool.js
// # 📌 Amac: Tauri global shortcut pluginini frontend servislerinden soyutlamak
// # 📌 Tool - JavaScript
// # Version: 1.0.0
// # Aciklama: Runtime picker kisayolunu kaydetme, durum sorgulama ve kaldirma adaptorudur
//
// Bagimli Oldugu Katman: Tool

import {
  isRegistered,
  register,
  unregister,
} from "@tauri-apps/plugin-global-shortcut";

import { APP_CONFIG } from "../config/app_config.js";

export const shortcutTool = Object.freeze({
  async register(shortcut, handler) {
    await register(shortcut, (event) => {
      if (event.state === APP_CONFIG.picker.shortcutPressedState) {
        handler(event);
      }
    });
  },

  async isRegistered(shortcut) {
    return isRegistered(shortcut);
  },

  async unregister(shortcut) {
    if (await isRegistered(shortcut)) {
      await unregister(shortcut);
    }
  },
});
