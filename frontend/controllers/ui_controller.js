// # 📄 Dosya Yolu: pixeltone/frontend/controllers/ui_controller.js
// # 📌 Amac: PixelTone arayuz olaylarini almak ve servisleri cagirmak
// # 📌 Controller - JavaScript
// # Version: 0.2.0
// # Aciklama: DOM detaylarini View katmanina birakir ve yalnizca servis akislarini tetikler
//
// Bagimli Oldugu Katman: Controller

import { TR_LABELS } from "../language/tr.js";
import { paletteService } from "../services/palette_service.js";
import { uiView } from "../views/ui_view.js";

let currentColor = null;

function errorMessage(error, fallback) {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return error?.message || fallback;
}

async function convertCurrentHex() {
  try {
    const colorInfo = await paletteService.convertHex(uiView.getHexValue());
    currentColor = colorInfo;
    uiView.setHexValue(colorInfo.hex);
    uiView.renderColorOutput(colorInfo);
    uiView.renderHistory(paletteService.addToHistory(colorInfo), selectHistoryColor);
    uiView.setStatus(TR_LABELS.status.converted);
  } catch (error) {
    uiView.setStatus(errorMessage(error, TR_LABELS.status.convertFailed));
  }
}

async function captureColor() {
  uiView.setStatus(TR_LABELS.status.capturePreparing);

  try {
    const captureResult = await paletteService.captureScreenColor();
    uiView.renderMagnifier(captureResult);
    uiView.setHexValue(captureResult.hex);
    await convertCurrentHex();
    uiView.setStatus(TR_LABELS.status.captureCompleted);
  } catch (error) {
    uiView.setStatus(errorMessage(error, TR_LABELS.status.captureFailed));
  }
}

async function savePalette() {
  if (!currentColor) {
    uiView.setStatus(TR_LABELS.status.paletteNeedsColor);
    return;
  }

  try {
    await paletteService.savePalette(uiView.getPaletteName(), paletteService.getHistory());
    uiView.renderPalettes(await paletteService.listPalettes());
    uiView.setStatus(TR_LABELS.status.paletteSaved);
  } catch (error) {
    uiView.setStatus(errorMessage(error, TR_LABELS.status.paletteSaveFailed));
  }
}

function selectHistoryColor(hex) {
  uiView.setHexValue(hex);
  void convertCurrentHex();
}

function syncNativeColor(event) {
  uiView.setHexValue(event.target.value);
}

async function boot() {
  uiView.bindConvert(convertCurrentHex);
  uiView.bindCapture(captureColor);
  uiView.bindSavePalette(savePalette);
  uiView.bindNativeColor(syncNativeColor);
  uiView.renderHistory(paletteService.getHistory(), selectHistoryColor);
  uiView.renderMagnifier(null);
  await convertCurrentHex();

  try {
    uiView.renderPalettes(await paletteService.listPalettes());
  } catch (_error) {
    uiView.renderPalettes([]);
  }
}

void boot();
