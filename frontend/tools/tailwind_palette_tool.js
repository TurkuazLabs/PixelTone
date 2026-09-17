// # 📄 Dosya Yolu: pixeltone/frontend/tools/tailwind_palette_tool.js
// # 📌 Amac: Resmi Tailwind renk paketini PixelTone icin okunabilir palet girdilerine cevirmek
// # 📌 Tool - JavaScript
// # Version: 0.3.0
// # Aciklama: tailwindcss/colors kaynagini duzlestirir ve OKLCH degerlerini OKLab koordinatlarina cevirir
//
// Bagimli Oldugu Katman: Tool

import tailwindColors from "tailwindcss/colors";

import { APP_CONFIG } from "../config/app_config.js";

function parseOklch(value) {
  const match = String(value).match(
    /^oklch\(\s*([\d.]+)(%)?\s+([\d.]+)\s+(none|[-\d.]+)\s*\)$/i,
  );

  if (!match) {
    return null;
  }

  const lightness = Number(match[1]) / (match[2] ? 100 : 1);
  const chroma = Number(match[3]);
  const hue = match[4] === "none" ? 0 : Number(match[4]);
  const radians = (hue * Math.PI) / 180;

  return {
    l: lightness,
    a: chroma * Math.cos(radians),
    b: chroma * Math.sin(radians),
  };
}

function parseShortHex(value) {
  const normalized = String(value).trim();

  if (!/^#[0-9a-fA-F]{3}$/.test(normalized)) {
    return null;
  }

  return `#${normalized
    .slice(1)
    .split("")
    .map((character) => character.repeat(2))
    .join("")}`;
}

function srgbChannelToLinear(channel) {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function hexToOklab(value) {
  const shortHex = parseShortHex(value);
  const normalized = shortHex || String(value).trim();

  if (!/^#[0-9a-fA-F]{6}$/.test(normalized)) {
    return null;
  }

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

function parseColorValue(value) {
  return parseOklch(value) || hexToOklab(value);
}

function buildEntries() {
  const entries = [];
  const excludedNames = new Set(APP_CONFIG.tailwind.excludedNames);

  Object.entries(tailwindColors).forEach(([family, value]) => {
    if (excludedNames.has(family)) {
      return;
    }

    if (typeof value === "string") {
      const oklab = parseColorValue(value);

      if (oklab) {
        entries.push({ name: family, value, oklab });
      }
      return;
    }

    if (!value || typeof value !== "object") {
      return;
    }

    Object.entries(value).forEach(([shade, shadeValue]) => {
      if (typeof shadeValue !== "string") {
        return;
      }

      const oklab = parseColorValue(shadeValue);

      if (oklab) {
        entries.push({
          name: `${family}-${shade}`,
          value: shadeValue,
          oklab,
        });
      }
    });
  });

  return entries;
}

const paletteEntries = Object.freeze(buildEntries());

export const tailwindPaletteTool = Object.freeze({
  getEntries() {
    return paletteEntries;
  },
});
