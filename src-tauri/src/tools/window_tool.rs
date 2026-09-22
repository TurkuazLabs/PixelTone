// # 📄 Dosya Yolu: pixeltone/src-tauri/src/tools/window_tool.rs
// # 📌 Amac: Native masaustu pencere islemlerini Service ve tray adaptorlerinden soyutlamak
// # 📌 Tool - Rust
// # Version: 1.0.0
// # Aciklama: Native Window gizleme ile WebviewWindow gosterme, unminimize ve odaklama islemlerini saglar
//
// Bagimli Oldugu Katman: Tool

use tauri::{WebviewWindow, Window};

pub struct WindowTool;

impl WindowTool {
    pub fn hide_native(window: &Window) -> Result<(), String> {
        window.hide().map_err(|error| error.to_string())
    }

    pub fn show_and_focus_webview(window: &WebviewWindow) -> Result<(), String> {
        window.unminimize().map_err(|error| error.to_string())?;
        window.show().map_err(|error| error.to_string())?;
        window.set_focus().map_err(|error| error.to_string())
    }
}
