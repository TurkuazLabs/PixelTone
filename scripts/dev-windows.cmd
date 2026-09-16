@REM # 📄 Dosya Yolu: pixeltone/scripts/dev-windows.cmd
@REM # 📌 Amac: Windows ortaminda PixelTone gelistirme modunu baslatmak
@REM # 📌 Tool - CMD
@REM # Version: 0.1.0
@REM # Aciklama: npm install ve Tauri dev komutunu calistirir
@REM
@REM Bagimli Oldugu Katman: Tool

@echo off
cd /d "%~dp0.."
npm install
npm run tauri dev
