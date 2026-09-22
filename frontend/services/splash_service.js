// # 📄 Dosya Yolu: pixeltone/frontend/services/splash_service.js
// # 📌 Amac: PixelTone splash acilis akisini ve ana pencereye gecisi yonetmek
// # 📌 Service - JavaScript
// # Version: 1.1.0
// # Aciklama: Minimum splash suresini uygular ve hazir oldugunda Rust startup komutu ile ana pencereyi acar
//
// Bagimli Oldugu Katman: Service

import { APP_CONFIG } from "../config/app_config.js";
import { TR_LABELS } from "../language/tr.js";
import { tauriBridge } from "../tools/tauri_bridge.js";
import { splashView } from "../views/splash_view.js";

function wait(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

export const splashService = Object.freeze({
  async initialize() {
    splashView.initialize({
      appName: APP_CONFIG.appName,
      version: APP_CONFIG.version,
      status: TR_LABELS.splash.loading,
    });

    try {
      await wait(APP_CONFIG.splash.minimumVisibleMs);
      splashView.setStatus(TR_LABELS.splash.ready);
      await tauriBridge.invokeCommand(APP_CONFIG.commands.completeStartup);
    } catch (error) {
      splashView.setStatus(TR_LABELS.splash.failed);
      throw error;
    }
  },
});
