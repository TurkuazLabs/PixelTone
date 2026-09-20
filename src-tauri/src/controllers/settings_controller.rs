// # 📄 Dosya Yolu: pixeltone/src-tauri/src/controllers/settings_controller.rs
// # 📌 Amac: PixelTone ayar Tauri isteklerini almak
// # 📌 Controller - Rust
// # Version: 1.0.0
// # Aciklama: Ayar okuma ve kaydetme isteklerini SettingsService katmanina aktarir
//
// Bagimli Oldugu Katman: Controller

use crate::models::settings::AppSettings;
use crate::repositories::settings_repository::SettingsRepository;
use crate::services::settings_service::SettingsService;

#[tauri::command]
pub fn get_settings() -> Result<AppSettings, String> {
    SettingsService::new(SettingsRepository::new()).get_settings()
}

#[tauri::command]
pub fn save_settings(settings: AppSettings) -> Result<AppSettings, String> {
    SettingsService::new(SettingsRepository::new()).save_settings(settings)
}
