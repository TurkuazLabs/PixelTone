// # 📄 Dosya Yolu: pixeltone/src-tauri/src/models/palette.rs
// # 📌 Amac: Palet kayit ve listeleme modellerini tanimlamak
// # 📌 Model - Rust
// # Version: 0.1.0
// # Aciklama: Palette request, response ve summary DTO yapilari
//
// Bagimli Oldugu Katman: Repo

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PaletteColor {
    pub name: String,
    pub hex: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SavePaletteRequest {
    pub name: String,
    pub colors: Vec<PaletteColor>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PaletteFile {
    pub name: String,
    pub colors: Vec<PaletteColor>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SavePaletteResponse {
    pub name: String,
    pub path: String,
    pub color_count: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PaletteSummary {
    pub name: String,
    pub path: String,
    pub color_count: usize,
}
