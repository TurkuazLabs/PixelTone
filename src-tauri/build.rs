// # 📄 Dosya Yolu: pixeltone/src-tauri/build.rs
// # 📌 Amac: Platform build hazirligini yapip Tauri build adimini baslatmak
// # 📌 Tool - Rust
// # Version: 1.0.2
// # Aciklama: Production derlemede gomulu arayuz protokolunu zorunlu tutup Tauri build sistemini cagirir
//
// Bagimli Oldugu Katman: Tool

fn main() {
    if std::env::var("PROFILE").as_deref() == Ok("release") && tauri_build::is_dev() {
        panic!(
            "PixelTone release build requires Tauri custom-protocol; use `npm run tauri build -- --no-bundle`"
        );
    }
    tauri_build::build();
}
