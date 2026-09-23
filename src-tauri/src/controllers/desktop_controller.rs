// # 📄 Dosya Yolu: pixeltone/src-tauri/src/controllers/desktop_controller.rs
// # 📌 Amac: Tauri masaustu lifecycle ve ana pencere isteklerini DesktopService katmanina aktarmak
// # 📌 Controller - Rust
// # Version: 1.2.1
// # Aciklama: Setup/window eventleri ile picker icin ana pencere gizle/goster komutlarini Service katmanina yonlendirir
//
// Bagimli Oldugu Katman: Controller

use tauri::{AppHandle, WindowEvent};

use crate::services::desktop_service::DesktopService;

pub fn setup(app: &mut tauri::App) -> tauri::Result<()> {
    DesktopService::setup(app)
}

pub fn handle_window_event(window: &tauri::Window, event: &WindowEvent) {
    DesktopService::handle_window_event(window, event);
}

#[tauri::command]
pub fn hide_main_window(app: AppHandle) -> Result<(), String> {
    DesktopService::hide_main_window(&app)
}

#[tauri::command]
pub fn show_main_window(app: AppHandle) -> Result<(), String> {
    DesktopService::show_main_window(&app)
}
