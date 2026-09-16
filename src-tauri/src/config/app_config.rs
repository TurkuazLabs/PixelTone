// # 📄 Dosya Yolu: pixeltone/src-tauri/src/config/app_config.rs
// # 📌 Amac: Rust tarafinda magic string kullanilmasini azaltmak
// # 📌 Config - Rust
// # Version: 0.2.0
// # Aciklama: Klasor, uzanti, capture sabitleri ve hata mesajlarini merkezi tutar
//
// Bagimli Oldugu Katman: Config

pub const APP_FOLDER_NAME: &str = "pixeltone";
pub const PALETTE_FOLDER_NAME: &str = "palettes";
pub const PALETTE_FILE_EXTENSION: &str = "json";
pub const DEFAULT_PALETTE_NAME: &str = "untitled-palette";

pub const CAPTURE_SOURCE_XCAP: &str = "xcap";
pub const PLATFORM_WINDOWS: &str = "windows";
pub const PLATFORM_MACOS: &str = "macos";
pub const PLATFORM_LINUX_X11: &str = "linux-x11";
pub const PLATFORM_LINUX_WAYLAND: &str = "linux-wayland";
pub const PLATFORM_UNKNOWN: &str = "unknown";
pub const SESSION_TYPE_WAYLAND: &str = "wayland";
pub const SESSION_TYPE_X11: &str = "x11";
pub const ENV_XDG_SESSION_TYPE: &str = "XDG_SESSION_TYPE";
pub const MAGNIFIER_SIZE: u32 = 9;

pub const ERROR_INVALID_HEX: &str = "Gecerli 6 haneli HEX renk girin.";
pub const ERROR_CURSOR_POSITION: &str = "Global cursor konumu okunamadi.";
pub const ERROR_MONITOR_NOT_FOUND: &str = "Cursor konumundaki monitor bulunamadi.";
pub const ERROR_SCREEN_CAPTURE: &str = "Ekran goruntusu alinamadi.";
pub const ERROR_SCREEN_SAMPLE: &str = "Cursor konumundaki piksel okunamadi.";
