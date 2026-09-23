// # 📄 Dosya Yolu: pixeltone/src-tauri/src/services/settings_service.rs
// # 📌 Amac: PixelTone masaustu ayar is kurallarini uygulamak
// # 📌 Service - Rust
// # Version: 1.2.0
// # Aciklama: Ayarlari normalize eder; picker, kopyalama, tema ve dil degerlerini dogrular
//
// Bagimli Oldugu Katman: Service

use crate::config::app_config::{
    COPY_FORMAT_HEX, COPY_FORMAT_RGB, ERROR_COPY_FORMAT_INVALID, ERROR_LANGUAGE_INVALID,
    ERROR_PICKER_SHORTCUT_EMPTY, ERROR_THEME_INVALID, LANGUAGE_EN, LANGUAGE_SYSTEM, LANGUAGE_TR,
    THEME_DARK, THEME_LIGHT, THEME_SYSTEM,
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
        settings.default_copy_format = settings.default_copy_format.trim().to_ascii_lowercase();
        settings.theme = settings.theme.trim().to_ascii_lowercase();
        settings.language = settings.language.trim().to_ascii_lowercase();

        if settings.picker_shortcut.is_empty() {
            return Err(ERROR_PICKER_SHORTCUT_EMPTY.to_string());
        }

        if settings.default_copy_format != COPY_FORMAT_HEX
            && settings.default_copy_format != COPY_FORMAT_RGB
        {
            return Err(ERROR_COPY_FORMAT_INVALID.to_string());
        }

        if !matches!(
            settings.theme.as_str(),
            THEME_SYSTEM | THEME_LIGHT | THEME_DARK
        ) {
            return Err(ERROR_THEME_INVALID.to_string());
        }

        if !matches!(
            settings.language.as_str(),
            LANGUAGE_SYSTEM | LANGUAGE_TR | LANGUAGE_EN
        ) {
            return Err(ERROR_LANGUAGE_INVALID.to_string());
        }

        Ok(settings)
    }
}

#[cfg(test)]
mod tests {
    use super::SettingsService;
    use crate::models::settings::AppSettings;

    fn settings(shortcut: &str, copy_format: &str, theme: &str, language: &str) -> AppSettings {
        AppSettings {
            close_to_tray: true,
            check_updates_on_start: true,
            picker_shortcut: shortcut.to_string(),
            default_copy_format: copy_format.to_string(),
            theme: theme.to_string(),
            language: language.to_string(),
        }
    }

    #[test]
    fn validate_normalizes_supported_settings() {
        let result = SettingsService::validate(settings(
            "  CommandOrControl+Shift+P  ",
            "RGB",
            " DARK ",
            " EN ",
        ))
        .expect("Settings normalize edilmeliydi");

        assert_eq!(result.picker_shortcut, "CommandOrControl+Shift+P");
        assert_eq!(result.default_copy_format, "rgb");
        assert_eq!(result.theme, "dark");
        assert_eq!(result.language, "en");
    }

    #[test]
    fn validate_rejects_empty_shortcut() {
        assert!(SettingsService::validate(settings("   ", "hex", "system", "system")).is_err());
    }

    #[test]
    fn validate_rejects_unknown_copy_format() {
        assert!(
            SettingsService::validate(settings("Ctrl+Shift+P", "lab", "system", "system")).is_err()
        );
    }

    #[test]
    fn validate_rejects_unknown_theme() {
        assert!(
            SettingsService::validate(settings("Ctrl+Shift+P", "hex", "blue", "system")).is_err()
        );
    }

    #[test]
    fn validate_rejects_unknown_language() {
        assert!(
            SettingsService::validate(settings("Ctrl+Shift+P", "hex", "system", "de")).is_err()
        );
    }
}
