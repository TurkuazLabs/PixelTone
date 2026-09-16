@REM # 📄 Dosya Yolu: pixeltone/scripts/build-windows.cmd
@REM # 📌 Amac: Windows ortaminda PixelTone release build almak
@REM # 📌 Tool - CMD
@REM # Version: 0.1.0
@REM # Aciklama: npm install ve Tauri build komutunu calistirir
@REM
@REM Bagimli Oldugu Katman: Tool

@echo off
cd /d "%~dp0.."
npm install
npm run tauri build
