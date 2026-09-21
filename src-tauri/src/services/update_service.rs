// # 📄 Dosya Yolu: pixeltone/src-tauri/src/services/update_service.rs
// # 📌 Amac: PixelTone imzali otomatik guncelleme is kurallarini yonetmek
// # 📌 Service - Rust
// # Version: 1.0.0
// # Aciklama: GitHub Releases latest.json endpointini kontrol eder, imzayi dogrular, update paketini kurar ve uygulamayi yeniden baslatir
//
// Bagimli Oldugu Katman: Service

use tauri::AppHandle;
use tauri_plugin_updater::UpdaterExt;
use url::Url;

use crate::config::app_config::{
    UPDATER_ENDPOINT, UPDATER_PUBLIC_KEY_PLACEHOLDER,
};
use crate::models::update::UpdateResult;

const UPDATER_PUBLIC_KEY: &str = include_str!("../../updater.pubkey");

pub struct UpdateService;

impl UpdateService {
    pub async fn check_and_install(app: AppHandle) -> Result<UpdateResult, String> {
        let current_version = app.package_info().version.to_string();
        let public_key = UPDATER_PUBLIC_KEY.trim();

        if public_key.is_empty() || public_key == UPDATER_PUBLIC_KEY_PLACEHOLDER {
            return Ok(UpdateResult {
                configured: false,
                update_available: false,
                installed: false,
                current_version,
                latest_version: String::new(),
                message: "PixelTone updater signing public key yapilandirilmadi.".to_string(),
            });
        }

        let endpoint = Url::parse(UPDATER_ENDPOINT).map_err(|error| error.to_string())?;
        let updater = app
            .updater_builder()
            .pubkey(public_key)
            .endpoints(vec![endpoint])
            .map_err(|error| error.to_string())?
            .build()
            .map_err(|error| error.to_string())?;

        let Some(update) = updater.check().await.map_err(|error| error.to_string())? else {
            return Ok(UpdateResult {
                configured: true,
                update_available: false,
                installed: false,
                current_version: current_version.clone(),
                latest_version: current_version,
                message: "PixelTone guncel.".to_string(),
            });
        };

        let latest_version = update.version.clone();

        update
            .download_and_install(
                |_chunk_length, _content_length| {},
                || {},
            )
            .await
            .map_err(|error| error.to_string())?;

        let result = UpdateResult {
            configured: true,
            update_available: true,
            installed: true,
            current_version,
            latest_version,
            message: "PixelTone guncellemesi kuruldu. Uygulama yeniden baslatiliyor.".to_string(),
        };

        app.restart();

        #[allow(unreachable_code)]
        Ok(result)
    }
}
