# 📄 Dosya Yolu: pixeltone/docs/UPDATER.md
# 📌 Amac: PixelTone imzali otomatik guncelleme mimarisini ve ilk kurulumunu tanimlamak
# 📌 Docs - Markdown
# Version: 1.0.0
# Aciklama: GitHub Releases latest.json, Tauri updater signing, GitHub Secrets ve otomatik install/restart akislarini aciklar
#
# Bagimli Oldugu Katman: Service

# PixelTone Automatic Updater

## Dagitim Kanali

Updater endpoint:

`https://github.com/TurkuazLabs/PixelTone/releases/latest/download/latest.json`

Repository public oldugu icin istemci GitHub token kullanmadan update manifestini okuyabilir.

## Guvenlik

PixelTone Tauri v2 signed updater kullanir.

Update paketi kurulmadan once public key ile imza dogrulanir. Imzasiz update kurulmaz.

Private key:

- repoya commit edilmez
- frontend koduna verilmez
- GitHub Actions Secret olarak saklanir
- yerelde `%USERPROFILE%\.tauri\pixeltone-updater.key` altinda tutulur

Public key:

- `src-tauri/updater.pubkey`
- `src-tauri/tauri.conf.json5 -> plugins.updater.pubkey`

## Ilk Signing Kurulumu

Windows PowerShell:

```powershell
gh auth login
npm install
npm run configure:updater
```

Script signing key sifresini gizli olarak ister.

Ardindan:

- private key yerelde olusturulur
- public key PixelTone config dosyalarina yazilir
- `TAURI_SIGNING_PRIVATE_KEY` GitHub Secret olusturulur
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` GitHub Secret olusturulur

Degisen public dosyalar commit edilmelidir:

- `src-tauri/updater.pubkey`
- `src-tauri/tauri.conf.json5`

## Uygulama Davranisi

`Baslangicta yeni surum kontrol et` aciksa:

1. PixelTone GitHub Releases latest.json dosyasini kontrol eder.
2. Yeni surum yoksa normal acilis devam eder.
3. Yeni surum varsa updater paketi indirilir.
4. Paket imzasi dogrulanir.
5. Windows NSIS updater passive modda kurulur.
6. PixelTone yeniden baslatilir.

Ayarlar ekranindaki `Guncellemeyi Kontrol Et` butonu ayni signed updater akisina gider.

## Release

Release workflow:

`.github/workflows/release.yml`

Tauri Action:

- signed updater artifactlari uretir
- NSIS paketini updater icin tercih eder
- `latest.json` dosyasini GitHub Release'e ekler

Release ancak Windows/Linux/macOS build matrix tamamlandiktan sonra draft durumundan cikarilir.

## Vite Secret Siniri

`vite.config.js` yalniz `VITE_` prefixini frontend'e acar.

`TAURI_SIGNING_PRIVATE_KEY` ve diger `TAURI_` signing degerleri frontend bundle'a aktarilmaz.
