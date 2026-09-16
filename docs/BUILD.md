# 📄 Dosya Yolu: pixeltone/docs/BUILD.md
# 📌 Amac: PixelTone build ve dagitim komutlarini aciklamak
# 📌 Docs - Markdown
# Version: 0.2.0
# Aciklama: Gelistirme, native capture bagimliliklari ve paketleme komutlari

Bagimli Oldugu Katman: View

# Build

## Development

```bash
npm install
npm run tauri dev
```

## Production Build

```bash
npm run tauri build
```

## Frontend Only Preview

```bash
npm run dev
```

Frontend only preview Tauri native capture komutlarini calistirmaz. Ekran rengi yakalama testi `npm run tauri dev` ile yapilmalidir.

## Linux Capture Build Bagimliliklari

xcap Linux buildi icin sistem paketleri gerekir.

Ubuntu/Debian ornegi:

```bash
sudo apt-get install pkg-config libclang-dev libxcb1-dev libxrandr-dev libdbus-1-dev libpipewire-0.3-dev libwayland-dev libegl-dev
```

Tauri icin ayrica dagitima uygun WebKitGTK gelistirme paketleri kurulmalidir.

## Platform Testleri

- Windows: capture + coklu monitor + pencere kucult/geri getir
- Linux X11: capture + cursor konumu
- Linux Wayland: compositor uyumlulugu ve portal ihtiyaci
- macOS: Screen Recording izni ve Retina olcekleme

## Not

v0.2.0 capture islemi her tiklamada cursorun bulundugu monitorun goruntusunu alir ve hedef pikseli Rust tarafinda ornekler. Canli surekli capture v0.4.0 kapsamindadir.
