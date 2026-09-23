// # 📄 Dosya Yolu: pixeltone/frontend/controllers/navigation_controller.js
// # 📌 Amac: Sol sidebar kullanici olaylarini NavigationService katmanina aktarmak
// # 📌 Controller - JavaScript
// # Version: 1.2.0
// # Aciklama: Tercihler yuklendikten sonra lokalize sidebar'i baslatir ve sayfa gecislerini koordine eder
//
// Bagimli Oldugu Katman: Controller

import { languageService } from "../services/language_service.js";
import { navigationService } from "../services/navigation_service.js";
import { preferenceService } from "../services/preference_service.js";
import { navigationView } from "../views/navigation_view.js";

async function boot() {
  await preferenceService.initialize();
  navigationView.initialize(languageService.getLabels());
  navigationView.bindSelect((page) => {
    navigationView.render(navigationService.select(page));
  });
  navigationView.render(navigationService.getCurrent());
}

void boot();
