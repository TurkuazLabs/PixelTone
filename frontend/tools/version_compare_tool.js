// # 📄 Dosya Yolu: pixeltone/frontend/tools/version_compare_tool.js
// # 📌 Amac: PixelTone surum metinlerini normalize etmek ve sayisal surum siralamasi yapmak
// # 📌 Tool - JavaScript
// # Version: 1.0.0
// # Aciklama: Harici bagimlilik olmadan v prefix, prerelease eki ve cok haneli semver segmentlerini karsilastirir
//
// Bagimli Oldugu Katman: Tool

export function normalizeVersion(value) {
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

export function compareVersions(left, right) {
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
