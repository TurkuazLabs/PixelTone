// # 📄 Dosya Yolu: pixeltone/frontend/config/app_config.js
// # 📌 Amac: PixelTone frontend sabitlerini merkezi tutmak
// # 📌 Config - JavaScript
// # Version: 0.4.0
// # Aciklama: Storage, Tauri komutlari, Palette Studio, live picker, Tailwind ve capture ayarlarini merkezi tutar
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
    getPalette: "get_palette",
    updatePalette: "update_palette",
    deletePalette: "delete_palette",
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
  errors: Object.freeze({
    invalidHex: "Gecerli 6 haneli HEX renk girin.",
    pickerWindowMissing: "Picker overlay penceresi bulunamadi.",
    pickerMonitorMissing: "Cursorun bulundugu monitor bulunamadi.",
  }),
  historyMove: Object.freeze({
    up: -1,
    down: 1,
  }),
  picker: Object.freeze({
    windowLabel: "picker",
    mainWindowLabel: "main",
    shortcut: "CommandOrControl+Shift+P",
    shortcutPressedState: "Pressed",
    activationEvent: "pixeltone://picker-open",
    selectionEvent: "pixeltone://picker-selected",
    visibleDocumentState: "visible",
    sampleIntervalMs: 90,
    cardOffsetPx: 28,
    cardMarginPx: 16,
    primaryPointerButton: 0,
    copyFormats: Object.freeze({
      hex: "hex",
      rgb: "rgb",
    }),
    rgbFormat: Object.freeze({
      prefix: "rgb(",
      separator: ", ",
      suffix: ")",
    }),
    defaultCopyFormat: "hex",
    keys: Object.freeze({
      cancel: "Escape",
      hex: "KeyH",
      rgb: "KeyR",
    }),
  }),
  tailwind: Object.freeze({
    matchCount: 5,
    excludedNames: Object.freeze(["inherit", "current", "transparent"]),
  }),
  limits: Object.freeze({
    maxHistoryItems: 12,
  }),
  capture: Object.freeze({
    delayMs: 1200,
  }),
});
