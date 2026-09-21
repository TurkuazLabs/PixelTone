// # 📄 Dosya Yolu: pixeltone/src-tauri/src/services/desktop_service.rs
// # 📌 Amac: Tray ve pencere kapatma davranisi icin masaustu is kurallarini yonetmek
// # 📌 Service - Rust
// # Version: 1.0.0
// # Aciklama: Tray kurulumunu koordine eder, tray aksiyonlarini uygular ve close-to-tray davranisini yonetir
//
// Bagimli Oldugu Katman: Service

use tauri::menu::MenuEvent;
use tauri::tray::{MouseButton, MouseButtonState, TrayIconEvent};
use tauri::{Emitter, Manager, WindowEvent};

use crate::config::app_config::{
    MAIN_WINDOW_LABEL, TRAY_MENU_PICKER_ID, TRAY_MENU_QUIT_ID, TRAY_MENU_SHOW_ID,
    TRAY_PICKER_EVENT,
};
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
        )?;

        app.on_menu_event(Self::handle_menu_event);
        app.on_tray_icon_event(Self::handle_tray_icon_event);

        Ok(())
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

    fn handle_menu_event(app: &tauri::AppHandle, event: MenuEvent) {
        match event.id().as_ref() {
            TRAY_MENU_SHOW_ID => Self::show_main_window(app),
            TRAY_MENU_PICKER_ID => {
                let _ = app.emit_to(MAIN_WINDOW_LABEL, TRAY_PICKER_EVENT, ());
            }
            TRAY_MENU_QUIT_ID => app.exit(0),
            _ => {}
        }
    }

    fn handle_tray_icon_event(app: &tauri::AppHandle, event: TrayIconEvent) {
        if let TrayIconEvent::Click {
            button: MouseButton::Left,
            button_state: MouseButtonState::Up,
            ..
        } = event
        {
            Self::show_main_window(app);
        }
    }

    fn show_main_window(app: &tauri::AppHandle) {
        if let Some(window) = app.get_webview_window(MAIN_WINDOW_LABEL) {
            let _ = WindowTool::show_and_focus_webview(&window);
        }
    }
}
