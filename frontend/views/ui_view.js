// # 📄 Dosya Yolu: pixeltone/frontend/views/ui_view.js
// # 📌 Amac: PixelTone DOM ciktilarini ve event baglantilarini yonetmek
// # 📌 View - JavaScript
// # Version: 0.3.0
// # Aciklama: Tailwind, Palette Studio CRUD, renk adlandirma ve siralama ciktilarini cizer
//
// Bagimli Oldugu Katman: View

import { APP_CONFIG } from "../config/app_config.js";
import { TR_LABELS } from "../language/tr.js";

const dom = Object.freeze({
  hexInput: document.getElementById("hex-input"),
  nativeColorInput: document.getElementById("native-color-input"),
  convertButton: document.getElementById("convert-button"),
  captureButton: document.getElementById("capture-button"),
  projectNameInput: document.getElementById("project-name-input"),
  paletteNameInput: document.getElementById("palette-name-input"),
  savePaletteButton: document.getElementById("save-palette-button"),
  exportYamlButton: document.getElementById("export-yaml-button"),
  exportCssButton: document.getElementById("export-css-button"),
  importYamlButton: document.getElementById("import-yaml-button"),
  importYamlInput: document.getElementById("import-yaml-input"),
  statusText: document.getElementById("status-text"),
  colorPreview: document.getElementById("color-preview"),
  colorOutput: document.getElementById("color-output"),
  tailwindColorList: document.getElementById("tailwind-color-list"),
  historyList: document.getElementById("history-list"),
  paletteList: document.getElementById("palette-list"),
  magnifierGrid: document.getElementById("magnifier-grid"),
  capturePlatform: document.getElementById("capture-platform"),
  capturePosition: document.getElementById("capture-position"),
});

function formatPercent(value) {
  return `${Number(value).toFixed(2)}%`;
}

function createOutputRow(label, value) {
  const row = document.createElement("div");
  const labelElement = document.createElement("strong");
  const valueElement = document.createElement("span");

  row.className = "pt-output-item";
  labelElement.textContent = label;
  valueElement.textContent = value;
  row.append(labelElement, valueElement);

  return row;
}

function createMiniButton(label, handler, isDisabled = false, extraClass = "") {
  const button = document.createElement("button");
  button.className = `pt-mini-button ${extraClass}`.trim();
  button.type = "button";
  button.textContent = label;
  button.disabled = isDisabled;
  button.addEventListener("click", handler);
  return button;
}

export const uiView = Object.freeze({
  bindConvert(handler) {
    dom.convertButton.addEventListener("click", handler);
  },

  bindCapture(handler) {
    dom.captureButton.addEventListener("click", handler);
  },

  bindSavePalette(handler) {
    dom.savePaletteButton.addEventListener("click", handler);
  },

  bindProjectChange(handler) {
    dom.projectNameInput.addEventListener("change", handler);
  },

  bindExportYaml(handler) {
    dom.exportYamlButton.addEventListener("click", handler);
  },

  bindExportCss(handler) {
    dom.exportCssButton.addEventListener("click", handler);
  },

  bindImportYamlOpen(handler) {
    dom.importYamlButton.addEventListener("click", handler);
  },

  bindImportYamlFile(handler) {
    dom.importYamlInput.addEventListener("change", handler);
  },

  bindNativeColor(handler) {
    dom.nativeColorInput.addEventListener("input", handler);
  },

  getHexValue() {
    return dom.hexInput.value;
  },

  getProjectName() {
    return dom.projectNameInput.value;
  },

  getPaletteName() {
    return dom.paletteNameInput.value;
  },

  getImportFile(event) {
    return event.target.files?.[0] || null;
  },

  setHexValue(hex) {
    dom.hexInput.value = hex;
    dom.nativeColorInput.value = hex.toLowerCase();
  },

  setProjectName(projectName) {
    dom.projectNameInput.value = projectName;
  },

  setPaletteName(paletteName) {
    dom.paletteNameInput.value = paletteName;
  },

  setImportAccept(acceptValue) {
    dom.importYamlInput.accept = acceptValue;
  },

  openImportDialog() {
    dom.importYamlInput.value = "";
    dom.importYamlInput.click();
  },

  setStatus(message) {
    dom.statusText.textContent = message;
  },

  renderColorOutput(colorInfo) {
    dom.colorPreview.style.background = colorInfo.hex;
    dom.colorOutput.innerHTML = "";

    const rows = [
      [TR_LABELS.output.hex, colorInfo.hex],
      [TR_LABELS.output.rgb, `${colorInfo.rgb.red}, ${colorInfo.rgb.green}, ${colorInfo.rgb.blue}`],
      [
        TR_LABELS.output.hsl,
        `${Number(colorInfo.hsl.hue).toFixed(2)}, ${formatPercent(colorInfo.hsl.saturation)}, ${formatPercent(colorInfo.hsl.lightness)}`,
      ],
      [
        TR_LABELS.output.hsv,
        `${Number(colorInfo.hsv.hue).toFixed(2)}, ${formatPercent(colorInfo.hsv.saturation)}, ${formatPercent(colorInfo.hsv.value)}`,
      ],
      [
        TR_LABELS.output.cmyk,
        `${formatPercent(colorInfo.cmyk.cyan)}, ${formatPercent(colorInfo.cmyk.magenta)}, ${formatPercent(colorInfo.cmyk.yellow)}, ${formatPercent(colorInfo.cmyk.black)}`,
      ],
    ];

    rows.forEach(([label, value]) => dom.colorOutput.appendChild(createOutputRow(label, value)));
  },

  renderTailwindMatches(matches) {
    dom.tailwindColorList.innerHTML = "";

    if (!Array.isArray(matches) || matches.length === 0) {
      const empty = document.createElement("p");
      empty.className = "pt-status";
      empty.textContent = TR_LABELS.empty.tailwind;
      dom.tailwindColorList.appendChild(empty);
      return;
    }

    matches.forEach((match) => {
      const row = document.createElement("div");
      const swatch = document.createElement("span");
      const details = document.createElement("div");
      const name = document.createElement("strong");
      const value = document.createElement("span");
      const distance = document.createElement("span");

      row.className = "pt-tailwind-item";
      swatch.className = "pt-tailwind-swatch";
      swatch.style.background = match.value;
      details.className = "pt-tailwind-details";
      name.textContent = match.name;
      value.textContent = match.value;
      distance.className = "pt-tailwind-distance";
      distance.textContent = `${TR_LABELS.tailwind.distancePrefix}: ${Number(match.distance).toFixed(4)}`;
      details.append(name, value);
      row.append(swatch, details, distance);
      dom.tailwindColorList.appendChild(row);
    });
  },

  renderHistory(historyItems, onSelect, onRename, onMove) {
    dom.historyList.innerHTML = "";

    if (historyItems.length === 0) {
      const empty = document.createElement("p");
      empty.className = "pt-status";
      empty.textContent = TR_LABELS.empty.history;
      dom.historyList.appendChild(empty);
      return;
    }

    historyItems.forEach((item, index) => {
      const row = document.createElement("div");
      const main = document.createElement("div");
      const selectButton = document.createElement("button");
      const swatch = document.createElement("span");
      const hexLabel = document.createElement("strong");
      const nameInput = document.createElement("input");
      const actions = document.createElement("div");

      row.className = "pt-history-item";
      main.className = "pt-history-main";
      selectButton.className = "pt-history-select";
      selectButton.type = "button";
      swatch.className = "pt-swatch";
      swatch.style.background = item.hex;
      hexLabel.textContent = item.hex;
      selectButton.append(swatch, hexLabel);
      selectButton.addEventListener("click", () => onSelect(item.hex));

      nameInput.className = "pt-history-name";
      nameInput.type = "text";
      nameInput.value = item.name || item.hex;
      nameInput.placeholder = TR_LABELS.history.namePlaceholder;
      nameInput.addEventListener("change", () => onRename(index, nameInput.value));

      actions.className = "pt-history-actions";
      actions.append(
        createMiniButton(
          TR_LABELS.history.moveUp,
          () => onMove(index, APP_CONFIG.historyMove.up),
          index === 0,
        ),
        createMiniButton(
          TR_LABELS.history.moveDown,
          () => onMove(index, APP_CONFIG.historyMove.down),
          index === historyItems.length - 1,
        ),
      );

      main.append(selectButton, nameInput);
      row.append(main, actions);
      dom.historyList.appendChild(row);
    });
  },

  renderPalettes(palettes, onEdit, onDelete) {
    dom.paletteList.innerHTML = "";

    if (!Array.isArray(palettes) || palettes.length === 0) {
      const empty = document.createElement("p");
      empty.className = "pt-status";
      empty.textContent = TR_LABELS.empty.palettes;
      dom.paletteList.appendChild(empty);
      return;
    }

    palettes.forEach((palette) => {
      const row = document.createElement("div");
      const details = document.createElement("div");
      const name = document.createElement("strong");
      const project = document.createElement("span");
      const count = document.createElement("span");
      const actions = document.createElement("div");

      row.className = "pt-palette-item";
      details.className = "pt-palette-details";
      name.textContent = palette.name;
      project.textContent = `${TR_LABELS.palette.projectPrefix}: ${palette.project}`;
      count.textContent = `${palette.color_count} ${TR_LABELS.palette.colorCountSuffix}`;
      actions.className = "pt-palette-actions";
      actions.append(
        createMiniButton(TR_LABELS.palette.editAction, () => onEdit(palette)),
        createMiniButton(
          TR_LABELS.palette.deleteAction,
          () => {
            if (window.confirm(TR_LABELS.palette.deleteConfirm)) {
              onDelete(palette);
            }
          },
          false,
          "pt-mini-button-danger",
        ),
      );

      details.append(name, project);
      row.append(details, count, actions);
      dom.paletteList.appendChild(row);
    });
  },

  renderMagnifier(captureResult) {
    dom.magnifierGrid.innerHTML = "";

    if (!captureResult || !Array.isArray(captureResult.magnifier_pixels)) {
      const empty = document.createElement("p");
      empty.className = "pt-status";
      empty.textContent = TR_LABELS.empty.magnifier;
      dom.magnifierGrid.appendChild(empty);
      return;
    }

    dom.magnifierGrid.style.setProperty(
      "--pt-magnifier-columns",
      String(captureResult.magnifier_width),
    );

    captureResult.magnifier_pixels.forEach((pixel) => {
      const pixelElement = document.createElement("div");
      pixelElement.className = pixel.is_center
        ? "pt-magnifier-pixel pt-magnifier-pixel-center"
        : "pt-magnifier-pixel";
      pixelElement.style.background = pixel.hex;
      pixelElement.title = pixel.hex;
      dom.magnifierGrid.appendChild(pixelElement);
    });

    dom.capturePlatform.textContent = `${TR_LABELS.capture.platformPrefix}: ${captureResult.platform}`;
    dom.capturePosition.textContent = `${TR_LABELS.capture.positionPrefix}: ${captureResult.cursor.x}, ${captureResult.cursor.y}`;
  },
});
