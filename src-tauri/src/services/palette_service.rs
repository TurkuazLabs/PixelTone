// # 📄 Dosya Yolu: pixeltone/src-tauri/src/services/palette_service.rs
// # 📌 Amac: Palet is kurallarini yonetmek
// # 📌 Service - Rust
// # Version: 0.2.1
// # Aciklama: Palet adini dogrular ve repository katmanini cagirir
//
// Bagimli Oldugu Katman: Service

use crate::config::app_config::DEFAULT_PALETTE_NAME;
use crate::models::palette::{PaletteSummary, SavePaletteRequest, SavePaletteResponse};
use crate::repositories::palette_repository::PaletteRepository;

pub struct PaletteService {
    repository: PaletteRepository,
}

impl PaletteService {
    pub fn new(repository: PaletteRepository) -> Self {
        Self { repository }
    }

    pub fn save_palette(
        &self,
        mut request: SavePaletteRequest,
    ) -> Result<SavePaletteResponse, String> {
        if request.name.trim().is_empty() {
            request.name = DEFAULT_PALETTE_NAME.to_string();
        }

        self.repository.save(request)
    }

    pub fn list_palettes(&self) -> Result<Vec<PaletteSummary>, String> {
        self.repository.list()
    }
}
