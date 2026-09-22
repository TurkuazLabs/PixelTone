// # 📄 Dosya Yolu: pixeltone/src-tauri/src/services/startup_service.rs
// # 📌 Amac: PixelTone splash ekranindan ana pencereye gecis is kuralini yonetmek
// # 📌 Service - Rust
// # Version: 1.1.0
// # Aciklama: Ana pencereyi gorunur ve odakli hale getirir, ardindan splash penceresini kapatir
//
// Bagimli Oldugu Katman: Service

use tauri::AppHandle;

use crate::config::app_config::{MAIN_WINDOW_LABEL, SPLASH_WINDOW_LABEL};
use crate::tools::window_tool::WindowTool;

pub struct StartupService;

impl StartupService {
    pub fn complete(app: AppHandle) -> Result<(), String> {
        WindowTool::show_and_focus_by_label(&app, MAIN_WINDOW_LABEL)?;
        WindowTool::close_by_label(&app, SPLASH_WINDOW_LABEL)
    }
}
