// # 📄 Dosya Yolu: pixeltone/src-tauri/src/lib.rs
// # 📌 Amac: PixelTone Tauri runtime, plugin, tray, lifecycle ve komut kayitlarini baslatmak
// # 📌 Controller - Rust
// # Version: 1.0.0
// # Aciklama: Stable Desktop tray, close-to-tray, capture, settings, clipboard ve picker altyapisini runtime'a kaydeder
//
// Bagimli Oldugu Katman: Controller

pub mod config;
pub mod controllers;
pub mod language;
pub mod models;
pub mod repositories;
pub mod services;
pub mod tools;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_updater::Builder::new().build());

    #[cfg(any(target_os = "windows", target_os = "macos", target_os = "linux"))]
    let builder = builder.plugin(tauri_plugin_global_shortcut::Builder::new().build());

    builder
        .setup(|app| {
            controllers::desktop_controller::setup(app)?;
            Ok(())
        })
        .on_window_event(|window, event| {
            controllers::desktop_controller::handle_window_event(window, event);
        })
        .invoke_handler(tauri::generate_handler![
            controllers::color_controller::convert_hex_color,
            controllers::color_controller::capture_screen_color,
            controllers::palette_controller::save_palette,
            controllers::palette_controller::get_palette,
            controllers::palette_controller::update_palette,
            controllers::palette_controller::delete_palette,
            controllers::palette_controller::list_palettes,
            controllers::palette_controller::export_palette,
            controllers::palette_controller::import_palette,
            controllers::settings_controller::get_settings,
            controllers::settings_controller::save_settings,
            controllers::update_controller::check_and_install_update
        ])
        .run(tauri::generate_context!())
        .expect("PixelTone Tauri runtime baslatilamadi");
}
