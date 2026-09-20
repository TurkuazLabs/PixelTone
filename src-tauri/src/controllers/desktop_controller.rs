// # 📄 Dosya Yolu: pixeltone/src-tauri/src/controllers/desktop_controller.rs
// # 📌 Amac: Tauri masaustu lifecycle olaylarini DesktopService katmanina aktarmak
// # 📌 Controller - Rust
// # Version: 1.0.0
// # Aciklama: Setup ve native window eventlerini is kurali uygulamadan Service katmanina yonlendirir
//
// Bagimli Oldugu Katman: Controller

use tauri::WindowEvent;

use crate::services::desktop_service::DesktopService;

pub fn setup(app: &mut tauri::App) -> tauri::Result<()> {
    DesktopService::setup(app)
}

pub fn handle_window_event(window: &tauri::Window, event: &WindowEvent) {
    DesktopService::handle_window_event(window, event);
}
