# 📄 Dosya Yolu: pixeltone/README.md
# 📌 Amac: PixelTone baslangic paketinin genel aciklamasi
# 📌 Docs - Markdown
# Version: 0.1.0
# Aciklama: Tauri + Rust + HTML UI tabanli platform bagimsiz renk secici uygulama girisi

Bagimli Oldugu Katman: View

# PixelTone v0.1.0 Starter

PixelTone, ColorPic alternatifi olarak tasarlanan platform bagimsiz renk secici ve palet yonetim uygulamasidir.

Bu paket bir baslangic iskeletidir. Amac, mimariyi temiz kurmak ve ilk calisir UI + Rust komut koprusunu hazirlamaktir.

## Hedef Platformlar

- Windows
- Linux
- macOS

## Teknoloji

- Tauri v2
- Rust core
- HTML/CSS/JavaScript UI
- Local JSON palette storage

## Ilk Ozellikler

- HEX renk girisi
- RGB, HSL, HSV, CMYK donusumu
- Palet kaydi icin Rust komut iskeleti
- Lokal browser gecmisi
- Platform capture adapter icin hazir Tool katmani
- Acik tema odakli arayuz

## Kurulum

```bash
npm install
npm run tauri dev
```

## Build

```bash
npm run tauri build
```

## Not

Ekrandan anlik piksel yakalama islevi v0.1.0 paketinde adaptor olarak hazirlandi, fakat OS bazli tam implementasyon henuz eklenmedi. Bu ozellik v0.2.0 icin planlandi.
