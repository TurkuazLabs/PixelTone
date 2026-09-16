// # 📄 Dosya Yolu: pixeltone/src-tauri/src/models/capture.rs
// # 📌 Amac: Ekran renk yakalama sonucunu tanimlamak
// # 📌 Model - Rust
// # Version: 0.1.0
// # Aciklama: Platform capture tool tarafindan dondurulecek DTO
//
// Bagimli Oldugu Katman: Tool

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CaptureColorResponse {
    pub hex: String,
    pub source: String,
}
