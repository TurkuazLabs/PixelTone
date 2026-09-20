// # 📄 Dosya Yolu: pixeltone/frontend/tools/picker_window_tool.js
// # 📌 Amac: Picker overlay penceresinin monitor, boyut ve gorunurluk islemlerini soyutlamak
// # 📌 Tool - JavaScript
// # Version: 0.4.0
// # Aciklama: Global cursorun bulundugu monitoru bulur ve picker penceresini o monitoru kaplayacak sekilde konumlandirir
//
// Bagimli Oldugu Katman: Tool

import { PhysicalPosition, PhysicalSize } from "@tauri-apps/api/dpi";
import { availableMonitors, cursorPosition } from "@tauri-apps/api/window";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

import { APP_CONFIG } from "../config/app_config.js";

let lastMonitorKey = "";

function monitorContainsCursor(monitor, cursor) {
  const left = monitor.position.x;
  const top = monitor.position.y;
  const right = left + monitor.size.width;
  const bottom = top + monitor.size.height;

  return cursor.x >= left && cursor.x < right && cursor.y >= top && cursor.y < bottom;
}

function monitorKey(monitor) {
  return [
    monitor.position.x,
    monitor.position.y,
    monitor.size.width,
    monitor.size.height,
  ].join(":");
}

async function pickerWindow() {
  const window = await WebviewWindow.getByLabel(APP_CONFIG.picker.windowLabel);

  if (!window) {
    throw new Error(APP_CONFIG.errors.pickerWindowMissing);
  }

  return window;
}

async function cursorMonitor() {
  const [cursor, monitors] = await Promise.all([
    cursorPosition(),
    availableMonitors(),
  ]);
  const monitor = monitors.find((item) => monitorContainsCursor(item, cursor)) || monitors[0];

  if (!monitor) {
    throw new Error(APP_CONFIG.errors.pickerMonitorMissing);
  }

  return monitor;
}

export const pickerWindowTool = Object.freeze({
  async syncToCursorMonitor() {
    const monitor = await cursorMonitor();
    const key = monitorKey(monitor);

    if (key === lastMonitorKey) {
      return;
    }

    const window = await pickerWindow();
    await window.setPosition(
      new PhysicalPosition(monitor.position.x, monitor.position.y),
    );
    await window.setSize(
      new PhysicalSize(monitor.size.width, monitor.size.height),
    );
    lastMonitorKey = key;
  },

  async showAtCursor() {
    await this.syncToCursorMonitor();
    const window = await pickerWindow();
    await window.setAlwaysOnTop(true);
    await window.show();
    await window.setFocus();
  },

  async hide() {
    const window = await pickerWindow();
    await window.hide();
  },
});
