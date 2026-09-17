// # 📄 Dosya Yolu: pixeltone/frontend/services/tailwind_color_service.js
// # 📌 Amac: Secilen HEX renge en yakin Tailwind renklerini hesaplamak
// # 📌 Service - JavaScript
// # Version: 0.3.0
// # Aciklama: HEX rengini OKLab uzayina cevirir, resmi Tailwind paleti ile mesafe hesabini yapar
//
// Bagimli Oldugu Katman: Service

import { APP_CONFIG } from "../config/app_config.js";
import { tailwindPaletteTool } from "../tools/tailwind_palette_tool.js";

function normalizeHex(hexValue) {
  const value = String(hexValue || "").trim();
  const normalized = value.startsWith("#") ? value : `#${value}`;

  if (!/^#[0-9a-fA-F]{6}$/.test(normalized)) {
    throw new Error(APP_CONFIG.errors.invalidHex);
  }

  return normalized.toUpperCase();
}

function srgbChannelToLinear(channel) {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function hexToOklab(hexValue) {
  const normalized = normalizeHex(hexValue);
  const red = srgbChannelToLinear(parseInt(normalized.slice(1, 3), 16));
  const green = srgbChannelToLinear(parseInt(normalized.slice(3, 5), 16));
  const blue = srgbChannelToLinear(parseInt(normalized.slice(5, 7), 16));

  const l = 0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue;
  const m = 0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue;
  const s = 0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue;

  const lRoot = Math.cbrt(l);
  const mRoot = Math.cbrt(m);
  const sRoot = Math.cbrt(s);

  return {
    l: 0.2104542553 * lRoot + 0.793617785 * mRoot - 0.0040720468 * sRoot,
    a: 1.9779984951 * lRoot - 2.428592205 * mRoot + 0.4505937099 * sRoot,
    b: 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.808675766 * sRoot,
  };
}

function colorDistance(first, second) {
  const lightness = first.l - second.l;
  const greenRed = first.a - second.a;
  const blueYellow = first.b - second.b;
  return Math.sqrt(lightness ** 2 + greenRed ** 2 + blueYellow ** 2);
}

export const tailwindColorService = Object.freeze({
  findNearest(hexValue) {
    const source = hexToOklab(hexValue);

    return tailwindPaletteTool
      .getEntries()
      .map((entry) => ({
        name: entry.name,
        value: entry.value,
        distance: colorDistance(source, entry.oklab),
      }))
      .sort((first, second) => first.distance - second.distance)
      .slice(0, APP_CONFIG.tailwind.matchCount);
  },
});
