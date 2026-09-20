# 📄 Dosya Yolu: pixeltone/docs/ARCHITECTURE.md
# 📌 Amac: PixelTone mimari katmanlarini ve v0.3.0 veri akislarini aciklamak
# 📌 Docs - Markdown
# Version: 0.3.0
# Aciklama: Controller, Service, Repo/Model, Tool, View, Language ve Palette Studio akislarini tanimlar

Bagimli Oldugu Katman: View

# PixelTone Architecture

PixelTone iki ana bolumden olusur:

1. Frontend HTML UI
2. Rust Tauri backend

## Katmanlar

```text
Controller -> Service -> Repo/Model -> Tool -> View -> Language
```

## Frontend

```text
frontend/controllers
frontend/services
frontend/repositories
frontend/tools
frontend/views
frontend/config
frontend/language
```

Frontend Controller yalnizca DOM event akislarini alir ve Service cagirir. Tailwind yakin renk hesaplama `TailwindColorService` icinde, resmi Tailwind palet adaptasyonu `TailwindPaletteTool` icinde tutulur.

## Rust Backend

```text
src-tauri/src/controllers
src-tauri/src/services
src-tauri/src/repositories
src-tauri/src/tools
src-tauri/src/models
src-tauri/src/config
```

Rust Controller yalnizca Tauri command girisidir. PaletteService palet dogrulama ve transfer is kurallarini yonetir. PaletteRepository local storage islemlerini, PaletteFormatTool YAML/CSS format islemlerini yapar.

## Ana Akislar

### Capture

```text
UI Controller -> PaletteService(frontend) -> Tauri Bridge Tool -> Color Controller -> Capture Service -> Platform Capture Tool
```

### Palette Studio

```text
UI Controller -> PaletteService(frontend) -> Tauri Bridge Tool -> Palette Controller -> PaletteService(Rust) -> PaletteRepository / PaletteFormatTool
```

### Tailwind Yakin Renk

```text
UI Controller -> TailwindColorService -> TailwindPaletteTool -> UI View
```

TailwindPaletteTool resmi `tailwindcss/colors` kaynagini okur. TailwindColorService secili HEX rengini OKLab uzayina cevirir, renk mesafesini hesaplar ve en yakin sonuclari siralar.

## Platform Build

Windows ICO dosyasi `src-tauri/build.rs` tarafindan `icons/icon.png` kaynagindan build zamaninda uretilir. Platform build sabitleri `src-tauri/src/config/build_config.rs` icinde tutulur.

## Kurallar

- Controller sadece istek alir ve Service cagirir.
- Service tum is kurallarini tutar.
- Repository DB, dosya veya storage islemlerini yapar.
- Tool dis dunya, format veya platform adaptorudur.
- View sadece arayuz ve cikti ciziminden sorumludur.
- Language kullaniciya gosterilen metinleri tasir.
- Config magic string ve ayarlari merkezilestirir.
