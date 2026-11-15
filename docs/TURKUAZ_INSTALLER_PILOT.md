# Dosya Yolu: REPO_ROOT/docs/TURKUAZ_INSTALLER_PILOT.md
# Amac: PixelTone icin TurkuazInstaller Community pilot sinirlarini ve dogrulamasini tanimlamak
# Modul - Documentation Markdown
# Version: 0.1.5
# Aciklama: Sabit surumler, gomulu Tauri arayuzu, smoke kapsami ve production olmayan dagitim durumu
# Bagimli Oldugu Katman: Documentation | Tool | Config

# PixelTone TurkuazInstaller pilotu

Bu pilot PixelTone `1.2.2` Windows executable dosyasini
TurkuazInstaller Community `0.2.23`, kaynak revizyonu
`987603a6784d16e5b2f7d1b64b248c03582d199c` ile paketler.

`.github/workflows/turkuaz-installer-pilot.yml` yalniz manuel veya PR
dogrulamasinda calisir. Mevcut Tauri NSIS/MSI release akisini degistirmez,
tag olusturmaz ve GitHub Release yayinlamaz.

## Otomatik dogrulama

- PixelTone preflight, arac testleri ve gomulu arayuzlu Tauri production build.
- Release build'in gelistirme sunucusu URL'siyle uretilmesini engelleyen fail-fast kontrol.
- Sabit TurkuazInstaller commit ve CLI surum kontrolu.
- `.tzpkg` ve tek dosyali pilot Setup EXE uretimi.
- Gecici dizine gercek `install-local-self` kurulumu.
- Kurulan `PixelTone.exe` SHA-256 karsilastirmasi.
- `uninstall-local` ile yalniz yonetilen payload'in kaldirilmasi.
- Setup, paket ve metadata SHA-256 artifact'leri.

TurkuazInstaller `0.2.23` sihirbazi uygulama adini `PixelTone.exe` giris
noktasindan `PixelTone` olarak turetir. Baslat menusunde `PixelTone` ve
`Kaldir` ile masaustunde `PixelTone` kisayollarini zorunlu olusturur;
kaldirmada kendi kisayollarini guvenli bicimde temizler.

## Sinirlar

Artifact imzasizdir, 14 gun saklanir ve yalniz kontrollu Windows pilotu
icindir. Authenticode/SmartScreen guveni, temiz Windows 10/11 etkileşimli
wizard kabulü ve WebView2 bulunmayan makine senaryosu production dagitimdan
once ayri tamamlanmalidir. Tauri signed updater ve mevcut NSIS/MSI paketleri
bu pilot tarafindan degistirilmez.
