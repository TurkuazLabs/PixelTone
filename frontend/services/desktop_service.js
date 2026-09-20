// # 📄 Dosya Yolu: pixeltone/frontend/services/desktop_service.js
// # 📌 Amac: Native masaustu eventlerini frontend uygulama servislerine yonlendirmek
// # 📌 Service - JavaScript
// # Version: 1.0.0
// # Aciklama: Tray picker eventini dinler ve Live Picker acilisini PickerService ile koordine eder
//
// Bagimli Oldugu Katman: Service

import { APP_CONFIG } from "../config/app_config.js";
import { eventTool } from "../tools/event_tool.js";
import { pickerService } from "./picker_service.js";

export const desktopService = Object.freeze({
  async initialize() {
    return eventTool.listenCurrentWindow(
      APP_CONFIG.desktop.trayPickerEvent,
      () => {
        void pickerService.openPicker();
      },
    );
  },
});
