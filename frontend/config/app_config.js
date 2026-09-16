// # 📄 Dosya Yolu: pixeltone/frontend/config/app_config.js
// # 📌 Amac: PixelTone frontend sabitlerini merkezi tutmak
// # 📌 Config - JavaScript
// # Version: 0.2.0
// # Aciklama: Storage, komut, limit ve capture ayarlarini magic string olmadan saglar
//
// Bagimli Oldugu Katman: Config

export const APP_CONFIG = Object.freeze({
  appName: "PixelTone",
  storageKeys: Object.freeze({
    history: "pixeltone.history.v0.1.0",
  }),
  commands: Object.freeze({
    convertHexColor: "convert_hex_color",
    captureScreenColor: "capture_screen_color",
    savePalette: "save_palette",
    listPalettes: "list_palettes",
  }),
  limits: Object.freeze({
    maxHistoryItems: 12,
  }),
  capture: Object.freeze({
    delayMs: 1200,
  }),
});
