// # 📄 Dosya Yolu: pixeltone/src-tauri/src/repositories/palette_repository.rs
// # 📌 Amac: Palet dosya kayit islemlerini yapmak
// # 📌 Repo - Rust
// # Version: 0.1.0
// # Aciklama: Paletleri kullanici local data klasorunde JSON olarak saklar
//
// Bagimli Oldugu Katman: Repo

use std::fs;
use std::path::PathBuf;

use crate::config::app_config::{APP_FOLDER_NAME, PALETTE_FILE_EXTENSION, PALETTE_FOLDER_NAME};
use crate::models::palette::{PaletteFile, PaletteSummary, SavePaletteRequest, SavePaletteResponse};

pub struct PaletteRepository;

impl PaletteRepository {
    pub fn new() -> Self {
        Self
    }

    pub fn save(&self, request: SavePaletteRequest) -> Result<SavePaletteResponse, String> {
        let directory = self.palette_directory()?;
        fs::create_dir_all(&directory).map_err(|error| error.to_string())?;

        let safe_name = Self::safe_file_name(&request.name);
        let path = directory.join(format!("{}.{}", safe_name, PALETTE_FILE_EXTENSION));
        let palette_file = PaletteFile {
            name: request.name.clone(),
            colors: request.colors,
        };
        let content = serde_json::to_string_pretty(&palette_file).map_err(|error| error.to_string())?;

        fs::write(&path, content).map_err(|error| error.to_string())?;

        Ok(SavePaletteResponse {
            name: palette_file.name,
            path: path.to_string_lossy().to_string(),
            color_count: palette_file.colors.len(),
        })
    }

    pub fn list(&self) -> Result<Vec<PaletteSummary>, String> {
        let directory = self.palette_directory()?;

        if !directory.exists() {
            return Ok(Vec::new());
        }

        let mut palettes = Vec::new();

        for entry in fs::read_dir(directory).map_err(|error| error.to_string())? {
            let path = entry.map_err(|error| error.to_string())?.path();

            if path.extension().and_then(|value| value.to_str()) != Some(PALETTE_FILE_EXTENSION) {
                continue;
            }

            let content = fs::read_to_string(&path).map_err(|error| error.to_string())?;
            let palette: PaletteFile = serde_json::from_str(&content).map_err(|error| error.to_string())?;

            palettes.push(PaletteSummary {
                name: palette.name,
                path: path.to_string_lossy().to_string(),
                color_count: palette.colors.len(),
            });
        }

        Ok(palettes)
    }

    fn palette_directory(&self) -> Result<PathBuf, String> {
        let base_directory = dirs_next::data_local_dir()
            .or_else(dirs_next::data_dir)
            .unwrap_or_else(std::env::temp_dir);

        Ok(base_directory.join(APP_FOLDER_NAME).join(PALETTE_FOLDER_NAME))
    }

    fn safe_file_name(value: &str) -> String {
        let safe_value: String = value
            .chars()
            .map(|character| {
                if character.is_ascii_alphanumeric() || character == '-' || character == '_' {
                    character.to_ascii_lowercase()
                } else {
                    '-'
                }
            })
            .collect();

        safe_value.trim_matches('-').to_string()
    }
}
