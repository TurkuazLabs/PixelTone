# 📄 Dosya Yolu: pixeltone/docs/CI.md
# 📌 Amac: PixelTone CI runner mimarisini ve Windows self-hosted kurulumunu tanimlamak
# 📌 Docs - Markdown
# Version: 1.0.0
# Aciklama: GitHub-hosted runner kota/billing sorunundan bagimsiz Windows CI ve Setup.exe build yolunu aciklar
#
# Bagimli Oldugu Katman: Config

# PixelTone CI

## Neden Self-Hosted Runner

PixelTone repository private bir TurkuazLabs repository'sidir.

Onceki GitHub-hosted CI runlarinda Windows, Linux ve macOS joblari runner atanmadan kapandi:

- runner_id: 0
- steps: []
- job log yok

Bu durum Checkout veya proje build koduna ulasmadan gerceklesir.

PixelTone ana CI yolu bu nedenle Windows self-hosted runner kullanacak sekilde degistirildi.

## Ana CI

Workflow:

`.github/workflows/ci.yml`

Runner etiketleri:

- self-hosted
- windows
- x64
- pixeltone

Ana CI su durumlarda calisir:

- main push
- main hedefli pull request
- manuel workflow_dispatch

## Cross-Platform Hosted CI

Workflow:

`.github/workflows/ci-hosted.yml`

Bu workflow otomatik calismaz. GitHub-hosted runner kota/billing/policy durumu uygun oldugunda manuel olarak Windows, Ubuntu ve macOS dogrulamasi icin kullanilir.

## Windows Runner Kurulumu

GitHub repository ekraninda:

1. Settings
2. Actions
3. Runners
4. New self-hosted runner
5. Windows
6. x64

GitHub burada bir saat gecerliligi olan registration token gosterir.

Yonetici PowerShell acin ve PixelTone repository'sinde:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup_self_hosted_runner.ps1 -Token "GITHUB_REGISTRATION_TOKEN"
```

Script:

- son Windows x64 Actions Runner paketini indirir
- `C:\actions-runner` altina kurar
- repository'ye kaydeder
- `pixeltone` label ekler
- Windows service olarak kurar

## Yerel CI

GitHub runner olmadan ayni Windows dogrulamasini calistirmak icin:

```powershell
npm run ci:windows
```

Kontroller:

- Node/npm
- Rust/cargo
- PixelTone preflight
- dependency-free Node testleri
- frontend build
- cargo fmt
- cargo check
- cargo test --lib

## Setup.exe Build

Yerel Windows build:

```powershell
npm run setup:windows
```

Cikti:

```text
dist-installer/PixelTone-Setup-v1.0.0.exe
dist-installer/PixelTone-Setup-v1.0.0.exe.sha256
```

Script eksikse `package-lock.json` ve `src-tauri/Cargo.lock` dosyalarini gercek package registry verilerinden uretir.

## GitHub Setup Artifact

Workflow:

`.github/workflows/windows-setup.yml`

Actions ekranindan manuel calistirilir.

Self-hosted Windows runner uzerinde:

1. CI dogrulamasini calistirir.
2. NSIS Setup.exe uretir.
3. SHA256 olusturur.
4. PixelTone-Windows-Setup artifacti olarak yukler.

## Hosted Runner Sorunu

GitHub-hosted runnerlar daha sonra tekrar kullanilmak istenirse organizasyon seviyesinde su alanlar kontrol edilmelidir:

- Settings -> Actions -> General
- GitHub Actions hosted runner policy
- Billing -> Actions usage
- Actions budget/spending limit
- odeme yontemi ve private repository dakika kotasi

Self-hosted runner GitHub Actions dakika kotasi kullanmaz.
