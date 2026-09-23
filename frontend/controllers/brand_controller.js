// # 📄 Dosya Yolu: pixeltone/frontend/controllers/brand_controller.js
// # 📌 Amac: Ana arayuz TurkuazLabs marka baslangic istegini BrandService katmanina aktarmak
// # 📌 Controller - JavaScript
// # Version: 1.2.0
// # Aciklama: Marka footer baslangicini is kurali uygulamadan Service katmanina yonlendirir
//
// Bagimli Oldugu Katman: Controller

import { brandService } from "../services/brand_service.js";
import { preferenceService } from "../services/preference_service.js";

async function boot() {
  await preferenceService.initialize();
  brandService.initialize();
}

void boot();
