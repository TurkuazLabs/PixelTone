// # 📄 Dosya Yolu: pixeltone/src-tauri/src/models/color.rs
// # 📌 Amac: Renk donusum DTO modellerini tanimlamak
// # 📌 Model - Rust
// # Version: 0.1.0
// # Aciklama: HEX, RGB, HSL, HSV ve CMYK veri yapilari
//
// Bagimli Oldugu Katman: Repo

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RgbColor {
    pub red: u8,
    pub green: u8,
    pub blue: u8,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HslColor {
    pub hue: f64,
    pub saturation: f64,
    pub lightness: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HsvColor {
    pub hue: f64,
    pub saturation: f64,
    pub value: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CmykColor {
    pub cyan: f64,
    pub magenta: f64,
    pub yellow: f64,
    pub black: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ColorInfo {
    pub hex: String,
    pub rgb: RgbColor,
    pub hsl: HslColor,
    pub hsv: HsvColor,
    pub cmyk: CmykColor,
}
