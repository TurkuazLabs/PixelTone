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

#[cfg(test)]
mod tests {
    use super::SettingsService;
    use crate::models::settings::AppSettings;

    fn settings(shortcut: &str, copy_format: &str) -> AppSettings {
        AppSettings {
            close_to_tray: true,
            check_updates_on_start: true,
            picker_shortcut: shortcut.to_string(),
            default_copy_format: copy_format.to_string(),
        }
    }

    #[test]
    fn validate_trims_shortcut_and_normalizes_copy_format() {
        let result =
            SettingsService::validate(settings("  CommandOrControl+Shift+P  ", "RGB"))
                .expect("Settings normalize edilmeliydi");

        assert_eq!(result.picker_shortcut, "CommandOrControl+Shift+P");
        assert_eq!(result.default_copy_format, "rgb");
    }

    #[test]
    fn validate_rejects_empty_shortcut() {
        let result = SettingsService::validate(settings("   ", "hex"));

        assert!(result.is_err());
    }

    #[test]
    fn validate_rejects_unknown_copy_format() {
        let result = SettingsService::validate(settings("Ctrl+Shift+P", "lab"));

        assert!(result.is_err());
    }
}
