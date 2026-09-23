// # 📄 Dosya Yolu: pixeltone/src-tauri/src/controllers/settings_controller.rs
// # 📌 Amac: PixelTone ayar Tauri isteklerini almak
// # 📌 Controller - Rust
// # Version: 1.2.0
// # Aciklama: Ayar okuma/kaydetme isteklerini SettingsService'e aktarir ve native tray dilini yeniler
//
// Bagimli Oldugu Katman: Controller

use crate::models::settings::AppSettings;
use crate::repositories::settings_repository::SettingsRepository;
use crate::services::desktop_service::DesktopService;
use crate::services::settings_service::SettingsService;

#[tauri::command]
pub fn get_settings() -> Result<AppSettings, String> {
    SettingsService::new(SettingsRepository::new()).get_settings()
}

#[tauri::command]
pub fn save_settings(app: tauri::AppHandle, settings: AppSettings) -> Result<AppSettings, String> {
    let saved = SettingsService::new(SettingsRepository::new()).save_settings(settings)?;
    let _ = DesktopService::refresh_tray(&app, &saved.language);
    Ok(saved)
}
