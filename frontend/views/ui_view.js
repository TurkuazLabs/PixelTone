// # 📄 Dosya Yolu: pixeltone/frontend/views/ui_view.js
// # 📌 Amac: PixelTone DOM ciktilarini ve event baglantilarini yonetmek
// # 📌 View - JavaScript
// # Version: 0.2.0
// # Aciklama: Controller katmanini DOM detaylarindan ayirir ve buyutec panelini cizer
//
// Bagimli Oldugu Katman: View

import { TR_LABELS } from "../language/tr.js";

const dom = Object.freeze({
  hexInput: document.getElementById("hex-input"),
  nativeColorInput: document.getElementById("native-color-input"),
  convertButton: document.getElementById("convert-button"),
  captureButton: document.getElementById("capture-button"),
  savePaletteButton: document.getElementById("save-palette-button"),
  paletteNameInput: document.getElementById("palette-name-input"),
  statusText: document.getElementById("status-text"),
  colorPreview: document.getElementById("color-preview"),
  colorOutput: document.getElementById("color-output"),
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

  bindNativeColor(handler) {
    dom.nativeColorInput.addEventListener("input", handler);
  },

  getHexValue() {
    return dom.hexInput.value;
  },

  getPaletteName() {
    return dom.paletteNameInput.value;
  },

  setHexValue(hex) {
    dom.hexInput.value = hex;
    dom.nativeColorInput.value = hex.toLowerCase();
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

  renderHistory(historyItems, onSelect) {
    dom.historyList.innerHTML = "";

    if (historyItems.length === 0) {
      const empty = document.createElement("p");
      empty.className = "pt-status";
      empty.textContent = TR_LABELS.empty.history;
      dom.historyList.appendChild(empty);
      return;
    }

    historyItems.forEach((item) => {
      const row = document.createElement("button");
      const swatch = document.createElement("span");
      const label = document.createElement("strong");

      row.className = "pt-history-item";
      row.type = "button";
      swatch.className = "pt-swatch";
      swatch.style.background = item.hex;
      label.textContent = item.hex;
      row.append(swatch, label);
      row.addEventListener("click", () => onSelect(item.hex));
      dom.historyList.appendChild(row);
    });
  },

  renderPalettes(palettes) {
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
      const name = document.createElement("strong");
      const count = document.createElement("span");

      row.className = "pt-palette-item";
      name.textContent = palette.name;
      count.textContent = `${palette.color_count} renk`;
      row.append(name, count);
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
