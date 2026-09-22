// # 📄 Dosya Yolu: pixeltone/src-tauri/src/main.rs
// # 📌 Amac: PixelTone native uygulama giris noktasini calistirmak
// # 📌 Controller - Rust
// # Version: 0.1.1
// # Aciklama: Tauri runtime girisini lib.rs icindeki run fonksiyonuna aktarir ve Windows release buildinde console penceresini gizler
//
// Bagimli Oldugu Katman: Controller

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    pixeltone_lib::run();
}
