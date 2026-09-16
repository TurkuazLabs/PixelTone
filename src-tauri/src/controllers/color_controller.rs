// # 📄 Dosya Yolu: pixeltone/src-tauri/src/controllers/color_controller.rs
// # 📌 Amac: Renk ile ilgili Tauri komut isteklerini almak
// # 📌 Controller - Rust
// # Version: 0.2.0
// # Aciklama: HEX donusum ve ekran yakalama komutlarini service katmanina aktarir
//
// Bagimli Oldugu Katman: Controller

use crate::models::capture::CaptureColorResponse;
use crate::models::color::ColorInfo;
use crate::services::capture_service::CaptureService;
use crate::services::color_service::ColorService;

#[tauri::command]
pub fn convert_hex_color(hex: String) -> Result<ColorInfo, String> {
    ColorService::convert_from_hex(&hex)
}

#[tauri::command]
pub fn capture_screen_color() -> Result<CaptureColorResponse, String> {
    CaptureService::capture_current_color()
}
