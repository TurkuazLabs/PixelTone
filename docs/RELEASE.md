# 📄 Dosya Yolu: pixeltone/docs/RELEASE.md
# 📌 Amac: PixelTone Stable Desktop release ve installer yayin prosedurunu tanimlamak
# 📌 Docs - Markdown
# Version: 1.0.0
# Aciklama: Surum senkronu, Git tag, GitHub Actions release workflow ve installer ciktilarini aciklar

Bagimli Oldugu Katman: Config

# PixelTone Release Proseduru

## Surum Kaynaklari

Release oncesi su uc kaynak ayni semver degerini tasimalidir:

- `package.json -> version`
- `src-tauri/Cargo.toml -> package.version`
- `src-tauri/tauri.conf.json5 -> version`

v1.0.0 icin uc deger de `1.0.0` olmalidir.

## Otomatik Release Workflow

Workflow:

`.github/workflows/release.yml`

Tetikleyiciler:

- `v*` Git tag push
- Manuel `workflow_dispatch`

Guvenlik kurallari:

- Manuel release yalniz `main` branch uzerinden calisabilir.
- Tag release icin tag degeri tam olarak `v<package.version>` olmalidir.
- `package-lock.json` ve `src-tauri/Cargo.lock` olmadan Stable Desktop release baslamaz.
- package.json, Cargo.toml ve tauri.conf.json5 surumleri birebir ayni olmalidir.

Ornek tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

## Dependency Lockfile Gereksinimi

Stable release tekrar uretilebilir olmalidir.

Bu nedenle release oncesi su dosyalar repoya commit edilmelidir:

- `package-lock.json`
- `src-tauri/Cargo.lock`

CI ortami lockfile uretse bile release workflow yalniz repoya commit edilmis lockfile'lari kabul eder.

## Atomik Release Yayinlama

Windows, Linux ve macOS matrix joblari ayni release'i once taslak olarak doldurur.

Release tum platform buildleri tamamlanmadan public olmaz. `publish-release` final job'u yalniz `build-release` matrix tamamen basarili oldugunda taslak release'i yayinlar.

Bir platform buildi hata verirse release taslak olarak kalir ve eksik installer kullaniciya Stable olarak sunulmaz.

## Uretilen Paketler

Windows:

- NSIS Setup EXE
- MSI

Linux:

- AppImage
- DEB
- RPM

macOS:

- APP
- DMG

## Ikonlar

Workflow, build oncesi su komutu calistirir:

```bash
npm run tauri icon src-tauri/icons/icon.png
```

Boylece platforma ozel icon setleri build ortaminda kaynak PNG'den yeniden uretilir.

## macOS Imzalama

Sertifika tanimli degilken release workflow ad-hoc signing identity `-` kullanir.

Bu build test ve dogrudan indirme icin paket uretebilir ancak Apple Developer ID notarization yerine gecmez.

## Windows Imzalama

v1.0.0 workflow'u code-signing sertifikasi zorunlu tutmaz. Windows SmartScreen itibari icin ileride imzali release pipeline eklenmelidir.

## Surum Kontrolu

PixelTone UI, GitHub Releases `latest` endpointini kontrol eder.

Repository private ise anonim istemci bu endpointi okuyamayabilir. Uygulama bu durumda surum kontrolunu bloklamaz ve "surum bilgisi kullanilamiyor" durumunu gosterir.

Private repo icin token uygulamaya gomulmez. Gelecekte public update manifest veya imzali updater servisi kullanilmalidir.


## Signed Updater Release

Release workflow su GitHub Secrets degerlerini zorunlu tutar:

- `TAURI_SIGNING_PRIVATE_KEY`
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`

Tauri Action NSIS updater bundle imzasini ve `latest.json` dosyasini release assetlerine ekler.

Ilk signing yapilandirmasi:

```powershell
npm run configure:updater
```

Ayrinti: `docs/UPDATER.md`.
