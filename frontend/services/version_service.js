// # 📄 Dosya Yolu: pixeltone/frontend/services/version_service.js
// # 📌 Amac: PixelTone kurulu surumu ile son public release surumunu karsilastirmak
// # 📌 Service - JavaScript
// # Version: 1.0.0
// # Aciklama: Semver karsilastirmasi yapar ve private/public release endpoint hatalarini guvenli sonuc modeline cevirir
//
// Bagimli Oldugu Katman: Service

import { appTool } from "../tools/app_tool.js";
import { releaseTool } from "../tools/release_tool.js";

function normalizeVersion(value) {
  return String(value || "")
    .trim()
    .replace(/^v/i, "")
    .split("-")[0];
}

function versionParts(value) {
  return normalizeVersion(value)
    .split(".")
    .map((part) => Number.parseInt(part, 10) || 0);
}

function compareVersions(left, right) {
  const leftParts = versionParts(left);
  const rightParts = versionParts(right);
  const maxLength = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < maxLength; index += 1) {
    const leftValue = leftParts[index] || 0;
    const rightValue = rightParts[index] || 0;

    if (leftValue > rightValue) {
      return 1;
    }

    if (leftValue < rightValue) {
      return -1;
    }
  }

  return 0;
}

export const versionService = Object.freeze({
  async checkLatest() {
    let currentVersion = "";

    try {
      currentVersion = await appTool.getVersion();
      const release = await releaseTool.getLatestRelease();
      const latestVersion = normalizeVersion(release.tagName);

      return {
        available: true,
        currentVersion,
        latestVersion,
        updateAvailable:
          compareVersions(currentVersion, latestVersion) < 0,
        releaseUrl: release.releaseUrl,
        publishedAt: release.publishedAt,
      };
    } catch (error) {
      return {
        available: false,
        currentVersion,
        latestVersion: "",
        updateAvailable: false,
        releaseUrl: "",
        publishedAt: "",
        error: error?.message || String(error),
      };
    }
  },
});
