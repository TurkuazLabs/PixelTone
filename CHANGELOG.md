# 📄 Dosya Yolu: pixeltone/CHANGELOG.md
# 📌 Amac: PixelTone surum degisikliklerini kaydetmek
# 📌 Docs - Markdown
# Version: 1.1.1
# Aciklama: Proje degisiklik gecmisi, splash suresi ve Windows kurulum kapsami duzeltmelerini kaydeder

Bagimli Oldugu Katman: View

# Changelog

## 1.1.1

- Splash minimum gorunme suresi 900 ms'den 1500 ms'ye cikarildi.
- Windows NSIS installer installMode currentUser yerine both olarak ayarlandi.
- Kurulumda sadece mevcut kullanici veya tum kullanicilar icin kurulum secimi etkinlestirildi.
- Tum kullanicilar kurulumu Program Files altinda TurkuazLabs\PixelTone yolunu kullanacak sekilde standardize edildi.
- Mevcut kullanici kurulumu LocalAppData altinda TurkuazLabs\PixelTone standardini koruyor.
- Updater passive kurulumunda onceki install scope registry bilgisinin korunmasi icin Tauri MultiUser akisi kullaniliyor.
- package.json, Cargo.toml ve Tauri config surumleri 1.1.1 olarak senkronlandi.

## 1.1.0

- Native splash-first acilis akisi eklendi.
- Ana pencere baslangicta gizli yukleniyor; splash tamamlaninca gorunur ve odakli hale geliyor.
- Splash icin ayri Vite entry, Controller, Service ve View katmanlari eklendi.
- Splash minimum gorunme suresi merkezi Config katmanina alindi.
- Baslangicta signed updater kontrol ve otomatik kurulum tercihi daha acik UI metinleriyle gosteriliyor.
- Manuel updater aksiyonu kontrol et ve kur davranisini acikca ifade edecek sekilde guncellendi.
- package.json, Cargo.toml ve Tauri config surumleri 1.1.0 olarak senkronlandi.
- Signed updater release kanali latest.json, signature ve public key dogrulamasi ile devam ediyor.

## 1.0.0

- Windows current-user kurulum yolu `%LOCALAPPDATA%\TurkuazLabs\PixelTone` standardina tasindi.
- Start Menu klasoru `TurkuazLabs\PixelTone` olarak standardize edildi.
- Tauri v2 signed updater backend'i eklendi.
- Public GitHub Releases `latest.json` updater kanali eklendi.
- Baslangicta otomatik signed update kontrolu ve kurulum akisi eklendi.
- Tauri updater artifact ve signature uretimi etkinlestirildi.
- Release workflow NSIS updater'i tercih edecek ve `latest.json` yayinlayacak sekilde guncellendi.
- Vite `TAURI_` env prefixi kaldirilarak updater private key'in frontend bundle'a sizma riski kapatildi.

- Stable Desktop ayarlar modeli, SettingsService ve JSON SettingsRepository eklendi.
- Kapatma dugmesinde tray'e gizleme davranisi ayarlanabilir hale getirildi.
- Close-to-tray kapaliyken uygulamanin gercekten sonlanmasi saglandi.
- Native Tauri system tray ikonu ve Ac / Canli Picker / Cikis menusu eklendi.
- Tray sol tik ana pencereyi geri getiriyor.
- Global picker kisayolu ayarlardan degistirilebilir hale getirildi.
- Kisayol degisiminde eski global shortcut kaydi temizleniyor.
- Varsayilan picker kopyalama formati HEX veya RGB olarak secilebilir hale getirildi.
- Ayar kaydi runtime shortcut uygulamasi ile transactional hale getirildi.
- Kurulu uygulama surumu Tauri App API ile okunuyor.
- GitHub Releases endpointi uzerinden baslangicta veya manuel surum kontrolu eklendi.
- Private repository release endpointi erisilemezse surum kontrolu guvenli uyari durumuna geciyor.
- Windows icin NSIS ve MSI, Linux icin AppImage/DEB/RPM, macOS icin APP/DMG release workflow'u eklendi.
- Release workflow platform ikonlarini Tauri CLI ile kaynak PNG'den uretiyor.
- macOS sertifikasiz CI buildleri icin ad-hoc signing identity tanimlandi.
- package.json, Cargo.toml ve Tauri config surumleri 1.0.0 olarak senkronlandi.
- Stable Desktop CSP etkinlestirildi; production webview yalniz Tauri IPC ve GitHub Release API baglantisina izin veriyor.
- CI duplicate feature/pull-request runlari kaldirildi ve eski runlari iptal eden concurrency eklendi.
- Release workflow yalniz main manuel calistirma veya tam eslesen v<version> tagi ile yayin yapabiliyor.
- Stable release icin package-lock.json ve src-tauri/Cargo.lock zorunlu hale getirildi.
- Paralel platform bundle'lari taslak release'e yukleniyor; release yalniz tum platformlar basarili oldugunda final job ile yayinlaniyor.
- Global shortcut degisimi non-destructive hale getirildi ve gecersiz persisted shortcut acilista varsayilana onariliyor.
- Tray Tool yalniz native adaptor olarak birakildi; tray davranis kurallari DesktopService katmanina tasindi.

## 0.4.0

- Global picker kisayolu icin Tauri Global Shortcut plugin altyapisi eklendi.
- Varsayilan desktop picker kisayolu `CommandOrControl+Shift+P` olarak tanimlandi.
- Gizli, seffaf ve always-on-top `picker` penceresi eklendi.
- Picker penceresi cursorun bulundugu monitorun fiziksel konum ve boyutuna tasiniyor.
- Canli 9x9 buyutec yaklasik 90 ms aralikla guncelleniyor.
- Picker bilgi karti cursoru takip ediyor ve hedef pikselin uzerini kapatmayacak sekilde konumlanıyor.
- H tusu HEX, R tusu RGB kopyalama modunu seciyor.
- Sol tik secili rengi sistem panosuna yaziyor ve ana pencereye aktariyor.
- Esc canli picker deneyimini iptal ediyor.
- Clipboard ve pencere event islemleri Tool katmanlarina ayrildi.
- Gizli picker penceresinin arka planda capture dongusu calistirmamasi icin acilis aktivasyon eventi eklendi.
- Vite build iki HTML entry uretecek sekilde main ve picker sayfalarina ayrildi.
- macOS seffaf pencere destegi icin Tauri private API ayari etkinlestirildi.
- Wayland icin canli overlay ve XDG Desktop Portal PickColor fallback stratejisi dokumante edildi.
- Uygulama, Cargo ve Tauri surumu 0.4.0 olarak guncellendi.

## 0.3.0

- Proje bazli Palette Studio yapisi eklendi.
- Palet storage yapisi `projects/<proje>/palettes/` duzenine tasindi.
- v0.2.x paletleri icin `Genel` proje legacy fallback destegi eklendi.
- Palet detayini yukleme, mevcut paleti duzenleme/yeniden adlandirma ve palet silme CRUD akisi eklendi.
- Palet renklerine kullanici adi verme ve renkleri yukari/asagi siralama eklendi.
- Palet duzenleme sirasinda renklerin ColorService ile tekrar dogrulanarak calisma listesine yuklenmesi eklendi.
- YAML palet import ve export eklendi.
- CSS custom property export eklendi.
- Import edilen palet renkleri ColorService ile yeniden dogrulaniyor.
- Palet format islemleri PaletteFormatTool katmanina ayrildi.
- Resmi Tailwind CSS 4.3.3 `tailwindcss/colors` kaynagi eklendi.
- Tailwind renkleri icin OKLCH -> OKLab adaptor akisi eklendi.
- Secili HEX renge OKLab mesafesiyle en yakin 5 Tailwind rengini bulan TailwindColorService eklendi.
- Tailwind yakin renk paneli View katmanina eklendi.
- Tailwind eslestirme ayarlari Config, metinleri Language katmaninda merkezilestirildi.
- Windows ICO olusturma islemi kaynak PNG kullanilarak build zamanina tasindi.
- Bozuk PNG icon kaynagi gecerli 512x512 RGBA kaynakla degistirildi.
- Windows, Linux ve macOS ortak CI akisi iyilestirildi.
- Uygulama, Cargo ve Tauri surumu 0.3.0 olarak guncellendi.

## 0.2.0

- xcap 0.9.8 ekran yakalama adaptoru eklendi.
- mouse_position ile global cursor koordinati okuma eklendi.
- Cursorun bulundugu monitor otomatik seciliyor.
- Coklu monitor koordinatlari ekran goruntusu boyutuna olcekleniyor.
- 9x9 buyutec piksel verisi Rust tarafinda uretiliyor.
- Buyutec paneli frontend View katmanina eklendi.
- Capture controller dogrudan Tool cagirmak yerine CaptureService kullaniyor.
- Frontend DOM/render islemleri ui_view.js dosyasina tasindi.
- Capture sirasinda pencere gecici olarak kucultuluyor ve sonra geri getiriliyor.
- Linux X11/Wayland oturum ayrimi eklendi.
- macOS Screen Recording ve Wayland sinirlari dokumante edildi.
- Uygulama, Cargo ve Tauri surumu 0.2.0 olarak guncellendi.

## 0.1.0

- PixelTone proje iskeleti olusturuldu.
- Tauri v2 + Rust + HTML UI yapisi kuruldu.
- Katmanli klasor yapisi eklendi.
- Renk donusum servisi eklendi.
- Palet repository iskeleti eklendi.
- Platform capture tool placeholder eklendi.
- Kurulum ve mimari dokumanlari eklendi.
