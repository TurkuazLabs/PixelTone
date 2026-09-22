// # 📄 Dosya Yolu: pixeltone/frontend/tools/app_tool.js
// # 📌 Amac: Tauri uygulama metadata API'sini Service katmanindan soyutlamak
// # 📌 Tool - JavaScript
// # Version: 1.0.0
// # Aciklama: Kurulu PixelTone uygulama surumunu Tauri app API uzerinden okur
//
// Bagimli Oldugu Katman: Tool

import { getVersion } from "@tauri-apps/api/app";

export const appTool = Object.freeze({
  async getVersion() {
    return getVersion();
  },
});
