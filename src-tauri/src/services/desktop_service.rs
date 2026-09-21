// # 📄 Dosya Yolu: pixeltone/src-tauri/src/services/desktop_service.rs
// # 📌 Amac: Tray ve pencere kapatma davranisi icin masaustu is kurallarini yonetmek
// # 📌 Service - Rust
// # Version: 1.0.0
// # Aciklama: Tray kurulumunu koordine eder ve close-to-tray ayarina gore ana pencere kapatma davranisini belirler
//
// Bagimli Oldugu Katman: Service

use tauri::WindowEvent;

use crate::config::app_config::MAIN_WINDOW_LABEL;
use crate::language::tr;
use crate::repositories::settings_repository::SettingsRepository;
use crate::tools::tray_tool::{TrayLabels, TrayTool};
use crate::tools::window_tool::WindowTool;

pub struct DesktopService;

impl DesktopService {
    pub fn setup(app: &mut tauri::App) -> tauri::Result<()> {
        TrayTool::setup(
            app,
            TrayLabels {
                tooltip: tr::TRAY_TOOLTIP,
                show: tr::TRAY_SHOW,
                picker: tr::TRAY_PICKER,
                quit: tr::TRAY_QUIT,
            },
        )
    }

    pub fn handle_window_event(window: &tauri::Window, event: &WindowEvent) {
        if window.label() != MAIN_WINDOW_LABEL {
            return;
        }

        if let WindowEvent::CloseRequested { api, .. } = event {
            let settings = SettingsRepository::new().load().unwrap_or_default();

            if settings.close_to_tray {
                api.prevent_close();
                let _ = WindowTool::hide_native(window);
            } else {
                window.app_handle().exit(0);
            }
        }
    }
}
