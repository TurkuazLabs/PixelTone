// # 📄 Dosya Yolu: pixeltone/frontend/services/picker_service.js
// # 📌 Amac: Global shortcut, live capture, kopyalama ve overlay is kurallarini yonetmek
// # 📌 Service - JavaScript
// # Version: 0.4.0
// # Aciklama: Picker acma/kapama, canli sample, HEX/RGB formatlama ve ana pencereye secim aktarimini koordine eder
//
// Bagimli Oldugu Katman: Service

import { APP_CONFIG } from "../config/app_config.js";
import { clipboardTool } from "../tools/clipboard_tool.js";
import { eventTool } from "../tools/event_tool.js";
import { pickerWindowTool } from "../tools/picker_window_tool.js";
import { shortcutTool } from "../tools/shortcut_tool.js";
import { tauriBridge } from "../tools/tauri_bridge.js";

function formatRgb(colorInfo) {
  return `rgb(${colorInfo.rgb.red}, ${colorInfo.rgb.green}, ${colorInfo.rgb.blue})`;
}

async function openPicker() {
  await pickerWindowTool.showAtCursor();
}

async function colorInfoForCapture(captureResult) {
  return tauriBridge.invokeCommand(APP_CONFIG.commands.convertHexColor, {
    hex: captureResult.hex,
  });
}

export const pickerService = Object.freeze({
  async initializeGlobalShortcut() {
    await shortcutTool.replace(APP_CONFIG.picker.shortcut, () => {
      void openPicker().catch(() => undefined);
    });
  },

  async openPicker() {
    await openPicker();
  },

  async closePicker() {
    await pickerWindowTool.hide();
  },

  async sampleLiveColor() {
    await pickerWindowTool.syncToCursorMonitor();
    const capture = await tauriBridge.invokeCommand(APP_CONFIG.commands.captureScreenColor);
    const colorInfo = await colorInfoForCapture(capture);

    return {
      capture,
      colorInfo,
    };
  },

  async copySelection(sample, format) {
    const normalizedFormat =
      format === APP_CONFIG.picker.copyFormats.rgb
        ? APP_CONFIG.picker.copyFormats.rgb
        : APP_CONFIG.picker.copyFormats.hex;
    const text =
      normalizedFormat === APP_CONFIG.picker.copyFormats.rgb
        ? formatRgb(sample.colorInfo)
        : sample.colorInfo.hex;

    await clipboardTool.writeText(text);

    const selection = {
      capture: sample.capture,
      colorInfo: sample.colorInfo,
      format: normalizedFormat,
      text,
    };

    await eventTool.emitToWindow(
      APP_CONFIG.picker.mainWindowLabel,
      APP_CONFIG.picker.selectionEvent,
      selection,
    );
    await pickerWindowTool.hide();

    return selection;
  },

  async onSelection(handler) {
    return eventTool.listenEvent(APP_CONFIG.picker.selectionEvent, handler);
  },
});
