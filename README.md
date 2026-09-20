# 📄 Dosya Yolu: pixeltone/README.md
# 📌 Amac: PixelTone projesinin genel aciklamasini ve calisma durumunu tanimlamak
# 📌 Docs - Markdown
# Version: 0.4.0
# Aciklama: Tauri + Rust + HTML UI tabanli canli picker, renk yakalama, Tailwind eslestirme ve Palette Studio uygulama girisi

Bagimli Oldugu Katman: View

# PixelTone v0.4.0

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
- Tauri Global Shortcut plugin
- Tauri Clipboard Manager plugin
- Local JSON proje/palet storage
- YAML palet aktarimi
- Tailwind CSS 4.3.3 resmi renk paleti
- OKLab tabanli renk yakinlik hesabi

## v0.4.0 Picker Experience

- `CommandOrControl+Shift+P` global kisayolu
- Ana penceredeki Canli Picker butonu
- Cursorun bulundugu monitoru kaplayan seffaf picker overlay
- Canli 9x9 cursor buyuteci
- Cursor takipli renk bilgi karti
- H tusuyla HEX kopyalama modu
- R tusuyla RGB kopyalama modu
- Sol tikla rengi panoya kopyalama
- Esc ile picker iptali
- Secilen rengin ana pencere, gecmis, buyutec ve Tailwind eslesmesine aktarilmasi
- Coklu monitor gecisinde picker penceresinin yeni monitore tasinmasi
- Gizli picker penceresinde gereksiz capture dongusunun engellenmesi
- Wayland portal/overlay fallback stratejisi

## v0.3.0 Palette Studio

- Proje bazli palet yonetimi
- Paletlerin `projects/<proje>/palettes/` mantigiyla ayrilmasi
- v0.2.x paletleri icin `Genel` proje legacy fallback destegi
- Palet yukleme, duzenleme, yeniden adlandirma ve silme
- Palet renklerini adlandirma ve yukari/asagi siralama
- YAML palet import ve export
- CSS custom property export
- Import ve edit sirasinda renklerin Rust ColorService ile yeniden dogrulanmasi
- Resmi `tailwindcss/colors` kaynagindan Tailwind renk paleti okuma
- Secili HEX renge OKLab uzayinda en yakin 5 Tailwind rengini hesaplama

## Mimari

PixelTone katman akisi:

`Controller -> Service -> Repo/Model -> Tool -> View -> Language`

Controller sadece arayuz veya Tauri istegini alir ve Service katmanina aktarir. Is kurallari Service katmaninda, storage Repository katmaninda, dis format/platform adaptorleri Tool katmaninda tutulur.

## Live Picker Akisi

Global kisayol veya Canli Picker butonu PickerService katmanini cagirir. Service picker Tool ile seffaf pencereyi cursorun bulundugu monitore tasir ve aktivasyon eventini gonderir. Picker Controller yalnizca input olaylarini Service katmanina aktarir.

Canli ornekleme mevcut CaptureService uzerinden yapilir. Secim tamamlandiginda PickerService HEX veya RGB metnini Clipboard Tool ile sistem panosuna yazar ve pencere eventiyle ana UI tarafina aktarir.

Picker penceresi gizliyken canli capture dongusu calismaz.

## Palette Studio Akisi

Paletler proje adi ile kaydedilir. Kullanici calisma listesindeki her renge ad verebilir ve renklerin sirasini degistirebilir. Kayitli palet `get_palette` ile yuklenir; duzenleme/yeniden adlandirma `update_palette`, silme ise `delete_palette` komutuyla Service ve Repository katmanlarindan gecerek yapilir.

## Capture Akisi

`Ekrandan Renk Al` butonuna basildiginda PixelTone gecici olarak kuculur. Kisa gecikme sirasinda cursor hedef renge tasinir. Rust CaptureService cursorun bulundugu monitoru yakalar, merkez pikseli okur ve 9x9 buyutec verisini UI tarafina dondurur.

## Platform Notlari

Windows ana test platformudur. Windows resource ikonu build sirasinda `src-tauri/icons/icon.png` kaynagindan uretilir.

Linux X11 ve global capture erisimi veren masaustu ortamlarinda canli picker mevcut capture akisini kullanir. Wayland compositorleri global cursor veya ekran yakalamayi kisitlayabilir. Bu durumda hedef fallback XDG Desktop Portal Screenshot arayuzundeki `PickColor` metodudur. Portal fallback stratejisi `docs/WAYLAND_PICKER.md` dosyasinda tanimlanmistir; portal adaptorunun kendisi v0.4.0 kapsaminda uygulanmis sayilmaz.

macOS ekran yakalama icin kullanicinin Screen Recording izni vermesi gerekebilir. Seffaf picker penceresi icin Tauri `macOSPrivateApi` etkinlestirilmistir; bu tercih Mac App Store dagitimiyla uyumlu degildir ve PixelTone masaustu installer dagitimini hedefler.

## Kurulum

```bash
npm install
npm run tauri dev
```

## Build

```bash
npm run tauri build
```

Detaylar `docs/BUILD.md`, `docs/INSTALL.md` ve `docs/WAYLAND_PICKER.md` dosyalarindadir.
