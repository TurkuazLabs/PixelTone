// # 📄 Dosya Yolu: pixeltone/frontend/tools/event_tool.js
// # 📌 Amac: Tauri pencere event iletisimini frontend servislerinden soyutlamak
// # 📌 Tool - JavaScript
// # Version: 0.4.0
// # Aciklama: Picker secimini ana pencereye iletmek ve event dinlemek icin adaptor saglar
//
// Bagimli Oldugu Katman: Tool

import { emitTo, listen } from "@tauri-apps/api/event";

export const eventTool = Object.freeze({
  async emitToWindow(windowLabel, eventName, payload) {
    await emitTo(windowLabel, eventName, payload);
  },

  async listenEvent(eventName, handler) {
    return listen(eventName, (event) => handler(event.payload));
  },
});
