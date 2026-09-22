// # 📄 Dosya Yolu: pixeltone/frontend/services/splash_service.js
// # 📌 Amac: PixelTone splash acilis akisini, TurkuazLabs marka verisini ve ana pencereye gecisi yonetmek
// # 📌 Service - JavaScript
// # Version: 1.1.1
// # Aciklama: Marka verisini View katmanina aktarir, minimum splash suresini uygular ve hazir oldugunda ana pencereyi acar
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
      brandName: APP_CONFIG.brand.name,
      brandLogo: APP_CONFIG.brand.logoPath,
      website: APP_CONFIG.brand.website,
      productLabel: TR_LABELS.brand.productLabel,
      websiteLead: TR_LABELS.brand.websiteLead,
      subtitle: TR_LABELS.splash.subtitle,
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
