// # 📄 Dosya Yolu: pixeltone/vite.config.js
// # 📌 Amac: PixelTone frontend build ayarlarini tanimlamak
// # 📌 Config - JavaScript
// # Version: 0.1.0
// # Aciklama: Vite root, dev server ve dist cikti ayarlari
//
// Bagimli Oldugu Katman: Config

import { defineConfig } from "vite";

const FRONTEND_ROOT = "frontend";
const DIST_DIR = "../dist";
const DEV_HOST = "127.0.0.1";
const DEV_PORT = 1420;

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
  },
});
