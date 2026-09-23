// # 📄 Dosya Yolu: pixeltone/frontend/views/picker_view.js
// # 📌 Amac: Canli picker overlay DOM ciktilarini ve input eventlerini yonetmek
// # 📌 View - JavaScript
// # Version: 1.2.0
// # Aciklama: 9x9 buyutec, HEX/RGB bilgisi, kopyalama modu ve cursor takipli bilgi kartini cizer
//
// Bagimli Oldugu Katman: View

import { APP_CONFIG } from "../config/app_config.js";

let currentLabels = null;

const dom = Object.freeze({
  overlay: document.getElementById("picker-overlay"),
  card: document.getElementById("picker-card"),
  grid: document.getElementById("picker-grid"),
  hex: document.getElementById("picker-hex"),
  rgb: document.getElementById("picker-rgb"),
  mode: document.getElementById("picker-mode"),
  instruction: document.getElementById("picker-instruction"),
  status: document.getElementById("picker-status"),
});

function formatRgb(colorInfo) {
  return `rgb(${colorInfo.rgb.red}, ${colorInfo.rgb.green}, ${colorInfo.rgb.blue})`;
}

export const pickerView = Object.freeze({
  initializeLabels(labels, shortcut) {
    currentLabels = labels;
    dom.instruction.textContent = currentLabels.picker.instruction;
    dom.status.textContent = `${currentLabels.picker.shortcutPrefix}: ${shortcut}`;
  },

  bindPointerMove(handler) {
    dom.overlay.addEventListener("pointermove", handler);
  },

  bindPointerDown(handler) {
    dom.overlay.addEventListener("pointerdown", handler);
  },

  bindKeyDown(handler) {
    window.addEventListener("keydown", handler);
  },

  bindVisibilityChange(handler) {
    document.addEventListener("visibilitychange", handler);
  },

  isVisible() {
    return document.visibilityState === APP_CONFIG.picker.visibleDocumentState;
  },

  positionCard(clientX, clientY) {
    const offset = APP_CONFIG.picker.cardOffsetPx;
    const margin = APP_CONFIG.picker.cardMarginPx;
    const cardWidth = dom.card.offsetWidth;
    const cardHeight = dom.card.offsetHeight;
    let left = clientX + offset;
    let top = clientY + offset;

    if (left + cardWidth + margin > window.innerWidth) {
      left = clientX - cardWidth - offset;
    }

    if (top + cardHeight + margin > window.innerHeight) {
      top = clientY - cardHeight - offset;
    }

    dom.card.style.left = `${Math.max(margin, left)}px`;
    dom.card.style.top = `${Math.max(margin, top)}px`;
  },

  renderCapture(captureResult, colorInfo, format) {
    dom.grid.innerHTML = "";
    dom.grid.style.setProperty(
      "--pt-picker-columns",
      String(captureResult.magnifier_width),
    );

    captureResult.magnifier_pixels.forEach((pixel) => {
      const pixelElement = document.createElement("div");
      pixelElement.className = pixel.is_center
        ? "pt-picker-pixel pt-picker-pixel-center"
        : "pt-picker-pixel";
      pixelElement.style.background = pixel.hex;
      dom.grid.appendChild(pixelElement);
    });

    dom.hex.textContent = colorInfo.hex;
    dom.rgb.textContent = formatRgb(colorInfo);
    dom.mode.textContent =
      format === APP_CONFIG.picker.copyFormats.rgb
        ? currentLabels.picker.copyModeRgb
        : currentLabels.picker.copyModeHex;
    dom.status.textContent = `${currentLabels.capture.positionPrefix}: ${captureResult.cursor.x}, ${captureResult.cursor.y}`;
  },

  renderError(error, fallback) {
    dom.status.textContent =
      typeof error === "string" && error.trim()
        ? error
        : error?.message || fallback;
  },
});
