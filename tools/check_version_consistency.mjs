// # 📄 Dosya Yolu: pixeltone/tools/check_version_consistency.mjs
// # 📌 Amac: PixelTone release surumlerinin package, Cargo ve Tauri config arasinda ayni oldugunu dogrulamak
// # 📌 Tool - JavaScript
// # Version: 1.0.0
// # Aciklama: Harici bagimlilik kullanmadan uc ana surum kaynagini okuyup uyusmazlikta build'i durdurur
//
// Bagimli Oldugu Katman: Tool

import { readFile } from "node:fs/promises";

const FILES = Object.freeze({
  package: "package.json",
  cargo: "src-tauri/Cargo.toml",
  tauri: "src-tauri/tauri.conf.json5",
});

function matchVersion(content, pattern, sourceName) {
  const match = content.match(pattern);

  if (!match?.[1]) {
    throw new Error(`${sourceName} surumu okunamadi.`);
  }

  return match[1];
}

async function readVersions() {
  const [packageContent, cargoContent, tauriContent] = await Promise.all([
    readFile(FILES.package, "utf8"),
    readFile(FILES.cargo, "utf8"),
    readFile(FILES.tauri, "utf8"),
  ]);

  const packageVersion = JSON.parse(packageContent).version;
  const cargoVersion = matchVersion(
    cargoContent,
    /\[package\][\s\S]*?\nversion\s*=\s*"([^"]+)"/,
    FILES.cargo,
  );
  const tauriVersion = matchVersion(
    tauriContent,
    /"version"\s*:\s*"([^"]+)"/,
    FILES.tauri,
  );

  return {
    packageVersion,
    cargoVersion,
    tauriVersion,
  };
}

function assertConsistent(versions) {
  const unique = new Set(Object.values(versions));

  if (unique.size !== 1) {
    throw new Error(
      `PixelTone surum uyusmazligi: package=${versions.packageVersion}, cargo=${versions.cargoVersion}, tauri=${versions.tauriVersion}`,
    );
  }
}

async function main() {
  const versions = await readVersions();
  assertConsistent(versions);
  process.stdout.write(`PixelTone surum kontrolu basarili: ${versions.packageVersion}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
