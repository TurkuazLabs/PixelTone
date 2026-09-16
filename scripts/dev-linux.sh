#!/usr/bin/env bash
# 📄 Dosya Yolu: pixeltone/scripts/dev-linux.sh
# 📌 Amac: Linux/macOS ortaminda PixelTone gelistirme modunu baslatmak
# 📌 Tool - Bash
# Version: 0.1.0
# Aciklama: npm install ve Tauri dev komutunu calistirir

# Bagimli Oldugu Katman: Tool

set -e
cd "$(dirname "$0")/.."
npm install
npm run tauri dev
