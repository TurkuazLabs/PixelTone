# 📄 Dosya Yolu: pixeltone/docs/ARCHITECTURE.md
# 📌 Amac: PixelTone mimari katmanlarini aciklamak
# 📌 Docs - Markdown
# Version: 0.1.0
# Aciklama: Controller, Service, Repo, Tool, View ve Language ayrimi

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

## Rust Backend

```text
src-tauri/src/controllers
src-tauri/src/services
src-tauri/src/repositories
src-tauri/src/tools
src-tauri/src/models
src-tauri/src/config
```

## Kural

- Controller sadece istek alir ve service cagirir.
- Service is kuralini tutar.
- Repository dosya/veri kaydini yapar.
- Tool dis dunya veya platform adaptorudur.
- View sadece arayuzden sorumludur.
- Language ceviri metinlerini tasir.
