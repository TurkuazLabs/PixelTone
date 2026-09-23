// # 📄 Dosya Yolu: pixeltone/frontend/controllers/navigation_controller.js
// # 📌 Amac: Sol sidebar kullanici olaylarini NavigationService katmanina aktarmak
// # 📌 Controller - JavaScript
// # Version: 1.2.1
// # Aciklama: Lokalize sidebar'i baslatir, sayfa gecislerini koordine eder ve dil degisimini reload olmadan uygular
//
// Bagimli Oldugu Katman: Controller

import { languageService } from "../services/language_service.js";
import { navigationService } from "../services/navigation_service.js";
import { preferenceService } from "../services/preference_service.js";
import { navigationView } from "../views/navigation_view.js";

function renderLabels() {
  navigationView.initialize(languageService.getLabels());
}

async function boot() {
  await preferenceService.initialize();
  renderLabels();

  navigationView.bindSelect((page) => {
    navigationView.render(navigationService.select(page));
  });

  preferenceService.subscribe((change) => {
    if (change.languageChanged) {
      renderLabels();
    }
  });

  navigationView.render(navigationService.getCurrent());
}

void boot();
