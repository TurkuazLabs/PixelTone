// # 📄 Dosya Yolu: pixeltone/frontend/services/version_service.js
// # 📌 Amac: PixelTone kurulu surumu ile son public release surumunu karsilastirmak
// # 📌 Service - JavaScript
// # Version: 1.0.0
// # Aciklama: Version Tool sonucunu kullanir ve private/public release endpoint hatalarini guvenli sonuc modeline cevirir
//
// Bagimli Oldugu Katman: Service

import { appTool } from "../tools/app_tool.js";
import { releaseTool } from "../tools/release_tool.js";
import {
  compareVersions,
  normalizeVersion,
} from "../tools/version_compare_tool.js";

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
