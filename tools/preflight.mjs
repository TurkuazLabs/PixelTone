// # 📄 Dosya Yolu: pixeltone/tools/preflight.mjs
// # 📌 Amac: PixelTone Stable Desktop build ve release oncesi hizli kalite kontrollerini tek komutta calistirmak
// # 📌 Tool - JavaScript
// # Version: 1.0.0
// # Aciklama: Surum, JSON/JSON5 parse ve opsiyonel release guard kontrollerini harici bagimlilik olmadan calistirir
//
// Bagimli Oldugu Katman: Tool

import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";

const RELEASE_FLAG = "--release";
const FILES = Object.freeze([
  "package.json",
  "src-tauri/capabilities/default.json",
  "src-tauri/tauri.conf.json5",
]);

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: process.platform === "win32",
      ...options,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} exit=${code}`));
    });
  });
}

function stripJson5Comments(content) {
  return content.replace(/^\s*\/\/.*$/gm, "");
}

async function validateConfigs() {
  for (const path of FILES) {
    const content = await readFile(path, "utf8");

    if (path.endsWith(".json5")) {
      JSON.parse(stripJson5Comments(content));
    } else {
      JSON.parse(content);
    }
  }

  process.stdout.write("Config parse kontrolu basarili.\n");
}

async function main() {
  const releaseMode = process.argv.includes(RELEASE_FLAG);

  await validateConfigs();
  await run("node", ["tools/check_version_consistency.mjs"]);

  if (releaseMode) {
    await run("node", ["tools/check_release_context.mjs"]);
    await run("node", ["tools/check_release_lockfiles.mjs"]);
  }

  process.stdout.write(
    releaseMode
      ? "PixelTone release preflight basarili.\n"
      : "PixelTone build preflight basarili.\n",
  );
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
