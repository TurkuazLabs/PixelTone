// # 📄 Dosya Yolu: pixeltone/src-tauri/src/tools/platform_capture_tool.rs
// # 📌 Amac: Platform bazli ekran renk yakalama adaptorunu tanimlamak
// # 📌 Tool - Rust
// # Version: 0.1.0
// # Aciklama: v0.2.0 icin Windows, Linux ve macOS implementasyon noktasi
//
// Bagimli Oldugu Katman: Tool

use crate::config::app_config::ERROR_CAPTURE_NOT_IMPLEMENTED;
use crate::models::capture::CaptureColorResponse;

pub struct PlatformCaptureTool;

impl PlatformCaptureTool {
    pub fn capture_screen_color() -> Result<CaptureColorResponse, String> {
        Err(ERROR_CAPTURE_NOT_IMPLEMENTED.to_string())
    }
}
