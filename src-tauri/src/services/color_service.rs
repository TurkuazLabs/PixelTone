// # 📄 Dosya Yolu: pixeltone/src-tauri/src/services/color_service.rs
// # 📌 Amac: Renk donusum is kurallarini calistirmak
// # 📌 Service - Rust
// # Version: 0.2.1
// # Aciklama: HEX degerini RGB, HSL, HSV ve CMYK formatlarina cevirir
//
// Bagimli Oldugu Katman: Service

use crate::config::app_config::ERROR_INVALID_HEX;
use crate::models::color::{CmykColor, ColorInfo, HslColor, HsvColor, RgbColor};

pub struct ColorService;

impl ColorService {
    pub fn convert_from_hex(hex: &str) -> Result<ColorInfo, String> {
        let normalized_hex = Self::normalize_hex(hex)?;
        let rgb = Self::hex_to_rgb(&normalized_hex)?;
        let hsl = Self::rgb_to_hsl(&rgb);
        let hsv = Self::rgb_to_hsv(&rgb);
        let cmyk = Self::rgb_to_cmyk(&rgb);

        Ok(ColorInfo {
            hex: normalized_hex,
            rgb,
            hsl,
            hsv,
            cmyk,
        })
    }

    fn normalize_hex(hex: &str) -> Result<String, String> {
        let clean_hex = hex.trim().trim_start_matches('#');

        if clean_hex.len() != 6
            || !clean_hex
                .chars()
                .all(|character| character.is_ascii_hexdigit())
        {
            return Err(ERROR_INVALID_HEX.to_string());
        }

        Ok(format!("#{}", clean_hex.to_uppercase()))
    }

    fn hex_to_rgb(hex: &str) -> Result<RgbColor, String> {
        let clean_hex = hex.trim_start_matches('#');
        let red =
            u8::from_str_radix(&clean_hex[0..2], 16).map_err(|_| ERROR_INVALID_HEX.to_string())?;
        let green =
            u8::from_str_radix(&clean_hex[2..4], 16).map_err(|_| ERROR_INVALID_HEX.to_string())?;
        let blue =
            u8::from_str_radix(&clean_hex[4..6], 16).map_err(|_| ERROR_INVALID_HEX.to_string())?;

        Ok(RgbColor { red, green, blue })
    }

    fn rgb_to_hsl(rgb: &RgbColor) -> HslColor {
        let red = f64::from(rgb.red) / 255.0;
        let green = f64::from(rgb.green) / 255.0;
        let blue = f64::from(rgb.blue) / 255.0;
        let max = red.max(green).max(blue);
        let min = red.min(green).min(blue);
        let lightness = (max + min) / 2.0;
        let delta = max - min;

        if delta == 0.0 {
            return HslColor {
                hue: 0.0,
                saturation: 0.0,
                lightness: lightness * 100.0,
            };
        }

        let saturation = if lightness > 0.5 {
            delta / (2.0 - max - min)
        } else {
            delta / (max + min)
        };

        let mut hue = if max == red {
            ((green - blue) / delta) + if green < blue { 6.0 } else { 0.0 }
        } else if max == green {
            ((blue - red) / delta) + 2.0
        } else {
            ((red - green) / delta) + 4.0
        };

        hue *= 60.0;

        HslColor {
            hue,
            saturation: saturation * 100.0,
            lightness: lightness * 100.0,
        }
    }

    fn rgb_to_hsv(rgb: &RgbColor) -> HsvColor {
        let red = f64::from(rgb.red) / 255.0;
        let green = f64::from(rgb.green) / 255.0;
        let blue = f64::from(rgb.blue) / 255.0;
        let max = red.max(green).max(blue);
        let min = red.min(green).min(blue);
        let delta = max - min;

        let hue = if delta == 0.0 {
            0.0
        } else if max == red {
            60.0 * (((green - blue) / delta) % 6.0)
        } else if max == green {
            60.0 * (((blue - red) / delta) + 2.0)
        } else {
            60.0 * (((red - green) / delta) + 4.0)
        };

        let saturation = if max == 0.0 { 0.0 } else { delta / max };

        HsvColor {
            hue: if hue < 0.0 { hue + 360.0 } else { hue },
            saturation: saturation * 100.0,
            value: max * 100.0,
        }
    }

    fn rgb_to_cmyk(rgb: &RgbColor) -> CmykColor {
        let red = f64::from(rgb.red) / 255.0;
        let green = f64::from(rgb.green) / 255.0;
        let blue = f64::from(rgb.blue) / 255.0;
        let black = 1.0 - red.max(green).max(blue);

        if black >= 1.0 {
            return CmykColor {
                cyan: 0.0,
                magenta: 0.0,
                yellow: 0.0,
                black: 100.0,
            };
        }

        CmykColor {
            cyan: ((1.0 - red - black) / (1.0 - black)) * 100.0,
            magenta: ((1.0 - green - black) / (1.0 - black)) * 100.0,
            yellow: ((1.0 - blue - black) / (1.0 - black)) * 100.0,
            black: black * 100.0,
        }
    }
}
