// # 📄 Dosya Yolu: pixeltone/src-tauri/src/lib.rs
// # 📌 Amac: PixelTone Tauri runtime ve komut kayitlarini baslatmak
// # 📌 Controller - Rust
// # Version: 0.1.0
// # Aciklama: Rust modullerini yukler ve Tauri invoke handler listesini tanimlar
//
// Bagimli Oldugu Katman: Controller

pub mod config;
pub mod controllers;
pub mod models;
pub mod repositories;
pub mod services;
pub mod tools;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            controllers::color_controller::convert_hex_color,
            controllers::color_controller::capture_screen_color,
            controllers::palette_controller::save_palette,
            controllers::palette_controller::list_palettes
        ])
        .run(tauri::generate_context!())
        .expect("PixelTone Tauri runtime baslatilamadi");
}
