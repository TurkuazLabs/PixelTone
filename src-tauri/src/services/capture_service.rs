// # 📄 Dosya Yolu: pixeltone/src-tauri/src/services/capture_service.rs
// # 📌 Amac: Ekran renk yakalama is kurallarini yonetmek
// # 📌 Service - Rust
// # Version: 0.2.0
// # Aciklama: Controller ile platform capture tool arasindaki servis katmanidir
//
// Bagimli Oldugu Katman: Service

use crate::models::capture::CaptureColorResponse;
use crate::tools::platform_capture_tool::PlatformCaptureTool;

pub struct CaptureService;

impl CaptureService {
    pub fn capture_current_color() -> Result<CaptureColorResponse, String> {
        PlatformCaptureTool::capture_screen_color()
    }
}
