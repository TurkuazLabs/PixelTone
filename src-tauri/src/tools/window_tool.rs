// # 📄 Dosya Yolu: pixeltone/src-tauri/src/tools/window_tool.rs
// # 📌 Amac: Native masaustu pencere islemlerini Service ve tray adaptorlerinden soyutlamak
// # 📌 Tool - Rust
// # Version: 1.1.0
// # Aciklama: Native gizleme ile WebviewWindow bulma, gosterme, odaklama ve kapatma islemlerini saglar
//
// Bagimli Oldugu Katman: Tool

use tauri::{AppHandle, Manager, WebviewWindow, Window};

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

    pub fn show_and_focus_by_label(app: &AppHandle, label: &str) -> Result<(), String> {
        let window = app
            .get_webview_window(label)
            .ok_or_else(|| format!("Webview window bulunamadi: {label}"))?;

        Self::show_and_focus_webview(&window)
    }

    pub fn close_by_label(app: &AppHandle, label: &str) -> Result<(), String> {
        let window = app
            .get_webview_window(label)
            .ok_or_else(|| format!("Webview window bulunamadi: {label}"))?;

        window.close().map_err(|error| error.to_string())
    }
}
