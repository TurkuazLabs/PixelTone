// # 📄 Dosya Yolu: pixeltone/src-tauri/src/tools/tray_tool.rs
// # 📌 Amac: Tauri sistem tepsisi ikonunu ve native menu adaptorunu kurmak
// # 📌 Tool - Rust
// # Version: 1.0.0
// # Aciklama: Tray menu, sol tik pencere acma, picker event iletimi ve cikis platform islemlerini yonetir
//
// Bagimli Oldugu Katman: Tool

use tauri::menu::{MenuBuilder, MenuItemBuilder};
use tauri::tray::{
    MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent,
};
use tauri::{Emitter, Manager};

use crate::config::app_config::{
    MAIN_WINDOW_LABEL, TRAY_ID, TRAY_MENU_PICKER_ID, TRAY_MENU_QUIT_ID,
    TRAY_MENU_SHOW_ID, TRAY_PICKER_EVENT,
};
use crate::tools::window_tool::WindowTool;

pub struct TrayLabels<'a> {
    pub tooltip: &'a str,
    pub show: &'a str,
    pub picker: &'a str,
    pub quit: &'a str,
}

pub struct TrayTool;

impl TrayTool {
    pub fn setup(app: &mut tauri::App, labels: TrayLabels<'_>) -> tauri::Result<()> {
        let show_item =
            MenuItemBuilder::with_id(TRAY_MENU_SHOW_ID, labels.show).build(app)?;
        let picker_item =
            MenuItemBuilder::with_id(TRAY_MENU_PICKER_ID, labels.picker).build(app)?;
        let quit_item =
            MenuItemBuilder::with_id(TRAY_MENU_QUIT_ID, labels.quit).build(app)?;
        let menu = MenuBuilder::new(app)
            .items(&[&show_item, &picker_item, &quit_item])
            .build()?;

        let mut tray = TrayIconBuilder::with_id(TRAY_ID)
            .menu(&menu)
            .show_menu_on_left_click(false)
            .tooltip(labels.tooltip)
            .on_menu_event(|app, event| match event.id().as_ref() {
                TRAY_MENU_SHOW_ID => {
                    Self::show_main_window(app);
                }
                TRAY_MENU_PICKER_ID => {
                    let _ = app.emit_to(MAIN_WINDOW_LABEL, TRAY_PICKER_EVENT, ());
                }
                TRAY_MENU_QUIT_ID => {
                    app.exit(0);
                }
                _ => {}
            })
            .on_tray_icon_event(|tray, event| {
                if let TrayIconEvent::Click {
                    button: MouseButton::Left,
                    button_state: MouseButtonState::Up,
                    ..
                } = event
                {
                    Self::show_main_window(tray.app_handle());
                }
            });

        if let Some(icon) = app.default_window_icon() {
            tray = tray.icon(icon.clone());
        }

        tray.build(app)?;
        Ok(())
    }

    fn show_main_window(app: &tauri::AppHandle) {
        if let Some(window) = app.get_webview_window(MAIN_WINDOW_LABEL) {
            let _ = WindowTool::show_and_focus_webview(&window);
        }
    }
}
