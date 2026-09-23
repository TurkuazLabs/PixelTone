// # 📄 Dosya Yolu: pixeltone/frontend/controllers/ui_controller.js
// # 📌 Amac: PixelTone arayuz olaylarini almak ve servisleri cagirmak
// # 📌 Controller - JavaScript
// # Version: 1.2.0
// # Aciklama: Live Picker secimi, capture, Tailwind ve Palette Studio olaylarini Service katmanina aktarir
//
// Bagimli Oldugu Katman: Controller

import { APP_CONFIG } from "../config/app_config.js";
import { languageService } from "../services/language_service.js";
import { preferenceService } from "../services/preference_service.js";
import { paletteService } from "../services/palette_service.js";
import { pickerService } from "../services/picker_service.js";
import { tailwindColorService } from "../services/tailwind_color_service.js";
import { uiView } from "../views/ui_view.js";

let currentColor = null;

function labels() {
  return languageService.getLabels();
}

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

function renderHistory(historyItems = paletteService.getHistory()) {
  uiView.renderHistory(
    historyItems,
    selectHistoryColor,
    renameHistoryColor,
    moveHistoryColor,
  );
}

function renderSelectedColor(colorInfo, addToHistory) {
  currentColor = colorInfo;
  uiView.setHexValue(colorInfo.hex);
  uiView.renderColorOutput(colorInfo);

  if (addToHistory) {
    renderHistory(paletteService.addToHistory(colorInfo));
  }

  renderTailwindMatches(colorInfo.hex);
}

async function convertCurrentHex() {
  try {
    const colorInfo = await paletteService.convertHex(uiView.getHexValue());
    renderSelectedColor(colorInfo, true);
    uiView.setStatus(labels().status.converted);
  } catch (error) {
    uiView.setStatus(errorMessage(error, labels().status.convertFailed));
  }
}

async function captureColor() {
  uiView.setStatus(labels().status.capturePreparing);

  try {
    const captureResult = await paletteService.captureScreenColor();
    uiView.renderMagnifier(captureResult);
    uiView.setHexValue(captureResult.hex);
    await convertCurrentHex();
    uiView.setStatus(labels().status.captureCompleted);
  } catch (error) {
    uiView.setStatus(errorMessage(error, labels().status.captureFailed));
  }
}

async function openLivePicker() {
  try {
    await pickerService.openPicker();
    uiView.setStatus(labels().status.pickerStarted);
  } catch (error) {
    uiView.setStatus(errorMessage(error, labels().status.pickerStartFailed));
  }
}

function acceptPickerSelection(selection) {
  uiView.renderMagnifier(selection.capture);
  renderSelectedColor(selection.colorInfo, true);
  uiView.setStatus(`${labels().status.pickerSelected} ${selection.text}`);
}

async function refreshPalettes(projectName) {
  uiView.renderPalettes(
    await paletteService.listPalettes(projectName),
    editPalette,
    deletePalette,
  );
}

async function changeProject() {
  const projectName = paletteService.setProjectName(uiView.getProjectName());
  uiView.setProjectName(projectName);

  try {
    await refreshPalettes(projectName);
    uiView.setStatus(labels().status.projectChanged);
  } catch (error) {
    uiView.setStatus(errorMessage(error, labels().status.paletteSaveFailed));
  }
}

async function savePalette() {
  if (!currentColor) {
    uiView.setStatus(labels().status.paletteNeedsColor);
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
    uiView.setStatus(labels().status.paletteSaved);
  } catch (error) {
    uiView.setStatus(errorMessage(error, labels().status.paletteSaveFailed));
  }
}

async function editPalette(palette) {
  try {
    const editState = await paletteService.beginPaletteEdit(palette.project, palette.name);
    currentColor = editState.selectedColor;
    uiView.setProjectName(editState.project);
    uiView.setPaletteName(editState.name);
    renderHistory(editState.history);

    if (editState.selectedColor) {
      renderSelectedColor(editState.selectedColor, false);
    }

    uiView.setStatus(labels().status.paletteEditing);
  } catch (error) {
    uiView.setStatus(errorMessage(error, labels().status.paletteEditFailed));
  }
}

async function deletePalette(palette) {
  try {
    await paletteService.deletePalette(palette.project, palette.name);
    await refreshPalettes(paletteService.getProjectName());
    uiView.setStatus(labels().status.paletteDeleted);
  } catch (error) {
    uiView.setStatus(errorMessage(error, labels().status.paletteDeleteFailed));
  }
}

async function selectHistoryColor(hex) {
  try {
    const colorInfo = await paletteService.convertHex(hex);
    renderSelectedColor(colorInfo, false);
    uiView.setStatus(labels().status.converted);
  } catch (error) {
    uiView.setStatus(errorMessage(error, labels().status.convertFailed));
  }
}

function renameHistoryColor(index, name) {
  renderHistory(paletteService.renameHistoryColor(index, name));
}

function moveHistoryColor(index, offset) {
  renderHistory(paletteService.moveHistoryColor(index, offset));
}

async function exportPalette(format) {
  const colors = paletteService.getHistory();

  if (colors.length === 0) {
    uiView.setStatus(labels().status.paletteNeedsColor);
    return;
  }

  const projectName = paletteService.setProjectName(uiView.getProjectName());
  uiView.setProjectName(projectName);

  try {
    await paletteService.exportPalette(projectName, uiView.getPaletteName(), colors, format);
    uiView.setStatus(labels().status.exportCompleted);
  } catch (error) {
    uiView.setStatus(errorMessage(error, labels().status.exportFailed));
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
    uiView.setStatus(labels().status.importCompleted);
  } catch (error) {
    uiView.setStatus(errorMessage(error, labels().status.importFailed));
  }
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

async function initializePicker() {
  uiView.initializePickerControls(
    APP_CONFIG.defaults.settings.pickerShortcut,
  );
  uiView.bindLivePicker(() => void openLivePicker());
  await pickerService.onSelection(acceptPickerSelection);
}

async function boot() {
  await preferenceService.initialize();
  uiView.initializeLabels(labels());
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
  renderHistory();
  uiView.renderTailwindMatches([]);
  uiView.renderMagnifier(null);
  await initializePicker();
  await convertCurrentHex();

  try {
    await refreshPalettes(projectName);
  } catch (_error) {
    uiView.renderPalettes([], editPalette, deletePalette);
  }
}

void boot();
