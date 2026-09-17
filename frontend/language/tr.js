// # 📄 Dosya Yolu: pixeltone/frontend/language/tr.js
// # 📌 Amac: PixelTone frontend Turkce runtime etiketlerini merkezi tutmak
// # 📌 Language - JavaScript
// # Version: 0.3.0
// # Aciklama: Capture, proje, palet ve aktarim mesajlarini merkezi tutar
//
// Bagimli Oldugu Katman: Language

export const TR_LABELS = Object.freeze({
  status: Object.freeze({
    ready: "Hazir.",
    converted: "Renk donusturuldu.",
    convertFailed: "Renk donusturulemedi.",
    capturePreparing: "PixelTone kucultulecek. Cursoru hedef renge tasiyin.",
    captureFailed: "Ekran rengi yakalanamadi.",
    captureCompleted: "Ekran rengi yakalandi.",
    paletteNeedsColor: "Once bir renk donusturun.",
    paletteSaved: "Palet kaydedildi.",
    paletteSaveFailed: "Palet kaydedilemedi.",
    projectChanged: "Proje degistirildi.",
    exportCompleted: "Palet dosyasi olusturuldu.",
    exportFailed: "Palet disari aktarilamadi.",
    importCompleted: "YAML paleti iceri aktarildi.",
    importFailed: "YAML paleti iceri aktarilamadi.",
  }),
  empty: Object.freeze({
    history: "Henuz renk gecmisi yok.",
    palettes: "Bu projede kayitli palet yok.",
    magnifier: "Henuz ekran rengi yakalanmadi.",
  }),
  output: Object.freeze({
    hex: "HEX",
    rgb: "RGB",
    hsl: "HSL",
    hsv: "HSV",
    cmyk: "CMYK",
  }),
  palette: Object.freeze({
    projectPrefix: "Proje",
    colorCountSuffix: "renk",
  }),
  capture: Object.freeze({
    platformPrefix: "Platform",
    positionPrefix: "Cursor",
  }),
});
