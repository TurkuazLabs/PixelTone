// # 📄 Dosya Yolu: pixeltone/src-tauri/src/models/update.rs
// # 📌 Amac: PixelTone imzali updater sonuc modelini tanimlamak
// # 📌 Model - Rust
// # Version: 1.0.0
// # Aciklama: Updater konfigurasyonu, mevcut/yeni surum ve kurulum durumunu frontend'e tasir
//
// Bagimli Oldugu Katman: Repo

use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct UpdateResult {
    pub configured: bool,
    pub update_available: bool,
    pub installed: bool,
    pub current_version: String,
    pub latest_version: String,
    pub message: String,
}
