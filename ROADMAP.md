# 📄 Dosya Yolu: pixeltone/ROADMAP.md
# 📌 Amac: PixelTone gelistirme yol haritasini tanimlamak
# 📌 Docs - Markdown
# Version: 1.0.0
# Aciklama: Tamamlanan masaustu surumleri ve sonraki gelisim alanlarini tanimlar

Bagimli Oldugu Katman: View

# PixelTone Roadmap

## v0.1.0 - Starter - TAMAMLANDI

- Tauri v2 iskeleti
- HTML UI
- Rust color service
- Palette repository taslagi
- Local history

## v0.2.0 - Screen Capture - TAMAMLANDI

- Windows ekran rengi yakalama adaptoru
- Linux X11/Wayland oturum ayrimi
- macOS ekran yakalama altyapisi ve izin notlari
- Coklu monitor koordinat esleme
- 9x9 buyutec paneli
- Capture icin Controller -> Service -> Tool akisi
- Capture sirasinda ana pencereyi gecici kucultme

## v0.3.0 - Palette Studio - TAMAMLANDI

- Proje bazli paletler
- YAML export/import
- CSS variables export
- Tailwind yakin renk onerisi
- Palet icinde renk adlandirma ve siralama
- Palet silme/duzenleme

## v0.4.0 - Picker Experience - TAMAMLANDI

- Global shortcut
- Canli picker overlay
- Cursor takipli buyutec
- Tek tikla HEX/RGB kopyalama
- Wayland portal/overlay stratejisi

## v1.0.0 - Stable Desktop - TAMAMLANDI

- Windows/Linux/macOS release build workflow
- Windows NSIS ve MSI installer paketleri
- Linux AppImage, DEB ve RPM paketleri
- macOS APP ve DMG paketleri
- Ayarlar ekrani ve local settings repository
- Sistem tepsisi ikonu ve tray menusu
- Close-to-tray davranisi
- Degistirilebilir global picker kisayolu
- Varsayilan HEX/RGB kopyalama tercihi
- Baslangicta veya manuel surum kontrolu
- GitHub Release tabanli dagitim akisi

## Sonraki Gelisim Alanlari

- Wayland XDG Desktop Portal PickColor adaptorunun uygulanmasi
- Imzali Windows installer dagitimi
- Apple Developer ID ile macOS notarization
- Private repo icin guvenli update manifest servisi veya public release kanali
