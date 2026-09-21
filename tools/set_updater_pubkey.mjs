// # 📄 Dosya Yolu: pixeltone/tools/set_updater_pubkey.mjs
// # 📌 Amac: Tauri updater public key degerini kaynak dosya ve config ile senkronlamak
// # 📌 Tool - JavaScript
// # Version: 1.0.0
// # Aciklama: Tauri signer tarafindan uretilen base64 public key'i updater.pubkey ve tauri.conf.json5 icine guvenli sekilde yazar
//
// Bagimli Oldugu Katman: Tool

import { readFile, writeFile } from "node:fs/promises";

const PUBLIC_KEY_TARGET = "src-tauri/updater.pubkey";
const TAURI_CONFIG = "src-tauri/tauri.conf.json5";
const PLACEHOLDER = "PIXELTONE_UPDATER_NOT_CONFIGURED";

function publicKeyPath() {
  const value = process.argv[2];

  if (!value) {
    throw new Error("Public key dosya yolu eksik.");
  }

  return value;
}

function validatePublicKey(value) {
  const key = String(value || "").trim();

  if (!key || key === PLACEHOLDER) {
    throw new Error("Updater public key bos veya placeholder olamaz.");
  }

  if (!/^[A-Za-z0-9+/=]+$/.test(key)) {
    throw new Error("Updater public key beklenen base64 formatinda degil.");
  }

  return key;
}

async function main() {
  const sourcePath = publicKeyPath();
  const key = validatePublicKey(await readFile(sourcePath, "utf8"));
  const config = await readFile(TAURI_CONFIG, "utf8");

  if (!config.includes('"updater"')) {
    throw new Error("Tauri updater config bulunamadi.");
  }

  const nextConfig = config.replace(
    /("pubkey"\s*:\s*")[^"]*(")/,
    `$1${key}$2`,
  );

  if (nextConfig === config) {
    throw new Error("Tauri updater pubkey alani guncellenemedi.");
  }

  await writeFile(PUBLIC_KEY_TARGET, `${key}\n`, "utf8");
  await writeFile(TAURI_CONFIG, nextConfig, "utf8");

  process.stdout.write("PixelTone updater public key kaynak ve config ile senkronlandi.\n");
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
