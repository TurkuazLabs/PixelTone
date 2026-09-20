// # 📄 Dosya Yolu: pixeltone/src-tauri/src/config/build_config.rs
// # 📌 Amac: Platform build sirasinda kullanilan icon ayarlarini merkezi tutmak
// # 📌 Config - Rust
// # Version: 0.3.0
// # Aciklama: Windows ICO kaynak, hedef ve boyut ayarlarini build.rs icin saglar
//
// Bagimli Oldugu Katman: Config

pub const WINDOWS_ICON_SOURCE: &str = "icons/icon.png";
pub const WINDOWS_ICON_TARGET: &str = "icons/icon.ico";
pub const WINDOWS_ICON_SIZES: &[u32] = &[16, 24, 32, 48, 64, 128, 256];
