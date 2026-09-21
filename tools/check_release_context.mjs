// # 📄 Dosya Yolu: pixeltone/tools/check_release_context.mjs
// # 📌 Amac: PixelTone release workflow'unun yalniz dogru branch veya surum tagi ile calismasini dogrulamak
// # 📌 Tool - JavaScript
// # Version: 1.0.0
// # Aciklama: Manual release icin main branch, tag release icin v<package.version> eslesmesini zorunlu tutar
//
// Bagimli Oldugu Katman: Tool

import { readFile } from "node:fs/promises";

const MAIN_REF = "refs/heads/main";
const TAG_PREFIX = "v";
const EVENT_PUSH = "push";
const EVENT_MANUAL = "workflow_dispatch";

async function packageVersion() {
  const content = await readFile("package.json", "utf8");
  return JSON.parse(content).version;
}

function fail(message) {
  throw new Error(message);
}

async function main() {
  const version = await packageVersion();
  const eventName = process.env.GITHUB_EVENT_NAME || "";
  const ref = process.env.GITHUB_REF || "";
  const refName = process.env.GITHUB_REF_NAME || "";

  if (eventName === EVENT_MANUAL) {
    if (ref !== MAIN_REF) {
      fail(`Manual release yalniz main branch uzerinden calisabilir. Ref: ${ref}`);
    }

    process.stdout.write(`Manual release context dogrulandi: ${version}\n`);
    return;
  }

  if (eventName === EVENT_PUSH) {
    const expectedTag = `${TAG_PREFIX}${version}`;

    if (refName !== expectedTag) {
      fail(`Release tag uyusmazligi: beklenen=${expectedTag}, gelen=${refName}`);
    }

    process.stdout.write(`Release tag dogrulandi: ${expectedTag}\n`);
    return;
  }

  fail(`Desteklenmeyen release eventi: ${eventName}`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
