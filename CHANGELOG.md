# 📄 Dosya Yolu: pixeltone/CHANGELOG.md
# 📌 Amac: PixelTone surum degisikliklerini kaydetmek
# 📌 Docs - Markdown
# Version: 1.0.0
# Aciklama: Proje degisiklik gecmisi ve v1.0.0 Stable Desktop kaydi

Bagimli Oldugu Katman: View

# Changelog

## 1.0.0

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
