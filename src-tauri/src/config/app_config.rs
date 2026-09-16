// # 📄 Dosya Yolu: pixeltone/src-tauri/src/config/app_config.rs
// # 📌 Amac: Rust tarafinda magic string kullanilmasini azaltmak
// # 📌 Config - Rust
// # Version: 0.1.0
// # Aciklama: Klasor, uzanti ve hata sabitlerini merkezi tutar
//
// Bagimli Oldugu Katman: Config

pub const APP_FOLDER_NAME: &str = "pixeltone";
pub const PALETTE_FOLDER_NAME: &str = "palettes";
pub const PALETTE_FILE_EXTENSION: &str = "json";
pub const DEFAULT_PALETTE_NAME: &str = "untitled-palette";
pub const ERROR_INVALID_HEX: &str = "Gecerli 6 haneli HEX renk girin.";
pub const ERROR_CAPTURE_NOT_IMPLEMENTED: &str =
    "Ekran yakalama adaptor implementasyonu v0.2.0 icin planlandi.";
