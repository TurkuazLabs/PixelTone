# 📄 Dosya Yolu: pixeltone/README.md
# 📌 Amac: PixelTone projesinin genel aciklamasini ve calisma durumunu tanimlamak
# 📌 Docs - Markdown
# Version: 0.2.0
# Aciklama: Tauri + Rust + HTML UI tabanli platform bagimsiz renk secici uygulama girisi

Bagimli Oldugu Katman: View

# PixelTone v0.2.0

PixelTone, ColorPic alternatifi olarak gelistirilen platform bagimsiz renk secici ve palet yonetim uygulamasidir.

## Hedef Platformlar

- Windows
- Linux
- macOS

## Teknoloji

- Tauri v2
- Rust core
- HTML/CSS/JavaScript UI
- xcap ekran yakalama adaptoru
- Local JSON palette storage

## v0.2.0 Ozellikleri

- Cursor konumundaki ekran rengini yakalama
- Coklu monitor konumunu dikkate alma
- Windows ekran yakalama
- Linux X11 ekran yakalama
- Linux Wayland oturumunu ayirt etme
- macOS ekran yakalama altyapisi
- 9x9 piksel buyutec paneli
- HEX, RGB, HSL, HSV ve CMYK donusumu
- Renk gecmisi
- Local palet kaydi
- Controller -> Service -> Tool capture akisi

## Capture Akisi

`Ekrandan Renk Al` butonuna basildiginda PixelTone gecici olarak kuculur. Kisa gecikme sirasinda cursor hedef renge tasinir. Rust capture service cursorun bulundugu monitoru yakalar, merkez pikseli okur ve 9x9 buyutec verisini UI tarafina dondurur.

## Platform Notlari

Windows ana test platformudur.

Linux X11 global cursor konumu ve ekran yakalama icin desteklenir. Wayland ortaminda compositor guvenlik modeli global cursor konumunu veya ekran goruntusunu sinirlayabilir; bu nedenle bazi Wayland compositorlerinde ek portal/overlay adaptoru gerekecektir.

macOS tarafinda ekran yakalama icin kullanicinin Screen Recording izni vermesi gerekebilir.

## Kurulum

```bash
npm install
npm run tauri dev
```

## Build

```bash
npm run tauri build
```

Detaylar `docs/BUILD.md` ve `docs/INSTALL.md` dosyalarindadir.
