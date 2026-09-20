// # 📄 Dosya Yolu: pixeltone/src-tauri/src/services/palette_service.rs
// # 📌 Amac: Proje bazli palet, import ve export is kurallarini yonetmek
// # 📌 Service - Rust
// # Version: 0.3.0
// # Aciklama: Paletleri dogrular, repository ve format tool akislarini koordine eder
//
// Bagimli Oldugu Katman: Service

use crate::config::app_config::{
    DEFAULT_PALETTE_NAME, DEFAULT_PROJECT_NAME, ERROR_IMPORT_EMPTY, ERROR_PALETTE_EMPTY,
    ERROR_TRANSFER_VERSION, PALETTE_TRANSFER_VERSION,
};
use crate::models::palette::{PaletteSummary, SavePaletteRequest, SavePaletteResponse};
use crate::models::palette_transfer::{
    ExportPaletteRequest, ExportPaletteResponse, ImportPaletteRequest, PaletteTransferFile,
};
use crate::repositories::palette_repository::PaletteRepository;
use crate::services::color_service::ColorService;
use crate::tools::palette_format_tool::PaletteFormatTool;

pub struct PaletteService {
    repository: PaletteRepository,
}

impl PaletteService {
    pub fn new(repository: PaletteRepository) -> Self {
        Self { repository }
    }

    pub fn save_palette(&self, request: SavePaletteRequest) -> Result<SavePaletteResponse, String> {
        self.repository.save(Self::prepare_palette(request)?)
    }

    pub fn list_palettes(&self, project: String) -> Result<Vec<PaletteSummary>, String> {
        let project = Self::normalize_project(project);
        self.repository.list(&project)
    }

    pub fn export_palette(
        &self,
        request: ExportPaletteRequest,
    ) -> Result<ExportPaletteResponse, String> {
        let prepared = Self::prepare_palette(SavePaletteRequest {
            project: request.project,
            name: request.name,
            colors: request.colors,
        })?;
        let transfer = PaletteTransferFile {
            version: PALETTE_TRANSFER_VERSION.to_string(),
            project: prepared.project,
            name: prepared.name,
            colors: prepared.colors,
        };

        PaletteFormatTool::export(&transfer, &request.format)
    }

    pub fn import_palette(
        &self,
        request: ImportPaletteRequest,
    ) -> Result<SavePaletteResponse, String> {
        if request.content.trim().is_empty() {
            return Err(ERROR_IMPORT_EMPTY.to_string());
        }

        let transfer = PaletteFormatTool::import_yaml(&request.content)?;

        if transfer.version != PALETTE_TRANSFER_VERSION {
            return Err(ERROR_TRANSFER_VERSION.to_string());
        }

        self.save_palette(SavePaletteRequest {
            project: transfer.project,
            name: transfer.name,
            colors: transfer.colors,
        })
    }

    fn prepare_palette(mut request: SavePaletteRequest) -> Result<SavePaletteRequest, String> {
        request.project = Self::normalize_project(request.project);

        if request.name.trim().is_empty() {
            request.name = DEFAULT_PALETTE_NAME.to_string();
        } else {
            request.name = request.name.trim().to_string();
        }

        if request.colors.is_empty() {
            return Err(ERROR_PALETTE_EMPTY.to_string());
        }

        for color in &mut request.colors {
            let converted = ColorService::convert_from_hex(&color.hex)?;
            color.hex = converted.hex;

            if color.name.trim().is_empty() {
                color.name = color.hex.clone();
            } else {
                color.name = color.name.trim().to_string();
            }
        }

        Ok(request)
    }

    fn normalize_project(project: String) -> String {
        let project = project.trim();

        if project.is_empty() {
            DEFAULT_PROJECT_NAME.to_string()
        } else {
            project.to_string()
        }
    }
}
