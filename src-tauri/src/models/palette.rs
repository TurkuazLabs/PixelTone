// # 📄 Dosya Yolu: pixeltone/src-tauri/src/models/palette.rs
// # 📌 Amac: Palet kayit, duzenleme, silme ve listeleme modellerini tanimlamak
// # 📌 Model - Rust
// # Version: 0.3.0
// # Aciklama: Proje bazli palet request, storage ve response DTO tiplerini tanimlar
//
// Bagimli Oldugu Katman: Repo

use serde::{Deserialize, Serialize};

use crate::config::app_config::DEFAULT_PROJECT_NAME;

fn default_project_name() -> String {
    DEFAULT_PROJECT_NAME.to_string()
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PaletteColor {
    pub name: String,
    pub hex: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SavePaletteRequest {
    #[serde(default = "default_project_name")]
    pub project: String,
    pub name: String,
    pub colors: Vec<PaletteColor>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PaletteIdentity {
    #[serde(default = "default_project_name")]
    pub project: String,
    pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdatePaletteRequest {
    pub original: PaletteIdentity,
    pub palette: SavePaletteRequest,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PaletteFile {
    #[serde(default = "default_project_name")]
    pub project: String,
    pub name: String,
    pub colors: Vec<PaletteColor>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SavePaletteResponse {
    pub project: String,
    pub name: String,
    pub path: String,
    pub color_count: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DeletePaletteResponse {
    pub project: String,
    pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PaletteSummary {
    pub project: String,
    pub name: String,
    pub path: String,
    pub color_count: usize,
}
