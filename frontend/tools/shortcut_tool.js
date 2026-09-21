// # 📄 Dosya Yolu: pixeltone/frontend/tools/shortcut_tool.js
// # 📌 Amac: Tauri global shortcut pluginini frontend servislerinden soyutlamak
// # 📌 Tool - JavaScript
// # Version: 1.0.0
// # Aciklama: Runtime picker kisayolunu kaydetme, degistirme ve kaldirma adaptorudur
//
// Bagimli Oldugu Katman: Tool

import {
  isRegistered,
  register,
  unregister,
} from "@tauri-apps/plugin-global-shortcut";

import { APP_CONFIG } from "../config/app_config.js";

export const shortcutTool = Object.freeze({
  async replace(shortcut, handler) {
    if (await isRegistered(shortcut)) {
      await unregister(shortcut);
    }

    await register(shortcut, (event) => {
      if (event.state === APP_CONFIG.picker.shortcutPressedState) {
        handler(event);
      }
    });
  },

  async unregister(shortcut) {
    if (await isRegistered(shortcut)) {
      await unregister(shortcut);
    }
  },
});
