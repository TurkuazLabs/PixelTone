// # 📄 Dosya Yolu: pixeltone/frontend/tools/release_tool.js
// # 📌 Amac: Public release metadata kaynagini VersionService katmanindan soyutlamak
// # 📌 Tool - JavaScript
// # Version: 1.0.0
// # Aciklama: Config ile tanimlanan GitHub Releases API endpointinden son release bilgisini okur
//
// Bagimli Oldugu Katman: Tool

import { APP_CONFIG } from "../config/app_config.js";

export const releaseTool = Object.freeze({
  async getLatestRelease() {
    const response = await fetch(APP_CONFIG.update.releaseApiUrl, {
      headers: {
        [APP_CONFIG.update.acceptHeaderName]:
          APP_CONFIG.update.acceptHeaderValue,
      },
    });

    if (!response.ok) {
      throw new Error(`Release API HTTP ${response.status}`);
    }

    const release = await response.json();

    return {
      tagName: release.tag_name,
      releaseUrl: release.html_url,
      publishedAt: release.published_at,
    };
  },
});
