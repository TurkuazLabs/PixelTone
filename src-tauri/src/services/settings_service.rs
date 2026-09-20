// # 📄 Dosya Yolu: pixeltone/src-tauri/src/services/settings_service.rs
// # 📌 Amac: PixelTone masaustu ayar is kurallarini uygulamak
// # 📌 Service - Rust
// # Version: 1.0.0
// # Aciklama: Ayarlari normalize eder, picker kisayolu ve kopyalama formatini dogrular
//
// Bagimli Oldugu Katman: Service

use crate::config::app_config::{
    COPY_FORMAT_HEX, COPY_FORMAT_RGB, ERROR_COPY_FORMAT_INVALID,
    ERROR_PICKER_SHORTCUT_EMPTY,
};
use crate::models::settings::AppSettings;
use crate::repositories::settings_repository::SettingsRepository;

pub struct SettingsService {
    repository: SettingsRepository,
}

impl SettingsService {
    pub fn new(repository: SettingsRepository) -> Self {
        Self { repository }
    }

    pub fn get_settings(&self) -> Result<AppSettings, String> {
        let settings = self.repository.load()?;
        Self::validate(settings)
    }

    pub fn save_settings(&self, settings: AppSettings) -> Result<AppSettings, String> {
        let settings = Self::validate(settings)?;
        self.repository.save(&settings)
    }

    fn validate(mut settings: AppSettings) -> Result<AppSettings, String> {
        settings.picker_shortcut = settings.picker_shortcut.trim().to_string();
        settings.default_copy_format = settings
            .default_copy_format
            .trim()
            .to_ascii_lowercase();

        if settings.picker_shortcut.is_empty() {
            return Err(ERROR_PICKER_SHORTCUT_EMPTY.to_string());
        }

        if settings.default_copy_format != COPY_FORMAT_HEX
            && settings.default_copy_format != COPY_FORMAT_RGB
        {
            return Err(ERROR_COPY_FORMAT_INVALID.to_string());
        }

        Ok(settings)
    }
}
