// # 📄 Dosya Yolu: pixeltone/tests/preflight_tools.test.mjs
// # 📌 Amac: PixelTone build/release guard scriptlerinin beklenen davranisini otomatik dogrulamak
// # 📌 Tool - JavaScript
// # Version: 1.0.0
// # Aciklama: Node yerlesik test runner ile surum, release context ve lockfile guard senaryolarini test eder
//
// Bagimli Oldugu Katman: Tool

import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function workspace() {
  const root = await mkdtemp(resolve(tmpdir(), "pixeltone-test-"));
  await mkdir(resolve(root, "src-tauri"), { recursive: true });
  return root;
}

async function writeVersions(root, packageVersion, cargoVersion, tauriVersion) {
  await writeFile(
    resolve(root, "package.json"),
    JSON.stringify({ version: packageVersion }),
  );
  await writeFile(
    resolve(root, "src-tauri", "Cargo.toml"),
    `[package]\nname = "pixeltone"\nversion = "${cargoVersion}"\n`,
  );
  await writeFile(
    resolve(root, "src-tauri", "tauri.conf.json5"),
    `{ "version": "${tauriVersion}" }\n`,
  );
}

async function runScript(scriptName, cwd, env = {}) {
  return execFileAsync(
    process.execPath,
    [resolve(ROOT, "tools", scriptName)],
    {
      cwd,
      env: {
        ...process.env,
        ...env,
      },
    },
  );
}

test("version guard accepts matching versions", async () => {
  const root = await workspace();
  await writeVersions(root, "1.0.0", "1.0.0", "1.0.0");

  const result = await runScript("check_version_consistency.mjs", root);

  assert.match(result.stdout, /1\.0\.0/);
});

test("version guard rejects mismatched versions", async () => {
  const root = await workspace();
  await writeVersions(root, "1.0.0", "1.0.1", "1.0.0");

  await assert.rejects(
    runScript("check_version_consistency.mjs", root),
    /surum uyusmazligi/,
  );
});

test("release context accepts manual main release", async () => {
  const root = await workspace();
  await writeFile(
    resolve(root, "package.json"),
    JSON.stringify({ version: "1.0.0" }),
  );

  const result = await runScript(
    "check_release_context.mjs",
    root,
    {
      GITHUB_EVENT_NAME: "workflow_dispatch",
      GITHUB_REF: "refs/heads/main",
      GITHUB_REF_NAME: "main",
    },
  );

  assert.match(result.stdout, /Manual release context dogrulandi/);
});

test("release context rejects wrong version tag", async () => {
  const root = await workspace();
  await writeFile(
    resolve(root, "package.json"),
    JSON.stringify({ version: "1.0.0" }),
  );

  await assert.rejects(
    runScript(
      "check_release_context.mjs",
      root,
      {
        GITHUB_EVENT_NAME: "push",
        GITHUB_REF: "refs/tags/v1.0.1",
        GITHUB_REF_NAME: "v1.0.1",
      },
    ),
    /Release tag uyusmazligi/,
  );
});

test("release lockfile guard rejects missing lockfiles", async () => {
  const root = await workspace();

  await assert.rejects(
    runScript("check_release_lockfiles.mjs", root),
    /Release lockfile eksik/,
  );
});

test("release lockfile guard accepts committed lockfiles", async () => {
  const root = await workspace();
  await writeFile(resolve(root, "package-lock.json"), "{}\n");
  await writeFile(resolve(root, "src-tauri", "Cargo.lock"), "# lock\n");

  const result = await runScript("check_release_lockfiles.mjs", root);

  assert.match(result.stdout, /lockfile kontrolu basarili/);
});
