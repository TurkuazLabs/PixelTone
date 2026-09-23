// # 📄 Dosya Yolu: pixeltone/frontend/services/brand_service.js
// # 📌 Amac: TurkuazLabs marka verisini ana arayuz View katmanina hazirlamak
// # 📌 Service - JavaScript
// # Version: 1.2.0
// # Aciklama: Config ve Language katmanlarindaki marka verisini footer cikti modeline cevirir
//
// Bagimli Oldugu Katman: Service

import { APP_CONFIG } from "../config/app_config.js";
import { languageService } from "./language_service.js";
import { brandView } from "../views/brand_view.js";

export const brandService = Object.freeze({
  initialize() {
    brandView.render({
      name: APP_CONFIG.brand.name,
      logo: APP_CONFIG.brand.logoPath,
      website: APP_CONFIG.brand.website,
      lead: languageService.getLabels().brand.footerLead,
    });
  },
});
