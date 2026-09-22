// # 📄 Dosya Yolu: pixeltone/frontend/views/splash_view.js
// # 📌 Amac: PixelTone splash ekranindaki uygulama ve TurkuazLabs marka ciktilarini yonetmek
// # 📌 View - JavaScript
// # Version: 1.1.1
// # Aciklama: Logo, urun adi, TurkuazLabs tanitimi, site, surum ve acilis durumunu splash ekranina yazar
//
// Bagimli Oldugu Katman: View

const dom = Object.freeze({
  appName: document.getElementById("splash-app-name"),
  brandLogo: document.getElementById("splash-brand-logo"),
  productLabel: document.getElementById("splash-product-label"),
  subtitle: document.getElementById("splash-subtitle"),
  websiteLabel: document.getElementById("splash-website-label"),
  website: document.getElementById("splash-website"),
  status: document.getElementById("splash-status"),
  version: document.getElementById("splash-version"),
});

export const splashView = Object.freeze({
  initialize(state) {
    dom.appName.textContent = state.appName;
    dom.brandLogo.src = state.brandLogo;
    dom.brandLogo.alt = state.brandName;
    dom.productLabel.textContent = state.productLabel;
    dom.subtitle.textContent = state.subtitle;
    dom.websiteLabel.textContent = state.websiteLead;
    dom.website.textContent = state.website;
    dom.version.textContent = "v" + state.version;
    dom.status.textContent = state.status;
  },

  setStatus(message) {
    dom.status.textContent = message;
  },
});
