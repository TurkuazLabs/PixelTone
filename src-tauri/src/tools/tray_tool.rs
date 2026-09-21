// # 📄 Dosya Yolu: pixeltone/src-tauri/src/tools/tray_tool.rs
// # 📌 Amac: Tauri sistem tepsisi ikonunu ve native menu adaptorunu kurmak
// # 📌 Tool - Rust
// # Version: 1.0.0
// # Aciklama: Tray ikonunu, menu elemanlarini ve native gorunum ayarlarini kurar; davranis karari Service katmaninda kalir
//
// Bagimli Oldugu Katman: Tool

use tauri::menu::{MenuBuilder, MenuItemBuilder};
use tauri::tray::TrayIconBuilder;

use crate::config::app_config::{
    TRAY_ID, TRAY_MENU_PICKER_ID, TRAY_MENU_QUIT_ID, TRAY_MENU_SHOW_ID,
};

pub struct TrayLabels<'a> {
    pub tooltip: &'a str,
    pub show: &'a str,
    pub picker: &'a str,
    pub quit: &'a str,
}

pub struct TrayTool;

impl TrayTool {
    pub fn setup(app: &mut tauri::App, labels: TrayLabels<'_>) -> tauri::Result<()> {
        let show_item = MenuItemBuilder::with_id(TRAY_MENU_SHOW_ID, labels.show).build(app)?;
        let picker_item =
            MenuItemBuilder::with_id(TRAY_MENU_PICKER_ID, labels.picker).build(app)?;
        let quit_item = MenuItemBuilder::with_id(TRAY_MENU_QUIT_ID, labels.quit).build(app)?;
        let menu = MenuBuilder::new(app)
            .items(&[&show_item, &picker_item, &quit_item])
            .build()?;

        TrayIconBuilder::with_id(TRAY_ID)
            .icon(tauri::include_image!("./icons/icon.png"))
            .menu(&menu)
            .show_menu_on_left_click(false)
            .tooltip(labels.tooltip)
            .build(app)?;

        Ok(())
    }
}
