// # 📄 Dosya Yolu: pixeltone/src-tauri/src/tools/palette_format_tool.rs
// # 📌 Amac: Paletleri YAML/CSS formatlarina cevirmek ve YAML import etmek
// # 📌 Tool - Rust
// # Version: 0.3.0
// # Aciklama: Dis format serilestirme ve parse islemlerini uygulama is kurallarindan ayirir
//
// Bagimli Oldugu Katman: Tool

use crate::config::app_config::{
    CSS_ROOT_SELECTOR, CSS_VARIABLE_PREFIX, EXPORT_EXTENSION_CSS, EXPORT_EXTENSION_YAML,
    EXPORT_MIME_CSS, EXPORT_MIME_YAML,
};
use crate::models::palette_transfer::{
    ExportPaletteResponse, PaletteExportFormat, PaletteTransferFile,
};

pub struct PaletteFormatTool;

impl PaletteFormatTool {
    pub fn export(
        palette: &PaletteTransferFile,
        format: &PaletteExportFormat,
    ) -> Result<ExportPaletteResponse, String> {
        match format {
            PaletteExportFormat::Yaml => Self::export_yaml(palette),
            PaletteExportFormat::Css => Ok(Self::export_css(palette)),
        }
    }

    pub fn import_yaml(content: &str) -> Result<PaletteTransferFile, String> {
        noyalib::from_str(content).map_err(|error| error.to_string())
    }

    fn export_yaml(palette: &PaletteTransferFile) -> Result<ExportPaletteResponse, String> {
        let content = noyalib::to_string(palette).map_err(|error| error.to_string())?;
        let file_name = Self::export_file_name(palette, EXPORT_EXTENSION_YAML);

        Ok(ExportPaletteResponse {
            file_name,
            mime_type: EXPORT_MIME_YAML.to_string(),
            content,
        })
    }

    fn export_css(palette: &PaletteTransferFile) -> ExportPaletteResponse {
        let palette_token = Self::safe_token(&palette.name);
        let mut content = String::new();
        content.push_str(CSS_ROOT_SELECTOR);
        content.push_str(" {\n");

        for (index, color) in palette.colors.iter().enumerate() {
            let color_token = Self::color_token(&color.name, index);
            content.push_str(&format!(
                "  {CSS_VARIABLE_PREFIX}-{palette_token}-{color_token}: {};\n",
                color.hex
            ));
        }

        content.push_str("}\n");

        ExportPaletteResponse {
            file_name: Self::export_file_name(palette, EXPORT_EXTENSION_CSS),
            mime_type: EXPORT_MIME_CSS.to_string(),
            content,
        }
    }

    fn export_file_name(palette: &PaletteTransferFile, extension: &str) -> String {
        let project = Self::safe_token(&palette.project);
        let name = Self::safe_token(&palette.name);
        format!("{project}-{name}.{extension}")
    }

    fn color_token(name: &str, index: usize) -> String {
        let token = Self::safe_token(name);

        if token.is_empty() || name.trim_start().starts_with('#') {
            format!("color-{:02}", index + 1)
        } else {
            token
        }
    }

    fn safe_token(value: &str) -> String {
        let token: String = value
            .chars()
            .map(|character| {
                if character.is_ascii_alphanumeric() {
                    character.to_ascii_lowercase()
                } else {
                    '-'
                }
            })
            .collect();

        token
            .split('-')
            .filter(|part| !part.is_empty())
            .collect::<Vec<_>>()
            .join("-")
    }
}
