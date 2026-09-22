// # 📄 Dosya Yolu: pixeltone/frontend/services/version_service.js
// # 📌 Amac: PixelTone imzali updater komutunu frontend Settings akisina uyarlamak
// # 📌 Service - JavaScript
// # Version: 1.0.0
// # Aciklama: Rust UpdateService sonucunu UI'nin surum durum modeline cevirir; update varsa imzali paketi kurar
//
// Bagimli Oldugu Katman: Service

import { APP_CONFIG } from "../config/app_config.js";
import { tauriBridge } from "../tools/tauri_bridge.js";

export const versionService = Object.freeze({
  async checkLatest() {
    try {
      const result = await tauriBridge.invokeCommand(
        APP_CONFIG.commands.checkAndInstallUpdate,
      );

      return {
        available: Boolean(result.configured),
        currentVersion: result.current_version || "",
        latestVersion: result.latest_version || "",
        updateAvailable: Boolean(result.update_available),
        installed: Boolean(result.installed),
        message: result.message || "",
      };
    } catch (error) {
      return {
        available: false,
        currentVersion: "",
        latestVersion: "",
        updateAvailable: false,
        installed: false,
        message: "",
        error: error?.message || String(error),
      };
    }
  },
});
