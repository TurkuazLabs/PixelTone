// # 📄 Dosya Yolu: pixeltone/frontend/views/navigation_view.js
// # 📌 Amac: PixelTone sol sidebar navigasyonunun DOM ciktilarini yonetmek
// # 📌 View - JavaScript
// # Version: 1.2.0
// # Aciklama: Ana Sayfa/Ayarlar dugmelerini etiketler, aktif durumu ve sayfa gorunurlugunu yonetir
//
// Bagimli Oldugu Katman: View

import { APP_CONFIG } from "../config/app_config.js";

const dom = Object.freeze({
  homeButton: document.getElementById("nav-home"),
  settingsButton: document.getElementById("nav-settings"),
  homePage: document.getElementById("page-home"),
  settingsPage: document.getElementById("page-settings"),
});

export const navigationView = Object.freeze({
  initialize(labels) {
    dom.homeButton.textContent = labels.navigation.home;
    dom.settingsButton.textContent = labels.navigation.settings;
  },

  bindSelect(handler) {
    dom.homeButton.addEventListener("click", () => handler(APP_CONFIG.navigation.pages.home));
    dom.settingsButton.addEventListener("click", () => handler(APP_CONFIG.navigation.pages.settings));
  },

  render(page) {
    const isHome = page === APP_CONFIG.navigation.pages.home;
    dom.homePage.hidden = !isHome;
    dom.settingsPage.hidden = isHome;
    dom.homeButton.classList.toggle("pt-nav-button-active", isHome);
    dom.settingsButton.classList.toggle("pt-nav-button-active", !isHome);
  },
});
