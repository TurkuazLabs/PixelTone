// # 📄 Dosya Yolu: pixeltone/src-tauri/src/repositories/palette_repository.rs
// # 📌 Amac: Proje bazli palet dosya kayit ve listeleme islemlerini yapmak
// # 📌 Repo - Rust
// # Version: 0.3.0
// # Aciklama: Paletleri projects/<project>/palettes altinda saklar ve legacy paletleri okuyabilir
//
// Bagimli Oldugu Katman: Repo

use std::fs;
use std::path::{Path, PathBuf};

use crate::config::app_config::{
    APP_FOLDER_NAME, DEFAULT_PROJECT_NAME, PALETTE_FILE_EXTENSION, PALETTE_FOLDER_NAME,
    PROJECT_FOLDER_NAME,
};
use crate::models::palette::{
    PaletteFile, PaletteSummary, SavePaletteRequest, SavePaletteResponse,
};

pub struct PaletteRepository;

impl PaletteRepository {
    pub fn new() -> Self {
        Self
    }

    pub fn save(&self, request: SavePaletteRequest) -> Result<SavePaletteResponse, String> {
        let directory = self.palette_directory(&request.project);
        fs::create_dir_all(&directory).map_err(|error| error.to_string())?;

        let safe_name = Self::safe_file_name(&request.name);
        let path = directory.join(format!("{}.{}", safe_name, PALETTE_FILE_EXTENSION));
        let palette_file = PaletteFile {
            project: request.project.clone(),
            name: request.name.clone(),
            colors: request.colors,
        };
        let content =
            serde_json::to_string_pretty(&palette_file).map_err(|error| error.to_string())?;

        fs::write(&path, content).map_err(|error| error.to_string())?;

        Ok(SavePaletteResponse {
            project: palette_file.project,
            name: palette_file.name,
            path: path.to_string_lossy().to_string(),
            color_count: palette_file.colors.len(),
        })
    }

    pub fn list(&self, project: &str) -> Result<Vec<PaletteSummary>, String> {
        let mut palettes = Vec::new();
        self.read_directory(&self.palette_directory(project), project, &mut palettes)?;

        if project == DEFAULT_PROJECT_NAME {
            self.read_directory(&self.legacy_palette_directory(), project, &mut palettes)?;
        }

        palettes.sort_by(|left, right| left.name.to_lowercase().cmp(&right.name.to_lowercase()));
        palettes.dedup_by(|left, right| left.project == right.project && left.name == right.name);

        Ok(palettes)
    }

    fn read_directory(
        &self,
        directory: &Path,
        fallback_project: &str,
        palettes: &mut Vec<PaletteSummary>,
    ) -> Result<(), String> {
        if !directory.exists() {
            return Ok(());
        }

        for entry in fs::read_dir(directory).map_err(|error| error.to_string())? {
            let path = entry.map_err(|error| error.to_string())?.path();

            if path.extension().and_then(|value| value.to_str()) != Some(PALETTE_FILE_EXTENSION) {
                continue;
            }

            let content = fs::read_to_string(&path).map_err(|error| error.to_string())?;
            let mut palette: PaletteFile =
                serde_json::from_str(&content).map_err(|error| error.to_string())?;

            if palette.project.trim().is_empty() {
                palette.project = fallback_project.to_string();
            }

            palettes.push(PaletteSummary {
                project: palette.project,
                name: palette.name,
                path: path.to_string_lossy().to_string(),
                color_count: palette.colors.len(),
            });
        }

        Ok(())
    }

    fn palette_directory(&self, project: &str) -> PathBuf {
        self.app_directory()
            .join(PROJECT_FOLDER_NAME)
            .join(Self::safe_file_name(project))
            .join(PALETTE_FOLDER_NAME)
    }

    fn legacy_palette_directory(&self) -> PathBuf {
        self.app_directory().join(PALETTE_FOLDER_NAME)
    }

    fn app_directory(&self) -> PathBuf {
        dirs_next::data_local_dir()
            .or_else(dirs_next::data_dir)
            .unwrap_or_else(std::env::temp_dir)
            .join(APP_FOLDER_NAME)
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
