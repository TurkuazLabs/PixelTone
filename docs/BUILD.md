# 📄 Dosya Yolu: pixeltone/docs/BUILD.md
# 📌 Amac: PixelTone build ve dagitim komutlarini aciklamak
# 📌 Docs - Markdown
# Version: 1.0.0
# Aciklama: Gelistirme, native capture bagimliliklari, tray ve platform installer build komutlarini tanimlar

Bagimli Oldugu Katman: View

# Build

## Development

```bash
npm install
npm run tauri dev
```

## Frontend Build

```bash
npm run build
```

Frontend-only calisma Tauri native capture, global shortcut, tray ve settings repository davranislarini test etmez.

## Production Build

```bash
npm run tauri build
```

## Platform Bundle Hedefleri

Windows:

```bash
npm run tauri build -- --bundles nsis,msi
```

Linux:

```bash
npm run tauri build -- --bundles appimage,deb,rpm
```

macOS:

```bash
npm run tauri build -- --bundles app,dmg
```

## Platform Icon Uretimi

Kaynak ikon:

`src-tauri/icons/icon.png`

Tum Tauri desktop ikonlarini yeniden uretmek icin:

```bash
npm run tauri icon src-tauri/icons/icon.png
```

Bu komut macOS icin `icon.icns`, Windows icin `icon.ico` ve Linux icin gereken PNG setini uretir.

## Linux Build Bagimliliklari

Ubuntu/Debian ornegi:

```bash
sudo apt-get install -y \
  build-essential \
  pkg-config \
  libclang-dev \
  libssl-dev \
  libgtk-3-dev \
  libwebkit2gtk-4.1-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  libxdo-dev \
  libxcb1-dev \
  libxrandr-dev \
  libdbus-1-dev \
  libpipewire-0.3-dev \
  libwayland-dev \
  libegl-dev \
  patchelf \
  xdg-utils
```

## Platform Testleri

- Windows: capture, coklu monitor, tray, global shortcut, NSIS ve MSI
- Linux X11: capture, cursor konumu, tray, AppImage/DEB/RPM
- Linux Wayland: compositor uyumlulugu ve portal fallback ihtiyaci
- macOS: Screen Recording izni, Retina olcekleme, tray, APP/DMG

Tauri'de `show_menu_on_left_click(false)` Linux tray backendinde desteklenmez. Bu nedenle Linux tray UX testi Windows/macOS davranisiyla birebir ayni kabul edilmemelidir.

## CI Notu

Normal CI `.github/workflows/ci.yml` ile Windows/Linux/macOS uzerinde frontend build, Rust format ve cargo check hedeflenir.

GitHub hosted runner tahsis edilmeden `runner_id: 0` ve bos step listesiyle biten run'lar uygulama build hatasi degildir; runner altyapisi calismamistir.
