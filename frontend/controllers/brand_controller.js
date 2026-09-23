// # 📄 Dosya Yolu: pixeltone/frontend/controllers/brand_controller.js
// # 📌 Amac: Ana arayuz TurkuazLabs marka baslangic ve dil degisim isteklerini BrandService katmanina aktarmak
// # 📌 Controller - JavaScript
// # Version: 1.2.1
// # Aciklama: Marka footerini tercih yuklemesinden sonra cizer ve dil degisiminde reload olmadan yeniler
//
// Bagimli Oldugu Katman: Controller

import { brandService } from "../services/brand_service.js";
import { preferenceService } from "../services/preference_service.js";

async function boot() {
  await preferenceService.initialize();
  brandService.initialize();

  preferenceService.subscribe((change) => {
    if (change.languageChanged) {
      brandService.initialize();
    }
  });
}

void boot();
