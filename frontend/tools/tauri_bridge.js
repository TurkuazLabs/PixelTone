// # 📄 Dosya Yolu: pixeltone/frontend/tools/tauri_bridge.js
// # 📌 Amac: HTML UI ile Rust Tauri komutlari arasinda kopru kurmak
// # 📌 Tool - JavaScript
// # Version: 0.1.0
// # Aciklama: Tauri invoke komutlarini tek noktadan cagirir
//
// Bagimli Oldugu Katman: Tool

import { invoke } from "@tauri-apps/api/core";

export const tauriBridge = Object.freeze({
  async invokeCommand(commandName, payload = {}) {
    return invoke(commandName, payload);
  },
});
