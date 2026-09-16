// # 📄 Dosya Yolu: pixeltone/frontend/controllers/ui_controller.js
// # 📌 Amac: PixelTone arayuz olaylarini almak ve servisleri cagirmak
// # 📌 Controller - JavaScript
// # Version: 0.1.0
// # Aciklama: DOM eventlerini yakalar, is mantigini palette_service uzerinden calistirir
//
// Bagimli Oldugu Katman: Controller

import { paletteService } from "../services/palette_service.js";

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
});

let currentColor = null;

function setStatus(message) {
  dom.statusText.textContent = message;
}

function formatPercent(value) {
  return `${Number(value).toFixed(2)}%`;
}

function renderColorOutput(colorInfo) {
  dom.colorPreview.style.background = colorInfo.hex;
  dom.colorOutput.innerHTML = "";

  const rows = [
    ["HEX", colorInfo.hex],
    ["RGB", `${colorInfo.rgb.red}, ${colorInfo.rgb.green}, ${colorInfo.rgb.blue}`],
    ["HSL", `${Number(colorInfo.hsl.hue).toFixed(2)}, ${formatPercent(colorInfo.hsl.saturation)}, ${formatPercent(colorInfo.hsl.lightness)}`],
    ["HSV", `${Number(colorInfo.hsv.hue).toFixed(2)}, ${formatPercent(colorInfo.hsv.saturation)}, ${formatPercent(colorInfo.hsv.value)}`],
    ["CMYK", `${formatPercent(colorInfo.cmyk.cyan)}, ${formatPercent(colorInfo.cmyk.magenta)}, ${formatPercent(colorInfo.cmyk.yellow)}, ${formatPercent(colorInfo.cmyk.black)}`],
  ];

  rows.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "pt-output-item";
    row.innerHTML = `<strong>${label}</strong><span>${value}</span>`;
    dom.colorOutput.appendChild(row);
  });
}

function renderHistory(historyItems) {
  dom.historyList.innerHTML = "";

  if (historyItems.length === 0) {
    dom.historyList.innerHTML = `<p class="pt-status">Henuz renk gecmisi yok.</p>`;
    return;
  }

  historyItems.forEach((item) => {
    const row = document.createElement("button");
    row.className = "pt-history-item";
    row.type = "button";
    row.innerHTML = `<span class="pt-swatch" style="background:${item.hex}"></span><strong>${item.hex}</strong>`;
    row.addEventListener("click", () => {
      dom.hexInput.value = item.hex;
      dom.nativeColorInput.value = item.hex.toLowerCase();
      convertCurrentHex();
    });
    dom.historyList.appendChild(row);
  });
}

function renderPalettes(palettes) {
  dom.paletteList.innerHTML = "";

  if (!Array.isArray(palettes) || palettes.length === 0) {
    dom.paletteList.innerHTML = `<p class="pt-status">Kayitli palet yok.</p>`;
    return;
  }

  palettes.forEach((palette) => {
    const row = document.createElement("div");
    row.className = "pt-palette-item";
    row.innerHTML = `<strong>${palette.name}</strong><span>${palette.color_count} renk</span>`;
    dom.paletteList.appendChild(row);
  });
}

async function convertCurrentHex() {
  try {
    const colorInfo = await paletteService.convertHex(dom.hexInput.value);
    currentColor = colorInfo;
    dom.hexInput.value = colorInfo.hex;
    dom.nativeColorInput.value = colorInfo.hex.toLowerCase();
    renderColorOutput(colorInfo);
    renderHistory(paletteService.addToHistory(colorInfo));
    setStatus("Renk donusturuldu.");
  } catch (error) {
    setStatus(error.message || "Renk donusturulemedi.");
  }
}

async function captureColor() {
  try {
    const captureResult = await paletteService.captureScreenColor();
    dom.hexInput.value = captureResult.hex;
    await convertCurrentHex();
  } catch (error) {
    setStatus(error.message || "Ekran yakalama henuz hazir degil.");
  }
}

async function savePalette() {
  if (!currentColor) {
    setStatus("Once bir renk donusturun.");
    return;
  }

  try {
    await paletteService.savePalette(dom.paletteNameInput.value, paletteService.getHistory());
    const palettes = await paletteService.listPalettes();
    renderPalettes(palettes);
    setStatus("Palet kaydedildi.");
  } catch (error) {
    setStatus(error.message || "Palet kaydedilemedi.");
  }
}

async function boot() {
  dom.convertButton.addEventListener("click", convertCurrentHex);
  dom.captureButton.addEventListener("click", captureColor);
  dom.savePaletteButton.addEventListener("click", savePalette);
  dom.nativeColorInput.addEventListener("input", (event) => {
    dom.hexInput.value = event.target.value;
  });

  renderHistory(paletteService.getHistory());
  await convertCurrentHex();

  try {
    renderPalettes(await paletteService.listPalettes());
  } catch (_error) {
    renderPalettes([]);
  }
}

boot();
