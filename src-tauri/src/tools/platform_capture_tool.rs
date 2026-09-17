// # 📄 Dosya Yolu: pixeltone/src-tauri/src/tools/platform_capture_tool.rs
// # 📌 Amac: Platform bazli ekran renk yakalama adaptorunu calistirmak
// # 📌 Tool - Rust
// # Version: 0.2.1
// # Aciklama: Cursor konumundaki monitoru xcap ile yakalar ve platform importlarini cfg ile ayirir
//
// Bagimli Oldugu Katman: Tool

use mouse_position::mouse_position::Mouse;
use xcap::Monitor;

use crate::config::app_config::{
    CAPTURE_SOURCE_XCAP, ERROR_CURSOR_POSITION, ERROR_MONITOR_NOT_FOUND, ERROR_SCREEN_CAPTURE,
    ERROR_SCREEN_SAMPLE, MAGNIFIER_SIZE,
};
#[cfg(target_os = "linux")]
use crate::config::app_config::{
    ENV_XDG_SESSION_TYPE, PLATFORM_LINUX_WAYLAND, PLATFORM_LINUX_X11, PLATFORM_UNKNOWN,
    SESSION_TYPE_WAYLAND, SESSION_TYPE_X11,
};
#[cfg(target_os = "macos")]
use crate::config::app_config::PLATFORM_MACOS;
#[cfg(target_os = "windows")]
use crate::config::app_config::PLATFORM_WINDOWS;
#[cfg(not(any(target_os = "windows", target_os = "macos", target_os = "linux")))]
use crate::config::app_config::PLATFORM_UNKNOWN;
use crate::models::capture::{CaptureColorResponse, CapturePoint, MagnifierPixel};

pub struct PlatformCaptureTool;

impl PlatformCaptureTool {
    pub fn capture_screen_color() -> Result<CaptureColorResponse, String> {
        let (cursor_x, cursor_y) = Self::cursor_position()?;
        let monitor = Monitor::from_point(cursor_x, cursor_y)
            .map_err(|error| format!("{ERROR_MONITOR_NOT_FOUND} {error}"))?;

        let monitor_x = monitor
            .x()
            .map_err(|error| format!("{ERROR_MONITOR_NOT_FOUND} {error}"))?;
        let monitor_y = monitor
            .y()
            .map_err(|error| format!("{ERROR_MONITOR_NOT_FOUND} {error}"))?;
        let monitor_width = monitor
            .width()
            .map_err(|error| format!("{ERROR_MONITOR_NOT_FOUND} {error}"))?;
        let monitor_height = monitor
            .height()
            .map_err(|error| format!("{ERROR_MONITOR_NOT_FOUND} {error}"))?;

        let image = monitor
            .capture_image()
            .map_err(|error| format!("{ERROR_SCREEN_CAPTURE} {error}"))?;

        if image.width() == 0 || image.height() == 0 || monitor_width == 0 || monitor_height == 0 {
            return Err(ERROR_SCREEN_SAMPLE.to_string());
        }

        let image_x = Self::map_coordinate(cursor_x, monitor_x, monitor_width, image.width())?;
        let image_y = Self::map_coordinate(cursor_y, monitor_y, monitor_height, image.height())?;

        let center_pixel = image.get_pixel(image_x, image_y);
        let center_hex = Self::rgba_to_hex(center_pixel[0], center_pixel[1], center_pixel[2]);
        let magnifier_pixels = Self::build_magnifier(&image, image_x, image_y);

        Ok(CaptureColorResponse {
            hex: center_hex,
            source: CAPTURE_SOURCE_XCAP.to_string(),
            platform: Self::platform_name(),
            cursor: CapturePoint {
                x: cursor_x,
                y: cursor_y,
            },
            magnifier_width: MAGNIFIER_SIZE,
            magnifier_height: MAGNIFIER_SIZE,
            magnifier_pixels,
        })
    }

    fn cursor_position() -> Result<(i32, i32), String> {
        match Mouse::get_mouse_position() {
            Mouse::Position { x, y } => Ok((x, y)),
            Mouse::Error => Err(ERROR_CURSOR_POSITION.to_string()),
        }
    }

    fn map_coordinate(
        global_coordinate: i32,
        monitor_origin: i32,
        monitor_span: u32,
        image_span: u32,
    ) -> Result<u32, String> {
        if monitor_span == 0 || image_span == 0 {
            return Err(ERROR_SCREEN_SAMPLE.to_string());
        }

        let max_monitor_coordinate = monitor_span.saturating_sub(1) as i32;
        let relative_coordinate =
            (global_coordinate - monitor_origin).clamp(0, max_monitor_coordinate);
        let scale = image_span as f64 / monitor_span as f64;
        let mapped = (relative_coordinate as f64 * scale).floor() as u32;

        Ok(mapped.min(image_span.saturating_sub(1)))
    }

    fn build_magnifier(
        image: &xcap::image::RgbaImage,
        center_x: u32,
        center_y: u32,
    ) -> Vec<MagnifierPixel> {
        let radius = (MAGNIFIER_SIZE / 2) as i32;
        let mut pixels = Vec::with_capacity((MAGNIFIER_SIZE * MAGNIFIER_SIZE) as usize);

        for grid_y in 0..MAGNIFIER_SIZE {
            for grid_x in 0..MAGNIFIER_SIZE {
                let offset_x = grid_x as i32 - radius;
                let offset_y = grid_y as i32 - radius;
                let sample_x = (center_x as i32 + offset_x)
                    .clamp(0, image.width().saturating_sub(1) as i32)
                    as u32;
                let sample_y = (center_y as i32 + offset_y)
                    .clamp(0, image.height().saturating_sub(1) as i32)
                    as u32;
                let pixel = image.get_pixel(sample_x, sample_y);

                pixels.push(MagnifierPixel {
                    x: grid_x,
                    y: grid_y,
                    hex: Self::rgba_to_hex(pixel[0], pixel[1], pixel[2]),
                    is_center: grid_x == MAGNIFIER_SIZE / 2 && grid_y == MAGNIFIER_SIZE / 2,
                });
            }
        }

        pixels
    }

    fn rgba_to_hex(red: u8, green: u8, blue: u8) -> String {
        format!("#{red:02X}{green:02X}{blue:02X}")
    }

    fn platform_name() -> String {
        #[cfg(target_os = "windows")]
        {
            return PLATFORM_WINDOWS.to_string();
        }

        #[cfg(target_os = "macos")]
        {
            return PLATFORM_MACOS.to_string();
        }

        #[cfg(target_os = "linux")]
        {
            let session_type = std::env::var(ENV_XDG_SESSION_TYPE)
                .unwrap_or_default()
                .to_ascii_lowercase();

            return match session_type.as_str() {
                SESSION_TYPE_WAYLAND => PLATFORM_LINUX_WAYLAND.to_string(),
                SESSION_TYPE_X11 => PLATFORM_LINUX_X11.to_string(),
                _ => PLATFORM_UNKNOWN.to_string(),
            };
        }

        #[cfg(not(any(target_os = "windows", target_os = "macos", target_os = "linux")))]
        {
            PLATFORM_UNKNOWN.to_string()
        }
    }
}
