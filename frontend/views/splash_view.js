// # 📄 Dosya Yolu: pixeltone/frontend/views/splash_view.js
// # 📌 Amac: PixelTone splash ekraninin DOM ciktilarini yonetmek
// # 📌 View - JavaScript
// # Version: 1.1.0
// # Aciklama: Uygulama adi, surum ve acilis durumunu splash ekranina yazar
//
// Bagimli Oldugu Katman: View

const dom = Object.freeze({
  appName: document.getElementById("splash-app-name"),
  status: document.getElementById("splash-status"),
  version: document.getElementById("splash-version"),
});

export const splashView = Object.freeze({
  initialize(state) {
    dom.appName.textContent = state.appName;
    dom.version.textContent = "v" + state.version;
    dom.status.textContent = state.status;
  },

  setStatus(message) {
    dom.status.textContent = message;
  },
});
