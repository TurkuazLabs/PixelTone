// # 📄 Dosya Yolu: pixeltone/frontend/language/tr.js
// # 📌 Amac: PixelTone frontend Turkce runtime etiketlerini merkezi tutmak
// # 📌 Language - JavaScript
// # Version: 0.4.0
// # Aciklama: Capture, Palette Studio, live picker, aktarim ve Tailwind mesajlarini merkezi tutar
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
    pickerReady: "Canli picker hazir.",
    pickerStarted: "Canli picker acildi.",
    pickerStartFailed: "Canli picker acilamadi.",
    pickerShortcutFailed: "Global picker kisayolu kaydedilemedi.",
    pickerSelected: "Picker rengi panoya kopyalandi.",
    pickerSampleFailed: "Canli picker rengi okunamadi.",
    pickerCopyFailed: "Secilen renk panoya kopyalanamadi.",
    paletteNeedsColor: "Once bir renk donusturun.",
    paletteSaved: "Palet kaydedildi.",
    paletteSaveFailed: "Palet kaydedilemedi.",
    paletteEditing: "Palet duzenleme icin yuklendi.",
    paletteEditFailed: "Palet duzenleme icin yuklenemedi.",
    paletteDeleted: "Palet silindi.",
    paletteDeleteFailed: "Palet silinemedi.",
    projectChanged: "Proje degistirildi.",
    exportCompleted: "Palet dosyasi olusturuldu.",
    exportFailed: "Palet disari aktarilamadi.",
    importCompleted: "YAML paleti iceri aktarildi.",
    importFailed: "YAML paleti iceri aktarilamadi.",
    tailwindMatched: "En yakin Tailwind renkleri hesaplandi.",
    tailwindMatchFailed: "Tailwind renkleri hesaplanamadi.",
  }),
  empty: Object.freeze({
    history: "Henuz renk gecmisi yok.",
    palettes: "Bu projede kayitli palet yok.",
    magnifier: "Henuz ekran rengi yakalanmadi.",
    tailwind: "Renk donusturuldugunda Tailwind eslesmeleri burada gorunur.",
  }),
  output: Object.freeze({
    hex: "HEX",
    rgb: "RGB",
    hsl: "HSL",
    hsv: "HSV",
    cmyk: "CMYK",
  }),
  history: Object.freeze({
    namePlaceholder: "Renk adi",
    moveUp: "Yukari",
    moveDown: "Asagi",
  }),
  palette: Object.freeze({
    projectPrefix: "Proje",
    colorCountSuffix: "renk",
    editAction: "Duzenle",
    deleteAction: "Sil",
    deleteConfirm: "Bu paleti silmek istediginizden emin misiniz?",
  }),
  picker: Object.freeze({
    launchAction: "Canli Picker",
    shortcutPrefix: "Kisayol",
    instruction: "H: HEX | R: RGB | Sol tik: Kopyala | Esc: Iptal",
    copyModeHex: "Kopyalama: HEX",
    copyModeRgb: "Kopyalama: RGB",
  }),
  tailwind: Object.freeze({
    title: "Tailwind Yakin Renkler",
    distancePrefix: "OKLab mesafe",
  }),
  capture: Object.freeze({
    platformPrefix: "Platform",
    positionPrefix: "Cursor",
  }),
});
