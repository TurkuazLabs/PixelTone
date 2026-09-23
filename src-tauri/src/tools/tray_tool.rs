// # 📄 Dosya Yolu: pixeltone/src-tauri/src/tools/tray_tool.rs
// # 📌 Amac: Tauri system tray ikonunu ve native menu adaptorunu kurmak/guncellemek
// # 📌 Tool - Rust
// # Version: 1.2.0
// # Aciklama: Tray ikonunu kurar; runtime dil degisiminde menu ve tooltip metinlerini yeniden uygular
//
// Bagimli Oldugu Katman: Tool

use tauri::menu::{MenuBuilder, MenuItemBuilder};
use tauri::tray::TrayIconBuilder;
use tauri::{AppHandle, Manager};

use crate::config::app_config::{
    TRAY_ID, TRAY_MENU_PICKER_ID, TRAY_MENU_QUIT_ID, TRAY_MENU_SHOW_ID,
};

#[derive(Clone, Copy)]
pub struct TrayLabels<'a> {
    pub tooltip: &'a str,
    pub show: &'a str,
    pub picker: &'a str,
    pub quit: &'a str,
}

pub struct TrayTool;

impl TrayTool {
    pub fn setup(app: &mut tauri::App, labels: TrayLabels<'_>) -> tauri::Result<()> {
        let menu = Self::build_menu(app, labels)?;

        TrayIconBuilder::with_id(TRAY_ID)
            .icon(tauri::include_image!("./icons/icon.png"))
            .menu(&menu)
            .show_menu_on_left_click(false)
            .tooltip(labels.tooltip)
            .build(app)?;

        Ok(())
    }

    pub fn update(app: &AppHandle, labels: TrayLabels<'_>) -> tauri::Result<()> {
        let menu = Self::build_menu(app, labels)?;

        if let Some(tray) = app.tray_by_id(TRAY_ID) {
            tray.set_menu(Some(menu))?;
            tray.set_tooltip(Some(labels.tooltip))?;
        }

        Ok(())
    }

    fn build_menu<R: tauri::Runtime, M: Manager<R>>(
        manager: &M,
        labels: TrayLabels<'_>,
    ) -> tauri::Result<tauri::menu::Menu<R>> {
        let show_item = MenuItemBuilder::with_id(TRAY_MENU_SHOW_ID, labels.show).build(manager)?;
        let picker_item =
            MenuItemBuilder::with_id(TRAY_MENU_PICKER_ID, labels.picker).build(manager)?;
        let quit_item = MenuItemBuilder::with_id(TRAY_MENU_QUIT_ID, labels.quit).build(manager)?;

        MenuBuilder::new(manager)
            .items(&[&show_item, &picker_item, &quit_item])
            .build()
    }
}
