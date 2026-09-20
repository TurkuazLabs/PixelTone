// # 📄 Dosya Yolu: pixeltone/frontend/services/palette_service.js
// # 📌 Amac: Frontend palet, renk, capture ve transfer is kurallarini yonetmek
// # 📌 Service - JavaScript
// # Version: 0.3.0
// # Aciklama: Palet CRUD, renk adlandirma/siralama, YAML/CSS aktarimi ve capture akislarini koordine eder
//
// Bagimli Oldugu Katman: Service

import { APP_CONFIG } from "../config/app_config.js";
import { localRepository } from "../repositories/local_repository.js";
import { fileTransferTool } from "../tools/file_transfer_tool.js";
import { tauriBridge } from "../tools/tauri_bridge.js";
import { windowTool } from "../tools/window_tool.js";

let editingPaletteIdentity = null;

function normalizeHex(hexValue) {
  const value = String(hexValue || "").trim();
  return value.startsWith("#") ? value : `#${value}`;
}

function normalizeProjectName(projectName) {
  return String(projectName || "").trim() || APP_CONFIG.defaults.projectName;
}

function storeProjectName(projectName) {
  const normalizedProject = normalizeProjectName(projectName);
  localRepository.writeValue(APP_CONFIG.storageKeys.projectName, normalizedProject);
  return normalizedProject;
}

function fallbackConvert(hexValue) {
  const normalizedHex = normalizeHex(hexValue);
  const cleanHex = normalizedHex.replace("#", "");

  if (!/^[0-9a-fA-F]{6}$/.test(cleanHex)) {
    throw new Error(APP_CONFIG.errors.invalidHex);
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

async function convertHexValue(hexValue) {
  const normalizedHex = normalizeHex(hexValue);

  try {
    return await tauriBridge.invokeCommand(APP_CONFIG.commands.convertHexColor, {
      hex: normalizedHex,
    });
  } catch (_error) {
    return fallbackConvert(normalizedHex);
  }
}

function delay(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function storeHistory(historyItems) {
  localRepository.writeList(APP_CONFIG.storageKeys.history, historyItems);
  return historyItems;
}

function normalizeHistoryItem(colorInfo, preservedName = "") {
  return {
    ...colorInfo,
    name: String(preservedName || colorInfo.name || colorInfo.hex).trim() || colorInfo.hex,
  };
}

function mapPaletteColors(colors) {
  return colors.map((color) => ({
    name: String(color.name || color.hex).trim() || color.hex,
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

async function convertPaletteColors(colors) {
  const convertedColors = [];

  for (const color of colors) {
    const converted = await convertHexValue(color.hex);
    convertedColors.push(normalizeHistoryItem(converted, color.name));
  }

  return convertedColors;
}

export const paletteService = Object.freeze({
  async convertHex(hexValue) {
    return convertHexValue(hexValue);
  },

  addToHistory(colorInfo) {
    const currentHistory = localRepository.readList(APP_CONFIG.storageKeys.history);
    const existingColor = currentHistory.find((item) => item.hex === colorInfo.hex);
    const normalizedColor = normalizeHistoryItem(colorInfo, existingColor?.name);
    const filteredHistory = currentHistory.filter((item) => item.hex !== normalizedColor.hex);
    return storeHistory(
      [normalizedColor, ...filteredHistory].slice(0, APP_CONFIG.limits.maxHistoryItems),
    );
  },

  getHistory() {
    return localRepository.readList(APP_CONFIG.storageKeys.history);
  },

  renameHistoryColor(index, name) {
    const historyItems = this.getHistory();

    if (!historyItems[index]) {
      return historyItems;
    }

    const normalizedName = String(name || "").trim();
    historyItems[index] = {
      ...historyItems[index],
      name: normalizedName || historyItems[index].hex,
    };

    return storeHistory(historyItems);
  },

  moveHistoryColor(index, offset) {
    const historyItems = this.getHistory();
    const targetIndex = index + offset;

    if (!historyItems[index] || targetIndex < 0 || targetIndex >= historyItems.length) {
      return historyItems;
    }

    const [item] = historyItems.splice(index, 1);
    historyItems.splice(targetIndex, 0, item);
    return storeHistory(historyItems);
  },

  getProjectName() {
    return localRepository.readValue(
      APP_CONFIG.storageKeys.projectName,
      APP_CONFIG.defaults.projectName,
    );
  },

  setProjectName(projectName) {
    return storeProjectName(projectName);
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
    const palette = buildPaletteRequest(project, name, colors);

    if (!editingPaletteIdentity) {
      return tauriBridge.invokeCommand(APP_CONFIG.commands.savePalette, { request: palette });
    }

    const response = await tauriBridge.invokeCommand(APP_CONFIG.commands.updatePalette, {
      request: {
        original: editingPaletteIdentity,
        palette,
      },
    });
    editingPaletteIdentity = null;
    return response;
  },

  async beginPaletteEdit(project, name) {
    const identity = {
      project: normalizeProjectName(project),
      name: String(name || "").trim(),
    };
    const palette = await tauriBridge.invokeCommand(APP_CONFIG.commands.getPalette, { identity });
    const history = storeHistory(await convertPaletteColors(palette.colors));

    editingPaletteIdentity = {
      project: palette.project,
      name: palette.name,
    };
    storeProjectName(palette.project);

    return {
      project: palette.project,
      name: palette.name,
      history,
      selectedColor: history[0] || null,
    };
  },

  async deletePalette(project, name) {
    const identity = {
      project: normalizeProjectName(project),
      name: String(name || "").trim(),
    };
    const response = await tauriBridge.invokeCommand(APP_CONFIG.commands.deletePalette, {
      identity,
    });

    if (
      editingPaletteIdentity &&
      editingPaletteIdentity.project === identity.project &&
      editingPaletteIdentity.name === identity.name
    ) {
      editingPaletteIdentity = null;
    }

    return response;
  },

  async listPalettes(project) {
    return tauriBridge.invokeCommand(APP_CONFIG.commands.listPalettes, { project });
  },

  async exportPalette(project, name, colors, format) {
    const request = {
      ...buildPaletteRequest(project, name, colors),
      format,
    };
    const exportFile = await tauriBridge.invokeCommand(APP_CONFIG.commands.exportPalette, {
      request,
    });
    fileTransferTool.downloadText(exportFile);
    return exportFile;
  },

  async importPalette(file) {
    const content = await fileTransferTool.readTextFile(file);
    const response = await tauriBridge.invokeCommand(APP_CONFIG.commands.importPalette, {
      request: { content },
    });
    storeProjectName(response.project);
    return response;
  },
});
