// # 📄 Dosya Yolu: pixeltone/frontend/tools/event_tool.js
// # 📌 Amac: Tauri pencere event iletisimini frontend servislerinden soyutlamak
// # 📌 Tool - JavaScript
// # Version: 0.4.0
// # Aciklama: Hedef pencereye event gonderir ve mevcut WebviewWindow uzerindeki hedefli eventleri dinler
//
// Bagimli Oldugu Katman: Tool

import { emitTo } from "@tauri-apps/api/event";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

export const eventTool = Object.freeze({
  async emitToWindow(windowLabel, eventName, payload) {
    await emitTo(windowLabel, eventName, payload);
  },

  async listenCurrentWindow(eventName, handler) {
    return getCurrentWebviewWindow().listen(
      eventName,
      (event) => handler(event.payload),
    );
  },
});
