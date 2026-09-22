# 📄 Dosya Yolu: pixeltone/docs/INSTALL.md
# 📌 Amac: PixelTone gelistirme ve masaustu kurulum gereksinimlerini anlatmak
# 📌 Docs - Markdown
# Version: 1.0.0
# Aciklama: Windows, Linux ve macOS gelistirme gereksinimleri ile v1.0 installer tiplerini tanimlar

Bagimli Oldugu Katman: View

# Kurulum

## Ortak Gelistirme Gereksinimleri

- Node.js LTS
- Rust stable
- npm

## Windows

Gelistirme icin:

- Microsoft C++ Build Tools
- Microsoft Edge WebView2 Runtime

Dagitim paketleri:

- NSIS Setup EXE
- MSI

## Linux

Gelistirme ve build icin WebKitGTK 4.1, GTK3, xcap ve tray icin gereken sistem kutuphaneleri gerekir.

Dagitim paketleri:

- AppImage
- DEB
- RPM

Wayland ortaminda global cursor/screen capture compositor tarafindan kisitlanabilir. Ayrinti icin `docs/WAYLAND_PICKER.md` kullanilir.

## macOS

Gelistirme icin:

- Xcode Command Line Tools
- Screen Recording izni

Dagitim paketleri:

- APP
- DMG

CI buildlerinde Apple sertifikasi yoksa ad-hoc signing kullanilir. Son kullaniciya genis dagitim icin Apple Developer ID imzasi ve notarization ayrica yapilmalidir.

## Gelistirme Komutlari

```bash
npm install
npm run tauri dev
```

## Local Production Build

```bash
npm run tauri build
```

Release otomasyonu icin `docs/RELEASE.md` dosyasina bakiniz.
