// # 📄 Dosya Yolu: pixeltone/src-tauri/src/models/palette_transfer.rs
// # 📌 Amac: YAML/CSS palet aktarim DTO tiplerini tanimlamak
// # 📌 Model - Rust
// # Version: 0.3.0
// # Aciklama: Export format, transfer dosyasi ve import/export response modellerini tutar
//
// Bagimli Oldugu Katman: Tool

use serde::{Deserialize, Serialize};

use crate::models::palette::PaletteColor;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum PaletteExportFormat {
    Yaml,
    Css,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PaletteTransferFile {
    pub version: String,
    pub project: String,
    pub name: String,
    pub colors: Vec<PaletteColor>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExportPaletteRequest {
    pub project: String,
    pub name: String,
    pub colors: Vec<PaletteColor>,
    pub format: PaletteExportFormat,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExportPaletteResponse {
    pub file_name: String,
    pub mime_type: String,
    pub content: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ImportPaletteRequest {
    pub content: String,
}
