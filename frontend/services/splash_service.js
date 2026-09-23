// # 📄 Dosya Yolu: pixeltone/frontend/services/splash_service.js
// # 📌 Amac: PixelTone splash acilis akisini, tema/dil ve TurkuazLabs marka verisini yonetmek
// # 📌 Service - JavaScript
// # Version: 1.2.0
// # Aciklama: Kayitli tercihleri splash'e uygular, lokalize marka metinlerini gosterir ve ana pencereye gecisi yonetir
//
// Bagimli Oldugu Katman: Service

import { APP_CONFIG } from "../config/app_config.js";
import { languageService } from "./language_service.js";
import { preferenceService } from "./preference_service.js";
import { tauriBridge } from "../tools/tauri_bridge.js";
import { splashView } from "../views/splash_view.js";

function wait(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

export const splashService = Object.freeze({
  async initialize() {
    await preferenceService.initialize();
    const labels = languageService.getLabels();

    splashView.initialize({
      appName: APP_CONFIG.appName,
      version: APP_CONFIG.version,
      brandName: APP_CONFIG.brand.name,
      brandLogo: APP_CONFIG.brand.logoPath,
      website: APP_CONFIG.brand.website,
      productLabel: labels.brand.productLabel,
      websiteLead: labels.brand.websiteLead,
      subtitle: labels.splash.subtitle,
      status: labels.splash.loading,
    });

    try {
      await wait(APP_CONFIG.splash.minimumVisibleMs);
      splashView.setStatus(labels.splash.ready);
      await tauriBridge.invokeCommand(APP_CONFIG.commands.completeStartup);
    } catch (error) {
      splashView.setStatus(labels.splash.failed);
      throw error;
    }
  },
});
