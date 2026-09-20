// # 📄 Dosya Yolu: pixeltone/frontend/controllers/picker_controller.js
// # 📌 Amac: Picker overlay input olaylarini alip PickerService katmanina aktarmak
// # 📌 Controller - JavaScript
// # Version: 0.4.0
// # Aciklama: Canli sample, H/R format secimi, sol tik kopyalama ve Esc iptal olaylarini Service katmanina yonlendirir
//
// Bagimli Oldugu Katman: Controller

import { APP_CONFIG } from "../config/app_config.js";
import { TR_LABELS } from "../language/tr.js";
import { pickerService } from "../services/picker_service.js";
import { pickerView } from "../views/picker_view.js";

let currentSample = null;
let copyFormat = APP_CONFIG.picker.defaultCopyFormat;
let sampleTimer = null;
let sampleBusy = false;

function errorMessage(error, fallback) {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return error?.message || fallback;
}

async function sampleColor() {
  if (sampleBusy || !pickerView.isVisible()) {
    return;
  }

  sampleBusy = true;

  try {
    currentSample = await pickerService.sampleLiveColor();
    pickerView.renderCapture(
      currentSample.capture,
      currentSample.colorInfo,
      copyFormat,
    );
  } catch (error) {
    pickerView.renderError(errorMessage(error, TR_LABELS.status.pickerSampleFailed));
  } finally {
    sampleBusy = false;
  }
}

function startSampling() {
  if (sampleTimer !== null) {
    return;
  }

  void sampleColor();
  sampleTimer = window.setInterval(
    () => void sampleColor(),
    APP_CONFIG.picker.sampleIntervalMs,
  );
}

function stopSampling() {
  if (sampleTimer === null) {
    return;
  }

  window.clearInterval(sampleTimer);
  sampleTimer = null;
}

function pointerMove(event) {
  pickerView.positionCard(event.clientX, event.clientY);
}

async function pointerDown(event) {
  if (
    event.button !== APP_CONFIG.picker.primaryPointerButton ||
    !currentSample
  ) {
    return;
  }

  stopSampling();

  try {
    await pickerService.copySelection(currentSample, copyFormat);
  } catch (error) {
    pickerView.renderError(errorMessage(error, TR_LABELS.status.pickerCopyFailed));
    startSampling();
  }
}

function keyDown(event) {
  if (event.code === APP_CONFIG.picker.keys.cancel) {
    stopSampling();
    void pickerService.closePicker();
    return;
  }

  if (event.code === APP_CONFIG.picker.keys.hex) {
    copyFormat = APP_CONFIG.picker.copyFormats.hex;
  } else if (event.code === APP_CONFIG.picker.keys.rgb) {
    copyFormat = APP_CONFIG.picker.copyFormats.rgb;
  } else {
    return;
  }

  if (currentSample) {
    pickerView.renderCapture(
      currentSample.capture,
      currentSample.colorInfo,
      copyFormat,
    );
  }
}

function visibilityChanged() {
  if (pickerView.isVisible()) {
    startSampling();
  } else {
    stopSampling();
  }
}

function boot() {
  pickerView.initializeLabels(APP_CONFIG.picker.shortcut);
  pickerView.bindPointerMove(pointerMove);
  pickerView.bindPointerDown((event) => void pointerDown(event));
  pickerView.bindKeyDown(keyDown);
  pickerView.bindVisibilityChange(visibilityChanged);

  if (pickerView.isVisible()) {
    startSampling();
  }
}

boot();
