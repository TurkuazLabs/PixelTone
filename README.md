# 📄 Dosya Yolu: pixeltone/README.md
# 📌 Amac: PixelTone projesinin genel aciklamasini ve calisma durumunu tanimlamak
# 📌 Docs - Markdown
# Version: 0.3.0
# Aciklama: Tauri + Rust + HTML UI tabanli renk yakalama, Tailwind eslestirme ve Palette Studio uygulama girisi

Bagimli Oldugu Katman: View

# PixelTone v0.3.0

PixelTone, ColorPic alternatifi olarak gelistirilen platform bagimsiz renk secici, renk analiz ve palet yonetim uygulamasidir.

## Hedef Platformlar

- Windows
- Linux
- macOS

## Teknoloji

- Tauri v2
- Rust core
- HTML/CSS/JavaScript UI
- xcap ekran yakalama adaptoru
- Local JSON proje/palet storage
- YAML palet aktarimi
- Tailwind CSS 4.3.3 resmi renk paleti
- OKLab tabanli renk yakinlik hesabi

## v0.3.0 Ozellikleri

- v0.2.0 ekran yakalama ve 9x9 buyutec ozelliklerinin korunmasi
- Proje bazli palet yonetimi
- Paletlerin `projects/<proje>/palettes/` mantigiyla ayrilmasi
- v0.2.x paletleri icin `Genel` proje legacy fallback destegi
- YAML palet import ve export
- CSS custom property export
- Import edilen renklerin Rust ColorService ile yeniden dogrulanmasi
- Resmi `tailwindcss/colors` kaynagindan Tailwind renk paleti okuma
- Secili HEX renge OKLab uzayinda en yakin 5 Tailwind rengini hesaplama
- Tailwind renk adi, OKLCH degeri ve renk mesafesini arayuzde gosterme
- Windows build sirasinda PNG kaynaktan standart coklu boyutlu ICO uretimi
- Windows, Linux ve macOS icin ortak CI dogrulamasi

## Mimari

PixelTone katman akisi:

`Controller -> Service -> Repo/Model -> Tool -> View -> Language`

Controller sadece arayuz veya Tauri istegini alir ve Service katmanina aktarir. Is kurallari Service katmaninda, storage Repository katmaninda, dis format/platform adaptorleri Tool katmaninda tutulur.

## Tailwind Yakin Renk Akisi

Renk donusturuldugunda frontend TailwindColorService HEX degerini OKLab koordinatlarina cevirir. TailwindPaletteTool resmi `tailwindcss/colors` kaynagini duzlestirir ve OKLCH renkleri OKLab koordinatlarina donusturur. Service iki renk arasindaki OKLab mesafesini hesaplar, sonuclari siralar ve en yakin 5 rengi View katmanina verir.

## Palette Studio Akisi

Paletler proje adi ile kaydedilir. YAML import edilen palet once format Tool tarafinda parse edilir, ardindan PaletteService her HEX degerini ColorService uzerinden dogrular ve Repository ile local storage alanina yazar. YAML ve CSS export da ayni hazirlanmis palet modelini kullanir.

## Capture Akisi

`Ekrandan Renk Al` butonuna basildiginda PixelTone gecici olarak kuculur. Kisa gecikme sirasinda cursor hedef renge tasinir. Rust capture service cursorun bulundugu monitoru yakalar, merkez pikseli okur ve 9x9 buyutec verisini UI tarafina dondurur.

## Platform Notlari

Windows ana test platformudur. Windows resource ikonu build sirasinda `src-tauri/icons/icon.png` kaynagindan uretilir.

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
