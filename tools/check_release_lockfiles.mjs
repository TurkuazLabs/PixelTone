// # 📄 Dosya Yolu: pixeltone/tools/check_release_lockfiles.mjs
// # 📌 Amac: PixelTone Stable Desktop release oncesi dependency lockfile'larini zorunlu tutmak
// # 📌 Tool - JavaScript
// # Version: 1.0.0
// # Aciklama: package-lock.json ve src-tauri/Cargo.lock yoksa release build'ini durdurur
//
// Bagimli Oldugu Katman: Tool

import { access } from "node:fs/promises";

const REQUIRED_LOCKFILES = Object.freeze([
  "package-lock.json",
  "src-tauri/Cargo.lock",
]);

async function assertExists(path) {
  try {
    await access(path);
  } catch (_error) {
    throw new Error(`Release lockfile eksik: ${path}`);
  }
}

async function main() {
  await Promise.all(REQUIRED_LOCKFILES.map(assertExists));
  process.stdout.write("PixelTone release lockfile kontrolu basarili.\n");
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
