// # 📄 Dosya Yolu: pixeltone/frontend/config/app_config.js
// # 📌 Amac: PixelTone frontend sabitlerini merkezi tutmak
// # 📌 Config - JavaScript
// # Version: 0.3.0
// # Aciklama: Storage, Tauri komutlari, export formatlari ve capture ayarlarini merkezi tutar
//
// Bagimli Oldugu Katman: Config

export const APP_CONFIG = Object.freeze({
  appName: "PixelTone",
  defaults: Object.freeze({
    projectName: "Genel",
  }),
  storageKeys: Object.freeze({
    history: "pixeltone.history.v0.1.0",
    projectName: "pixeltone.project.v0.3.0",
  }),
  commands: Object.freeze({
    convertHexColor: "convert_hex_color",
    captureScreenColor: "capture_screen_color",
    savePalette: "save_palette",
    listPalettes: "list_palettes",
    exportPalette: "export_palette",
    importPalette: "import_palette",
  }),
  exportFormats: Object.freeze({
    yaml: "yaml",
    css: "css",
  }),
  fileTypes: Object.freeze({
    yamlAccept: ".yml,.yaml,text/yaml,application/yaml",
  }),
  limits: Object.freeze({
    maxHistoryItems: 12,
  }),
  capture: Object.freeze({
    delayMs: 1200,
  }),
});
