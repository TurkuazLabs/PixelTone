// # 📄 Dosya Yolu: pixeltone/frontend/language/tr.js
// # 📌 Amac: PixelTone frontend Turkce runtime etiketlerini merkezi tutmak
// # 📌 Language - JavaScript
// # Version: 0.2.0
// # Aciklama: Controller ve View katmaninda magic string kullanilmasini azaltir
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
  }),
  empty: Object.freeze({
    history: "Henuz renk gecmisi yok.",
    palettes: "Kayitli palet yok.",
    magnifier: "Henuz ekran rengi yakalanmadi.",
  }),
  output: Object.freeze({
    hex: "HEX",
    rgb: "RGB",
    hsl: "HSL",
    hsv: "HSV",
    cmyk: "CMYK",
  }),
  capture: Object.freeze({
    platformPrefix: "Platform",
    positionPrefix: "Cursor",
  }),
});
