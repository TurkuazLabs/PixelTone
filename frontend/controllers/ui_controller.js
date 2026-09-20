// # 📄 Dosya Yolu: pixeltone/frontend/controllers/ui_controller.js
// # 📌 Amac: PixelTone arayuz olaylarini almak ve servisleri cagirmak
// # 📌 Controller - JavaScript
// # Version: 0.3.0
// # Aciklama: Capture, Tailwind, proje, palet ve transfer olaylarini Service katmanina aktarir
//
// Bagimli Oldugu Katman: Controller

import { APP_CONFIG } from "../config/app_config.js";
import { TR_LABELS } from "../language/tr.js";
import { paletteService } from "../services/palette_service.js";
import { tailwindColorService } from "../services/tailwind_color_service.js";
import { uiView } from "../views/ui_view.js";

let currentColor = null;

function errorMessage(error, fallback) {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return error?.message || fallback;
}

function renderTailwindMatches(hexValue) {
  try {
    uiView.renderTailwindMatches(tailwindColorService.findNearest(hexValue));
  } catch (_error) {
    uiView.renderTailwindMatches([]);
  }
}

async function convertCurrentHex() {
  try {
    const colorInfo = await paletteService.convertHex(uiView.getHexValue());
    currentColor = colorInfo;
    uiView.setHexValue(colorInfo.hex);
    uiView.renderColorOutput(colorInfo);
    uiView.renderHistory(paletteService.addToHistory(colorInfo), selectHistoryColor);
    renderTailwindMatches(colorInfo.hex);
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

async function refreshPalettes(projectName) {
  uiView.renderPalettes(await paletteService.listPalettes(projectName));
}

async function changeProject() {
  const projectName = paletteService.setProjectName(uiView.getProjectName());
  uiView.setProjectName(projectName);

  try {
    await refreshPalettes(projectName);
    uiView.setStatus(TR_LABELS.status.projectChanged);
  } catch (error) {
    uiView.setStatus(errorMessage(error, TR_LABELS.status.paletteSaveFailed));
  }
}

async function savePalette() {
  if (!currentColor) {
    uiView.setStatus(TR_LABELS.status.paletteNeedsColor);
    return;
  }

  const projectName = paletteService.setProjectName(uiView.getProjectName());
  uiView.setProjectName(projectName);

  try {
    await paletteService.savePalette(
      projectName,
      uiView.getPaletteName(),
      paletteService.getHistory(),
    );
    await refreshPalettes(projectName);
    uiView.setStatus(TR_LABELS.status.paletteSaved);
  } catch (error) {
    uiView.setStatus(errorMessage(error, TR_LABELS.status.paletteSaveFailed));
  }
}

async function exportPalette(format) {
  const colors = paletteService.getHistory();

  if (colors.length === 0) {
    uiView.setStatus(TR_LABELS.status.paletteNeedsColor);
    return;
  }

  const projectName = paletteService.setProjectName(uiView.getProjectName());
  uiView.setProjectName(projectName);

  try {
    await paletteService.exportPalette(projectName, uiView.getPaletteName(), colors, format);
    uiView.setStatus(TR_LABELS.status.exportCompleted);
  } catch (error) {
    uiView.setStatus(errorMessage(error, TR_LABELS.status.exportFailed));
  }
}

async function importPalette(event) {
  const file = uiView.getImportFile(event);

  if (!file) {
    return;
  }

  try {
    const response = await paletteService.importPalette(file);
    uiView.setProjectName(response.project);
    await refreshPalettes(response.project);
    uiView.setStatus(TR_LABELS.status.importCompleted);
  } catch (error) {
    uiView.setStatus(errorMessage(error, TR_LABELS.status.importFailed));
  }
}

function selectHistoryColor(hex) {
  uiView.setHexValue(hex);
  void convertCurrentHex();
}

function syncNativeColor(event) {
  uiView.setHexValue(event.target.value);
}

function openImportDialog() {
  uiView.openImportDialog();
}

function exportYaml() {
  void exportPalette(APP_CONFIG.exportFormats.yaml);
}

function exportCss() {
  void exportPalette(APP_CONFIG.exportFormats.css);
}

async function boot() {
  const projectName = paletteService.getProjectName();

  uiView.setProjectName(projectName);
  uiView.setImportAccept(APP_CONFIG.fileTypes.yamlAccept);
  uiView.bindConvert(convertCurrentHex);
  uiView.bindCapture(captureColor);
  uiView.bindProjectChange(changeProject);
  uiView.bindSavePalette(savePalette);
  uiView.bindExportYaml(exportYaml);
  uiView.bindExportCss(exportCss);
  uiView.bindImportYamlOpen(openImportDialog);
  uiView.bindImportYamlFile(importPalette);
  uiView.bindNativeColor(syncNativeColor);
  uiView.renderHistory(paletteService.getHistory(), selectHistoryColor);
  uiView.renderTailwindMatches([]);
  uiView.renderMagnifier(null);
  await convertCurrentHex();

  try {
    await refreshPalettes(projectName);
  } catch (_error) {
    uiView.renderPalettes([]);
  }
}

void boot();
