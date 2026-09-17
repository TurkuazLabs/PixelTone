// # 📄 Dosya Yolu: pixeltone/src-tauri/build.rs
// # 📌 Amac: Platform build hazirligini yapip Tauri build adimini baslatmak
// # 📌 Tool - Rust
// # Version: 0.3.0
// # Aciklama: Windows icin PNG kaynaktan modern coklu boyutlu ICO uretir ve Tauri build sistemini cagirir
//
// Bagimli Oldugu Katman: Tool

#[cfg(target_os = "windows")]
#[path = "src/config/build_config.rs"]
mod build_config;

#[cfg(target_os = "windows")]
fn generate_windows_icon() -> Result<(), Box<dyn std::error::Error>> {
    use std::fs::File;

    use ico::{IconDir, IconDirEntry, IconImage, ResourceType};
    use image::imageops::FilterType;

    let source = image::open(build_config::WINDOWS_ICON_SOURCE)?;
    let mut icon_directory = IconDir::new(ResourceType::Icon);

    for &size in build_config::WINDOWS_ICON_SIZES {
        let resized = source
            .resize_exact(size, size, FilterType::Lanczos3)
            .to_rgba8();
        let icon_image = IconImage::from_rgba_data(size, size, resized.into_raw());
        let entry = IconDirEntry::encode(&icon_image)?;
        icon_directory.add_entry(entry);
    }

    let icon_file = File::create(build_config::WINDOWS_ICON_TARGET)?;
    icon_directory.write(icon_file)?;

    Ok(())
}

fn main() {
    #[cfg(target_os = "windows")]
    generate_windows_icon().expect("Windows ICO dosyasi uretilemedi");

    tauri_build::build();
}
