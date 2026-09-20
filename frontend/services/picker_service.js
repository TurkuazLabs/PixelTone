// # 📄 Dosya Yolu: pixeltone/frontend/services/picker_service.js
// # 📌 Amac: Global shortcut, live capture, kopyalama ve overlay is kurallarini yonetmek
// # 📌 Service - JavaScript
// # Version: 0.4.0
// # Aciklama: Picker oturumu, sample dongusu, HEX/RGB modu, secim ve ana pencereye aktarim kurallarini koordine eder
//
// Bagimli Oldugu Katman: Service

import { APP_CONFIG } from "../config/app_config.js";
import { clipboardTool } from "../tools/clipboard_tool.js";
import { eventTool } from "../tools/event_tool.js";
import { intervalTool } from "../tools/interval_tool.js";
import { pickerWindowTool } from "../tools/picker_window_tool.js";
import { shortcutTool } from "../tools/shortcut_tool.js";
import { tauriBridge } from "../tools/tauri_bridge.js";

let active = false;
let visible = false;
let sampleBusy = false;
let sampleIntervalId = null;
let currentSample = null;
let copyFormat = APP_CONFIG.picker.defaultCopyFormat;
let sampleHandler = null;
let errorHandler = null;

function formatRgb(colorInfo) {
  return [
    APP_CONFIG.picker.rgbFormat.prefix,
    colorInfo.rgb.red,
    APP_CONFIG.picker.rgbFormat.separator,
    colorInfo.rgb.green,
    APP_CONFIG.picker.rgbFormat.separator,
    colorInfo.rgb.blue,
    APP_CONFIG.picker.rgbFormat.suffix,
  ].join("");
}

async function openPicker() {
  await pickerWindowTool.showAtCursor();
  await eventTool.emitToWindow(
    APP_CONFIG.picker.windowLabel,
    APP_CONFIG.picker.activationEvent,
    {},
  );
}

async function colorInfoForCapture(captureResult) {
  return tauriBridge.invokeCommand(APP_CONFIG.commands.convertHexColor, {
    hex: captureResult.hex,
  });
}

function notifySample() {
  if (sampleHandler && currentSample) {
    sampleHandler({
      ...currentSample,
      copyFormat,
    });
  }
}

function notifyError(error) {
  if (errorHandler) {
    errorHandler(error);
  }
}

async function sampleOnce() {
  if (!active || !visible || sampleBusy) {
    return;
  }

  sampleBusy = true;

  try {
    await pickerWindowTool.syncToCursorMonitor();
    const capture = await tauriBridge.invokeCommand(
      APP_CONFIG.commands.captureScreenColor,
    );
    const colorInfo = await colorInfoForCapture(capture);
    currentSample = { capture, colorInfo };
    notifySample();
  } catch (error) {
    notifyError(error);
  } finally {
    sampleBusy = false;
  }
}

function stopSampling() {
  intervalTool.stop(sampleIntervalId);
  sampleIntervalId = null;
}

function startSampling() {
  if (!active || !visible || sampleIntervalId !== null) {
    return;
  }

  void sampleOnce();
  sampleIntervalId = intervalTool.start(
    () => void sampleOnce(),
    APP_CONFIG.picker.sampleIntervalMs,
  );
}

function setCopyFormat(format) {
  copyFormat = format;
  notifySample();
}

async function copyCurrentSelection() {
  if (!currentSample) {
    return null;
  }

  const normalizedFormat =
    copyFormat === APP_CONFIG.picker.copyFormats.rgb
      ? APP_CONFIG.picker.copyFormats.rgb
      : APP_CONFIG.picker.copyFormats.hex;
  const text =
    normalizedFormat === APP_CONFIG.picker.copyFormats.rgb
      ? formatRgb(currentSample.colorInfo)
      : currentSample.colorInfo.hex;

  stopSampling();
  await clipboardTool.writeText(text);

  const selection = {
    capture: currentSample.capture,
    colorInfo: currentSample.colorInfo,
    format: normalizedFormat,
    text,
  };

  await eventTool.emitToWindow(
    APP_CONFIG.picker.mainWindowLabel,
    APP_CONFIG.picker.selectionEvent,
    selection,
  );
  active = false;
  await pickerWindowTool.hide();

  return selection;
}

async function cancelSession() {
  active = false;
  currentSample = null;
  stopSampling();
  await pickerWindowTool.hide();
}

export const pickerService = Object.freeze({
  async initializeGlobalShortcut() {
    await shortcutTool.replace(APP_CONFIG.picker.shortcut, () => {
      void openPicker().catch(notifyError);
    });
  },

  async openPicker() {
    await openPicker();
  },

  startSession(onSample, onError) {
    active = true;
    visible = true;
    currentSample = null;
    copyFormat = APP_CONFIG.picker.defaultCopyFormat;
    sampleHandler = onSample;
    errorHandler = onError;
    startSampling();
  },

  setVisibility(isVisible) {
    visible = Boolean(isVisible);

    if (visible) {
      startSampling();
    } else {
      stopSampling();
    }
  },

  handlePointerButton(button) {
    if (
      button !== APP_CONFIG.picker.primaryPointerButton ||
      !active ||
      !currentSample
    ) {
      return;
    }

    void copyCurrentSelection().catch((error) => {
      notifyError(error);
      startSampling();
    });
  },

  handleKey(code) {
    if (code === APP_CONFIG.picker.keys.cancel) {
      void cancelSession().catch(notifyError);
      return;
    }

    if (code === APP_CONFIG.picker.keys.hex) {
      setCopyFormat(APP_CONFIG.picker.copyFormats.hex);
      return;
    }

    if (code === APP_CONFIG.picker.keys.rgb) {
      setCopyFormat(APP_CONFIG.picker.copyFormats.rgb);
    }
  },

  async onActivation(handler) {
    return eventTool.listenEvent(APP_CONFIG.picker.activationEvent, handler);
  },

  async onSelection(handler) {
    return eventTool.listenEvent(APP_CONFIG.picker.selectionEvent, handler);
  },
});
