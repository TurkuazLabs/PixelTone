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

let lastMonitorBounds = null;

function monitorContainsCursor(monitor, cursor) {
  const left = monitor.position.x;
  const top = monitor.position.y;
  const right = left + monitor.size.width;
  const bottom = top + monitor.size.height;

  return cursor.x >= left && cursor.x < right && cursor.y >= top && cursor.y < bottom;
}

function monitorBounds(monitor) {
  return Object.freeze({
    x: monitor.position.x,
    y: monitor.position.y,
    width: monitor.size.width,
    height: monitor.size.height,
  });
}

function sameMonitor(left, right) {
  return Boolean(
    left &&
      right &&
      left.x === right.x &&
      left.y === right.y &&
      left.width === right.width &&
      left.height === right.height,
  );
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
    const bounds = monitorBounds(monitor);

    if (sameMonitor(bounds, lastMonitorBounds)) {
      return;
    }

    const window = await pickerWindow();
    await window.setPosition(
      new PhysicalPosition(monitor.position.x, monitor.position.y),
    );
    await window.setSize(
      new PhysicalSize(monitor.size.width, monitor.size.height),
    );
    lastMonitorBounds = bounds;
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
