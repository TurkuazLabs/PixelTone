// # 📄 Dosya Yolu: pixeltone/src-tauri/src/controllers/palette_controller.rs
// # 📌 Amac: Palet ile ilgili Tauri komut isteklerini almak
// # 📌 Controller - Rust
// # Version: 0.1.0
// # Aciklama: Palet kaydetme ve listeleme isteklerini service katmanina aktarir
//
// Bagimli Oldugu Katman: Controller

use crate::models::palette::{PaletteSummary, SavePaletteRequest, SavePaletteResponse};
use crate::repositories::palette_repository::PaletteRepository;
use crate::services::palette_service::PaletteService;

#[tauri::command]
pub fn save_palette(request: SavePaletteRequest) -> Result<SavePaletteResponse, String> {
    let repository = PaletteRepository::new();
    let service = PaletteService::new(repository);
    service.save_palette(request)
}

#[tauri::command]
pub fn list_palettes() -> Result<Vec<PaletteSummary>, String> {
    let repository = PaletteRepository::new();
    let service = PaletteService::new(repository);
    service.list_palettes()
}
