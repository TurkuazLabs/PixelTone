// # 📄 Dosya Yolu: pixeltone/src-tauri/src/services/desktop_service.rs
// # 📌 Amac: Tray, dil ve picker ana pencere lifecycle is kurallarini yonetmek
// # 📌 Service - Rust
// # Version: 1.2.1
// # Aciklama: Tray dilini yonetir, close-to-tray davranisini uygular ve picker sirasinda ana pencereyi gizleyip geri getirir
//
// Bagimli Oldugu Katman: Service

use tauri::menu::MenuEvent;
use tauri::tray::{MouseButton, MouseButtonState, TrayIconEvent};
use tauri::{Emitter, WindowEvent};

use crate::config::app_config::{
    LANGUAGE_EN, LANGUAGE_SYSTEM, LANGUAGE_TR, MAIN_WINDOW_LABEL, TRAY_MENU_PICKER_ID,
    TRAY_MENU_QUIT_ID, TRAY_MENU_SHOW_ID, TRAY_PICKER_EVENT,
};
use crate::language::{en, tr};
use crate::repositories::settings_repository::SettingsRepository;
use crate::tools::tray_tool::{TrayLabels, TrayTool};
use crate::tools::window_tool::WindowTool;

pub struct DesktopService;

impl DesktopService {
    pub fn setup(app: &mut tauri::App) -> tauri::Result<()> {
        let settings = SettingsRepository::new().load().unwrap_or_default();
        TrayTool::setup(app, Self::tray_labels(&settings.language))?;

        app.on_menu_event(Self::handle_menu_event);
        app.on_tray_icon_event(Self::handle_tray_icon_event);

        Ok(())
    }

    pub fn refresh_tray(app: &tauri::AppHandle, language: &str) -> tauri::Result<()> {
        TrayTool::update(app, Self::tray_labels(language))
    }

    pub fn hide_main_window(app: &tauri::AppHandle) -> Result<(), String> {
        WindowTool::hide_by_label(app, MAIN_WINDOW_LABEL)
    }

    pub fn show_main_window(app: &tauri::AppHandle) -> Result<(), String> {
        WindowTool::show_and_focus_by_label(app, MAIN_WINDOW_LABEL)
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

    fn resolve_language(language: &str) -> &'static str {
        match language {
            LANGUAGE_TR => LANGUAGE_TR,
            LANGUAGE_EN => LANGUAGE_EN,
            LANGUAGE_SYSTEM => {
                let locale = sys_locale::get_locale()
                    .unwrap_or_else(|| LANGUAGE_EN.to_string())
                    .to_ascii_lowercase();

                if locale.starts_with("tr") {
                    LANGUAGE_TR
                } else {
                    LANGUAGE_EN
                }
            }
            _ => LANGUAGE_EN,
        }
    }

    fn tray_labels(language: &str) -> TrayLabels<'static> {
        if Self::resolve_language(language) == LANGUAGE_TR {
            TrayLabels {
                tooltip: tr::TRAY_TOOLTIP,
                show: tr::TRAY_SHOW,
                picker: tr::TRAY_PICKER,
                quit: tr::TRAY_QUIT,
            }
        } else {
            TrayLabels {
                tooltip: en::TRAY_TOOLTIP,
                show: en::TRAY_SHOW,
                picker: en::TRAY_PICKER,
                quit: en::TRAY_QUIT,
            }
        }
    }

    fn handle_menu_event(app: &tauri::AppHandle, event: MenuEvent) {
        match event.id().as_ref() {
            TRAY_MENU_SHOW_ID => Self::show_main_window_from_tray(app),
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
            Self::show_main_window_from_tray(app);
        }
    }

    fn show_main_window_from_tray(app: &tauri::AppHandle) {
        let _ = Self::show_main_window(app);
    }
}
