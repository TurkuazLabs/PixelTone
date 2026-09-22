# 📄 Dosya Yolu: pixeltone/docs/WINDOWS_SETUP.md
# 📌 Amac: PixelTone Windows Setup.exe uretim, dogrulama ve release sinirlarini belgelemek
# 📌 Modul - Markdown
# Version: 1.0.0
# Aciklama: Unsigned test setup ile signed updater/release paketini birbirinden ayirir

Bagimli Oldugu Katman: Tool

# PixelTone Windows Setup

PixelTone iki ayri paketleme akisina sahiptir.

## Test / gelistirme setup

Komut:

```powershell
npm run setup:windows
```

Bu akis:

- Windows uzerinde calisir.
- `src-tauri/icons/app-icon.svg` kaynagindan platform ikonlarini build workspace icinde yeniden uretir.
- Stable Desktop preflight ve Windows CI kontrollerini calistirir.
- `src-tauri/tauri.setup.conf.json5` ile updater artifact uretimini kapatir.
- Updater signing secret istemez.
- Yalniz NSIS Setup.exe uretir.
- `dist-installer` altina Setup.exe, SHA256 ve build metadata dosyasi yazar.

Bu artifact test ve manuel kurulum dogrulamasi icindir. Public release olarak yayinlanmaz.

## GitHub Actions setup artifact

`PixelTone Windows Setup` workflow'u manuel calistirilabilir. Workflow release/tag olusturmaz ve updater signing secret kullanmaz.

Artifact icerigi:

- `PixelTone-Setup-vX.Y.Z.exe`
- `PixelTone-Setup-vX.Y.Z.exe.sha256`
- `PixelTone-Setup-vX.Y.Z.json`

## Public release

Public release ayri `PixelTone Release` workflow'udur.

Release akisi:

- updater signing public key konfigurasyonunu dogrular;
- `TAURI_SIGNING_PRIVATE_KEY` ve `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` secret'larini zorunlu tutar;
- updater artifact ve signature uretir;
- CI/release gate'leri gecmeden yayinlanmamalidir.

Secret veya signing bilgisi yoksa setup artifact uretilebilir fakat release/tag olusturulmaz.
