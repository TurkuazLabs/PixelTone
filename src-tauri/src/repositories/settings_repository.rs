// # 📄 Dosya Yolu: pixeltone/src-tauri/src/repositories/settings_repository.rs
// # 📌 Amac: PixelTone masaustu ayarlarini local JSON storage alaninda saklamak
// # 📌 Repo - Rust
// # Version: 1.0.0
// # Aciklama: settings.json dosyasini okur, varsayilan ayarlari uretir ve guncel ayarlari yazar
//
// Bagimli Oldugu Katman: Repo

use std::fs;
use std::path::PathBuf;

use crate::config::app_config::{APP_FOLDER_NAME, SETTINGS_FILE_NAME};
use crate::models::settings::AppSettings;

pub struct SettingsRepository;

impl SettingsRepository {
    pub fn new() -> Self {
        Self
    }

    pub fn load(&self) -> Result<AppSettings, String> {
        let path = self.settings_path();

        if !path.exists() {
            return Ok(AppSettings::default());
        }

        let content = fs::read_to_string(path).map_err(|error| error.to_string())?;
        serde_json::from_str(&content).map_err(|error| error.to_string())
    }

    pub fn save(&self, settings: &AppSettings) -> Result<AppSettings, String> {
        let path = self.settings_path();

        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent).map_err(|error| error.to_string())?;
        }

        let content = serde_json::to_string_pretty(settings).map_err(|error| error.to_string())?;
        fs::write(path, content).map_err(|error| error.to_string())?;

        Ok(settings.clone())
    }

    fn settings_path(&self) -> PathBuf {
        dirs_next::data_local_dir()
            .or_else(dirs_next::data_dir)
            .unwrap_or_else(std::env::temp_dir)
            .join(APP_FOLDER_NAME)
            .join(SETTINGS_FILE_NAME)
    }
}
