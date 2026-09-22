// # 📄 Dosya Yolu: pixeltone/frontend/controllers/brand_controller.js
// # 📌 Amac: Ana arayuz TurkuazLabs marka baslangic istegini BrandService katmanina aktarmak
// # 📌 Controller - JavaScript
// # Version: 1.1.1
// # Aciklama: Marka footer baslangicini is kurali uygulamadan Service katmanina yonlendirir
//
// Bagimli Oldugu Katman: Controller

import { brandService } from "../services/brand_service.js";

function boot() {
  brandService.initialize();
}

boot();
