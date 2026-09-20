# 📄 Dosya Yolu: pixeltone/CHANGELOG.md
# 📌 Amac: PixelTone surum degisikliklerini kaydetmek
# 📌 Docs - Markdown
# Version: 0.3.0
# Aciklama: Proje degisiklik gecmisi ve tamamlanan v0.3.0 Palette Studio kaydi

Bagimli Oldugu Katman: View

# Changelog

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
