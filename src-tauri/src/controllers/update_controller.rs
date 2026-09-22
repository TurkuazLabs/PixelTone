// # 📄 Dosya Yolu: pixeltone/src-tauri/src/controllers/update_controller.rs
// # 📌 Amac: PixelTone updater Tauri istegini UpdateService katmanina aktarmak
// # 📌 Controller - Rust
// # Version: 1.0.0
// # Aciklama: Frontend guncelleme istegini is kurali uygulamadan signed updater Service'e yonlendirir
//
// Bagimli Oldugu Katman: Controller

use tauri::AppHandle;

use crate::models::update::UpdateResult;
use crate::services::update_service::UpdateService;

#[tauri::command]
pub async fn check_and_install_update(app: AppHandle) -> Result<UpdateResult, String> {
    UpdateService::check_and_install(app).await
}
