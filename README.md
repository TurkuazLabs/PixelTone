# 📄 Dosya Yolu: pixeltone/README.md
# 📌 Amac: PixelTone projesinin genel aciklamasini ve calisma durumunu tanimlamak
# 📌 Docs - Markdown
# Version: 1.0.0
# Aciklama: Tauri + Rust + HTML UI tabanli Stable Desktop renk secici, picker, palet ve dagitim uygulama girisi

Bagimli Oldugu Katman: View

# PixelTone v1.0.0

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
- Native Tauri system tray
- Local JSON proje/palet/settings storage
- YAML palet aktarimi
- Tailwind CSS 4.3.3 resmi renk paleti
- OKLab tabanli renk yakinlik hesabi
- GitHub Releases tabanli surum kontrolu ve release pipeline

## v1.0.0 Stable Desktop

- Sistem tepsisi ikonu
- Tray menusu: PixelTone'u Ac, Canli Picker, Cikis
- Kapatma dugmesinde tray'e gizleme ayari
- Tray gizleme kapaliysa gercek uygulama cikisi
- Degistirilebilir global picker kisayolu
- Varsayilan HEX veya RGB picker kopyalama tercihi
- Ayarlarin Rust SettingsService ve SettingsRepository ile local JSON saklanmasi
- Baslangicta otomatik veya manuel surum kontrolu
- Windows NSIS ve MSI release build
- Linux AppImage, DEB ve RPM release build
- macOS APP ve DMG release build
- Git tag veya manuel workflow ile GitHub Release olusturma

## Picker Experience

- Global picker kisayolu
- Ana penceredeki Canli Picker butonu
- Cursorun bulundugu monitoru kaplayan seffaf picker overlay
- Canli 9x9 cursor buyuteci
- Cursor takipli renk bilgi karti
- H tusuyla HEX, R tusuyla RGB kopyalama
- Sol tikla rengi panoya kopyalama
- Esc ile picker iptali
- Coklu monitor gecisinde picker penceresinin yeni monitore tasinmasi
- Gizli picker penceresinde capture dongusunun durdurulmasi
- Wayland portal/overlay fallback stratejisi

## Palette Studio

- Proje bazli palet yonetimi
- Palet yukleme, duzenleme, yeniden adlandirma ve silme
- Palet renklerini adlandirma ve yukari/asagi siralama
- YAML palet import ve export
- CSS custom property export
- Tailwind resmi renklerine OKLab yakinlik eslestirmesi

## Mimari

PixelTone katman akisi:

`Controller -> Service -> Repo/Model -> Tool -> View -> Language`

Controller yalniz request/event alir ve Service katmanina aktarir. Is kurallari Service katmaninda, storage Repository katmaninda, platform ve dis dunya entegrasyonlari Tool katmaninda tutulur.

## Settings Akisi

Frontend Settings Controller kullanici olaylarini SettingsService'e aktarir. SettingsService Rust `get_settings` ve `save_settings` komutlarini kullanir. Rust SettingsService dogrulamayi, SettingsRepository ise local `settings.json` storage islemini yapar.

Global shortcut veya varsayilan picker formati degistiginde PickerService runtime davranisini yeniden uygular. Kisayol kaydi basarisiz olursa yeni ayar kalici storage'a yazilmaz.

## Tray Akisi

Rust Desktop Controller lifecycle olaylarini DesktopService'e aktarir. DesktopService tray kurulumunu TrayTool ile yapar. Close-to-tray aciksa ana pencere yok edilmez, gizlenir. Kapaliysa uygulama sonlandirilir.

## Surum Kontrolu

Kurulu surum Tauri App API ile okunur. VersionService GitHub Releases latest endpointinden son release tagini alip semver olarak karsilastirir.

Repository private oldugu surece anonim GitHub Releases endpointi 404 donebilir. Bu durumda PixelTone hata vermeden "surum bilgisi kullanilamiyor" durumuna gecer. Gercek private-repo otomatik update icin ileride public update manifest servisi veya guvenli imzali updater endpointi gerekir.

## Release Paketleri

GitHub Actions `.github/workflows/release.yml` dosyasi su paketleri uretir:

- Windows: NSIS Setup EXE + MSI
- Linux: AppImage + DEB + RPM
- macOS: APP + DMG

Release akisi version tag push ile veya manuel workflow dispatch ile calistirilabilir. Detaylar `docs/RELEASE.md` dosyasindadir.

## Kurulum

```bash
npm install
npm run tauri dev
```

## Build

```bash
npm run tauri build
```

Detaylar `docs/BUILD.md`, `docs/INSTALL.md`, `docs/RELEASE.md` ve `docs/WAYLAND_PICKER.md` dosyalarindadir.
