// # 📄 Dosya Yolu: pixeltone/frontend/services/navigation_service.js
// # 📌 Amac: PixelTone ana sayfa ve ayarlar sayfasi navigasyon durumunu yonetmek
// # 📌 Service - JavaScript
// # Version: 1.2.0
// # Aciklama: Desteklenen sidebar sayfalarini normalize eder ve aktif sayfayi saklar
//
// Bagimli Oldugu Katman: Service

import { APP_CONFIG } from "../config/app_config.js";

let currentPage = APP_CONFIG.navigation.defaultPage;

function normalize(page) {
  return Object.values(APP_CONFIG.navigation.pages).includes(page)
    ? page
    : APP_CONFIG.navigation.defaultPage;
}

export const navigationService = Object.freeze({
  select(page) {
    currentPage = normalize(page);
    return currentPage;
  },

  getCurrent() {
    return currentPage;
  },
});
