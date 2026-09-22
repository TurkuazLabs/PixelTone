// # 📄 Dosya Yolu: pixeltone/tools/check_updater_config.mjs
// # 📌 Amac: PixelTone updater public key ve Tauri config tutarliligini dogrulamak
// # 📌 Tool - JavaScript
// # Version: 1.0.0
// # Aciklama: Placeholder key, bos key veya updater.pubkey ile tauri.conf.json5 uyusmazligini build oncesi engeller
//
// Bagimli Oldugu Katman: Tool

import { readFile } from "node:fs/promises";

const PUBLIC_KEY_FILE = "src-tauri/updater.pubkey";
const TAURI_CONFIG = "src-tauri/tauri.conf.json5";
const PLACEHOLDER = "PIXELTONE_UPDATER_NOT_CONFIGURED";

function configPublicKey(content) {
  const match = content.match(/"updater"\s*:\s*\{[\s\S]*?"pubkey"\s*:\s*"([^"]+)"/);

  if (!match?.[1]) {
    throw new Error("Tauri updater pubkey config bulunamadi.");
  }

  return match[1].trim();
}

async function main() {
  const [keyContent, configContent] = await Promise.all([
    readFile(PUBLIC_KEY_FILE, "utf8"),
    readFile(TAURI_CONFIG, "utf8"),
  ]);

  const fileKey = keyContent.trim();
  const configKey = configPublicKey(configContent);

  if (!fileKey || fileKey === PLACEHOLDER || configKey === PLACEHOLDER) {
    throw new Error(
      "PixelTone updater signing yapilandirilmadi. scripts/configure_updater_signing.ps1 calistirin.",
    );
  }

  if (fileKey !== configKey) {
    throw new Error("Updater public key dosyasi ile Tauri config uyusmuyor.");
  }

  process.stdout.write("PixelTone updater signing konfigurasyonu hazir.\n");
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
