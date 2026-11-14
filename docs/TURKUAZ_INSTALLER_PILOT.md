# Dosya Yolu: REPO_ROOT/docs/TURKUAZ_INSTALLER_PILOT.md
# Amac: PixelTone icin TurkuazInstaller Community pilot sinirlarini ve dogrulamasini tanimlamak
# Modul - Documentation Markdown
# Version: 0.1.0
# Aciklama: Sabit surumler, CI artifact'i, smoke kapsami ve production olmayan dagitim durumu
# Bagimli Oldugu Katman: Documentation | Tool | Config

# PixelTone TurkuazInstaller pilotu

Bu pilot PixelTone `1.2.2` Windows executable dosyasini
TurkuazInstaller Community `0.2.20`, kaynak revizyonu
`88dc833d906b83ede601c04df2affbe1ac8c1839` ile paketler.

`.github/workflows/turkuaz-installer-pilot.yml` yalniz manuel veya PR
dogrulamasinda calisir. Mevcut Tauri NSIS/MSI release akisini degistirmez,
tag olusturmaz ve GitHub Release yayinlamaz.

## Otomatik dogrulama

- PixelTone preflight, arac testleri, frontend ve Rust release build.
- Sabit TurkuazInstaller commit ve CLI surum kontrolu.
- `.tzpkg` ve tek dosyali pilot Setup EXE uretimi.
- Gecici dizine gercek `install-local-self` kurulumu.
- Kurulan `PixelTone.exe` SHA-256 karsilastirmasi.
- `uninstall-local` ile yalniz yonetilen payload'in kaldirilmasi.
- Setup, paket ve metadata SHA-256 artifact'leri.

## Sinirlar

Artifact imzasizdir, 14 gun saklanir ve yalniz kontrollu Windows pilotu
icindir. Authenticode/SmartScreen guveni, temiz Windows 10/11 etkileşimli
wizard kabulü ve WebView2 bulunmayan makine senaryosu production dagitimdan
once ayri tamamlanmalidir. Tauri signed updater ve mevcut NSIS/MSI paketleri
bu pilot tarafindan degistirilmez.
