// # 📄 Dosya Yolu: pixeltone/src-tauri/src/models/settings.rs
// # 📌 Amac: PixelTone masaustu ayar modelini tanimlamak
// # 📌 Model - Rust
// # Version: 1.2.0
// # Aciklama: Tray, updater, picker, tema ve dil tercihlerini geriye uyumlu serde varsayilanlariyla tasir
//
// Bagimli Oldugu Katman: Repo

use serde::{Deserialize, Serialize};

use crate::config::app_config::{
    COPY_FORMAT_HEX, DEFAULT_CHECK_UPDATES_ON_START, DEFAULT_CLOSE_TO_TRAY, DEFAULT_LANGUAGE,
    DEFAULT_PICKER_SHORTCUT, DEFAULT_THEME,
};

fn default_close_to_tray() -> bool {
    DEFAULT_CLOSE_TO_TRAY
}

fn default_check_updates_on_start() -> bool {
    DEFAULT_CHECK_UPDATES_ON_START
}

fn default_picker_shortcut() -> String {
    DEFAULT_PICKER_SHORTCUT.to_string()
}

fn default_copy_format() -> String {
    COPY_FORMAT_HEX.to_string()
}

fn default_theme() -> String {
    DEFAULT_THEME.to_string()
}

fn default_language() -> String {
    DEFAULT_LANGUAGE.to_string()
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppSettings {
    #[serde(default = "default_close_to_tray")]
    pub close_to_tray: bool,
    #[serde(default = "default_check_updates_on_start")]
    pub check_updates_on_start: bool,
    #[serde(default = "default_picker_shortcut")]
    pub picker_shortcut: String,
    #[serde(default = "default_copy_format")]
    pub default_copy_format: String,
    #[serde(default = "default_theme")]
    pub theme: String,
    #[serde(default = "default_language")]
    pub language: String,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            close_to_tray: DEFAULT_CLOSE_TO_TRAY,
            check_updates_on_start: DEFAULT_CHECK_UPDATES_ON_START,
            picker_shortcut: DEFAULT_PICKER_SHORTCUT.to_string(),
            default_copy_format: COPY_FORMAT_HEX.to_string(),
            theme: DEFAULT_THEME.to_string(),
            language: DEFAULT_LANGUAGE.to_string(),
        }
    }
}
