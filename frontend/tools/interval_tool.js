// # 📄 Dosya Yolu: pixeltone/frontend/tools/interval_tool.js
// # 📌 Amac: Tekrarlanan frontend zamanlayici islemlerini Service katmanindan soyutlamak
// # 📌 Tool - JavaScript
// # Version: 0.4.0
// # Aciklama: Live Picker ornekleme dongusu icin interval baslatma ve durdurma adaptorudur
//
// Bagimli Oldugu Katman: Tool

export const intervalTool = Object.freeze({
  start(handler, milliseconds) {
    return window.setInterval(handler, milliseconds);
  },

  stop(intervalId) {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
    }
  },
});
