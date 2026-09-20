// # 📄 Dosya Yolu: pixeltone/frontend/tools/clipboard_tool.js
// # 📌 Amac: Sistem panosu yazma islemini frontend servislerinden soyutlamak
// # 📌 Tool - JavaScript
// # Version: 0.4.0
// # Aciklama: Picker tarafindan secilen HEX veya RGB metnini sistem panosuna yazar
//
// Bagimli Oldugu Katman: Tool

import { writeText } from "@tauri-apps/plugin-clipboard-manager";

export const clipboardTool = Object.freeze({
  async writeText(value) {
    await writeText(String(value));
  },
});
