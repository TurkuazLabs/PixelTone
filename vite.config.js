// # 📄 Dosya Yolu: pixeltone/vite.config.js
// # 📌 Amac: PixelTone ana UI ve picker overlay build ayarlarini tanimlamak
// # 📌 Config - JavaScript
// # Version: 0.4.0
// # Aciklama: Vite root, coklu HTML entry, dev server ve dist cikti ayarlarini tanimlar
//
// Bagimli Oldugu Katman: Config

import { resolve } from "node:path";

import { defineConfig } from "vite";

const FRONTEND_ROOT = "frontend";
const DIST_DIR = "../dist";
const DEV_HOST = "127.0.0.1";
const DEV_PORT = 1420;
const MAIN_ENTRY = "index.html";
const PICKER_ENTRY = "picker.html";

export default defineConfig({
  root: FRONTEND_ROOT,
  clearScreen: false,
  server: {
    host: DEV_HOST,
    port: DEV_PORT,
    strictPort: true,
  },
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    outDir: DIST_DIR,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(FRONTEND_ROOT, MAIN_ENTRY),
        picker: resolve(FRONTEND_ROOT, PICKER_ENTRY),
      },
    },
  },
});
