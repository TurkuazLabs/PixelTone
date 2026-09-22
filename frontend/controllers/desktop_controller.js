// # 📄 Dosya Yolu: pixeltone/frontend/controllers/desktop_controller.js
// # 📌 Amac: Native desktop frontend baslangic istegini DesktopService katmanina aktarmak
// # 📌 Controller - JavaScript
// # Version: 1.0.0
// # Aciklama: Tray event dinleyicisini is kurali uygulamadan Service katmaninda baslatir
//
// Bagimli Oldugu Katman: Controller

import { desktopService } from "../services/desktop_service.js";

async function boot() {
  await desktopService.initialize();
}

void boot();
