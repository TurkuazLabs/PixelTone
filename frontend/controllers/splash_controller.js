// # 📄 Dosya Yolu: pixeltone/frontend/controllers/splash_controller.js
// # 📌 Amac: Splash ekraninin acilis olayini SplashService katmanina aktarmak
// # 📌 Controller - JavaScript
// # Version: 1.1.0
// # Aciklama: Splash baslangicini is kurali uygulamadan Service katmanina yonlendirir
//
// Bagimli Oldugu Katman: Controller

import { splashService } from "../services/splash_service.js";

async function boot() {
  await splashService.initialize();
}

void boot();
