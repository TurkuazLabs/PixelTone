// # 📄 Dosya Yolu: pixeltone/frontend/services/palette_service.js
// # 📌 Amac: Frontend palet ve renk is kurallarini yonetmek
// # 📌 Service - JavaScript
// # Version: 0.1.0
// # Aciklama: Tauri komutlarini cagirir ve local fallback donusumleri yapar
//
// Bagimli Oldugu Katman: Service

import { APP_CONFIG } from "../config/app_config.js";
import { localRepository } from "../repositories/local_repository.js";
import { tauriBridge } from "../tools/tauri_bridge.js";

function normalizeHex(hexValue) {
  const value = String(hexValue || "").trim();
  return value.startsWith("#") ? value : `#${value}`;
}

function fallbackConvert(hexValue) {
  const normalizedHex = normalizeHex(hexValue);
  const cleanHex = normalizedHex.replace("#", "");

  if (!/^[0-9a-fA-F]{6}$/.test(cleanHex)) {
    throw new Error("Gecerli 6 haneli HEX renk girin.");
  }

  const red = parseInt(cleanHex.slice(0, 2), 16);
  const green = parseInt(cleanHex.slice(2, 4), 16);
  const blue = parseInt(cleanHex.slice(4, 6), 16);

  return {
    hex: normalizedHex.toUpperCase(),
    rgb: { red, green, blue },
    hsl: { hue: 0, saturation: 0, lightness: 0 },
    hsv: { hue: 0, saturation: 0, value: 0 },
    cmyk: { cyan: 0, magenta: 0, yellow: 0, black: 0 },
  };
}

export const paletteService = Object.freeze({
  async convertHex(hexValue) {
    const normalizedHex = normalizeHex(hexValue);

    try {
      return await tauriBridge.invokeCommand(APP_CONFIG.commands.convertHexColor, { hex: normalizedHex });
    } catch (_error) {
      return fallbackConvert(normalizedHex);
    }
  },

  addToHistory(colorInfo) {
    const currentHistory = localRepository.readList(APP_CONFIG.storageKeys.history);
    const filteredHistory = currentHistory.filter((item) => item.hex !== colorInfo.hex);
    const nextHistory = [colorInfo, ...filteredHistory].slice(0, APP_CONFIG.limits.maxHistoryItems);
    localRepository.writeList(APP_CONFIG.storageKeys.history, nextHistory);
    return nextHistory;
  },

  getHistory() {
    return localRepository.readList(APP_CONFIG.storageKeys.history);
  },

  async captureScreenColor() {
    return tauriBridge.invokeCommand(APP_CONFIG.commands.captureScreenColor);
  },

  async savePalette(name, colors) {
    const request = {
      name,
      colors: colors.map((color) => ({
        name: color.hex,
        hex: color.hex,
      })),
    };

    return tauriBridge.invokeCommand(APP_CONFIG.commands.savePalette, { request });
  },

  async listPalettes() {
    return tauriBridge.invokeCommand(APP_CONFIG.commands.listPalettes);
  },
});
