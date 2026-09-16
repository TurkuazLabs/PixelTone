# 📄 Dosya Yolu: pixeltone/CHANGELOG.md
# 📌 Amac: PixelTone surum degisikliklerini kaydetmek
# 📌 Docs - Markdown
# Version: 0.2.0
# Aciklama: Proje degisiklik gecmisi

Bagimli Oldugu Katman: View

# Changelog

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
