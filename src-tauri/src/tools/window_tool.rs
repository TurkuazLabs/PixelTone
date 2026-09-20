// # 📄 Dosya Yolu: pixeltone/src-tauri/src/tools/window_tool.rs
// # 📌 Amac: Native masaustu pencere islemlerini Service katmanindan soyutlamak
// # 📌 Tool - Rust
// # Version: 1.0.0
// # Aciklama: Ana pencereyi gizleme, gosterme, unminimize etme ve odaklama adaptorudur
//
// Bagimli Oldugu Katman: Tool

use tauri::WebviewWindow;

pub struct WindowTool;

impl WindowTool {
    pub fn hide(window: &WebviewWindow) -> Result<(), String> {
        window.hide().map_err(|error| error.to_string())
    }

    pub fn show_and_focus(window: &WebviewWindow) -> Result<(), String> {
        window.unminimize().map_err(|error| error.to_string())?;
        window.show().map_err(|error| error.to_string())?;
        window.set_focus().map_err(|error| error.to_string())
    }
}
