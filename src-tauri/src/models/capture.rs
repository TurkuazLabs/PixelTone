// # 📄 Dosya Yolu: pixeltone/src-tauri/src/models/capture.rs
// # 📌 Amac: Ekran renk yakalama sonucunu ve buyutec verisini tanimlamak
// # 📌 Model - Rust
// # Version: 0.2.0
// # Aciklama: Capture service ve UI arasinda kullanilan DTO yapilari
//
// Bagimli Oldugu Katman: Tool

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CapturePoint {
    pub x: i32,
    pub y: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MagnifierPixel {
    pub x: u32,
    pub y: u32,
    pub hex: String,
    pub is_center: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CaptureColorResponse {
    pub hex: String,
    pub source: String,
    pub platform: String,
    pub cursor: CapturePoint,
    pub magnifier_width: u32,
    pub magnifier_height: u32,
    pub magnifier_pixels: Vec<MagnifierPixel>,
}
