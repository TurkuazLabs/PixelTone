// # 📄 Dosya Yolu: pixeltone/src-tauri/src/controllers/startup_controller.rs
// # 📌 Amac: PixelTone splash tamamlanma istegini StartupService katmanina aktarmak
// # 📌 Controller - Rust
// # Version: 1.1.0
// # Aciklama: Frontend splash tamamlanma komutunu is kurali uygulamadan Service katmanina yonlendirir
//
// Bagimli Oldugu Katman: Controller

use tauri::AppHandle;

use crate::services::startup_service::StartupService;

#[tauri::command]
pub fn complete_startup(app: AppHandle) -> Result<(), String> {
    StartupService::complete(app)
}
