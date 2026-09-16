// # 📄 Dosya Yolu: pixeltone/frontend/tools/window_tool.js
// # 📌 Amac: Tauri pencere islemlerini frontend servislerinden soyutlamak
// # 📌 Tool - JavaScript
// # Version: 0.2.0
// # Aciklama: Capture sirasinda ana pencereyi kucultur ve geri getirir
//
// Bagimli Oldugu Katman: Tool

import { getCurrentWindow } from "@tauri-apps/api/window";

const mainWindow = getCurrentWindow();

export const windowTool = Object.freeze({
  async minimize() {
    await mainWindow.minimize();
  },

  async restore() {
    await mainWindow.unminimize();
  },
});
