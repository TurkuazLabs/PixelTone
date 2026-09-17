// # 📄 Dosya Yolu: pixeltone/src-tauri/src/controllers/palette_controller.rs
// # 📌 Amac: Palet ile ilgili Tauri komut isteklerini almak
// # 📌 Controller - Rust
// # Version: 0.3.0
// # Aciklama: Kaydetme, listeleme, import ve export isteklerini service katmanina aktarir
//
// Bagimli Oldugu Katman: Controller

use crate::models::palette::{PaletteSummary, SavePaletteRequest, SavePaletteResponse};
use crate::models::palette_transfer::{
    ExportPaletteRequest, ExportPaletteResponse, ImportPaletteRequest,
};
use crate::repositories::palette_repository::PaletteRepository;
use crate::services::palette_service::PaletteService;

#[tauri::command]
pub fn save_palette(request: SavePaletteRequest) -> Result<SavePaletteResponse, String> {
    PaletteService::new(PaletteRepository::new()).save_palette(request)
}

#[tauri::command]
pub fn list_palettes(project: String) -> Result<Vec<PaletteSummary>, String> {
    PaletteService::new(PaletteRepository::new()).list_palettes(project)
}

#[tauri::command]
pub fn export_palette(request: ExportPaletteRequest) -> Result<ExportPaletteResponse, String> {
    PaletteService::new(PaletteRepository::new()).export_palette(request)
}

#[tauri::command]
pub fn import_palette(request: ImportPaletteRequest) -> Result<SavePaletteResponse, String> {
    PaletteService::new(PaletteRepository::new()).import_palette(request)
}
