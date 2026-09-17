// # 📄 Dosya Yolu: pixeltone/frontend/services/palette_service.js
// # 📌 Amac: Frontend palet, renk, capture ve transfer is kurallarini yonetmek
// # 📌 Service - JavaScript
// # Version: 0.3.0
// # Aciklama: Proje bazli palet kaydi, YAML/CSS aktarimi ve capture akislarini koordine eder
//
// Bagimli Oldugu Katman: Service

import { APP_CONFIG } from "../config/app_config.js";
import { localRepository } from "../repositories/local_repository.js";
import { fileTransferTool } from "../tools/file_transfer_tool.js";
import { tauriBridge } from "../tools/tauri_bridge.js";
import { windowTool } from "../tools/window_tool.js";

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

function delay(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function mapPaletteColors(colors) {
  return colors.map((color) => ({
    name: color.name || color.hex,
    hex: color.hex,
  }));
}

function buildPaletteRequest(project, name, colors) {
  return {
    project,
    name,
    colors: mapPaletteColors(colors),
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

  getProjectName() {
    return localRepository.readValue(
      APP_CONFIG.storageKeys.projectName,
      APP_CONFIG.defaults.projectName,
    );
  },

  setProjectName(projectName) {
    const normalizedProject = String(projectName || "").trim() || APP_CONFIG.defaults.projectName;
    localRepository.writeValue(APP_CONFIG.storageKeys.projectName, normalizedProject);
    return normalizedProject;
  },

  async captureScreenColor() {
    let minimized = false;

    try {
      await windowTool.minimize();
      minimized = true;
      await delay(APP_CONFIG.capture.delayMs);
      return await tauriBridge.invokeCommand(APP_CONFIG.commands.captureScreenColor);
    } finally {
      if (minimized) {
        try {
          await windowTool.restore();
        } catch (_error) {
          // Restore hatasi capture sonucunu gecersiz kilmamalidir.
        }
      }
    }
  },

  async savePalette(project, name, colors) {
    const request = buildPaletteRequest(project, name, colors);
    return tauriBridge.invokeCommand(APP_CONFIG.commands.savePalette, { request });
  },

  async listPalettes(project) {
    return tauriBridge.invokeCommand(APP_CONFIG.commands.listPalettes, { project });
  },

  async exportPalette(project, name, colors, format) {
    const request = {
      ...buildPaletteRequest(project, name, colors),
      format,
    };
    const exportFile = await tauriBridge.invokeCommand(APP_CONFIG.commands.exportPalette, { request });
    fileTransferTool.downloadText(exportFile);
    return exportFile;
  },

  async importPalette(file) {
    const content = await fileTransferTool.readTextFile(file);
    const response = await tauriBridge.invokeCommand(APP_CONFIG.commands.importPalette, {
      request: { content },
    });
    this.setProjectName(response.project);
    return response;
  },
});
