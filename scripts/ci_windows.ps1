# 📄 Dosya Yolu: pixeltone/scripts/ci_windows.ps1
# 📌 Amac: GitHub hosted runner kullanmadan PixelTone Windows CI kontrollerini yerelde calistirmak
# 📌 Tool - PowerShell
# Version: 1.0.1
# Aciklama: Preflight, Node testleri, frontend build, Rust format, cargo check ve unit testleri calistirir
#
# Bagimli Oldugu Katman: Tool

param(
    [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

function Invoke-Step {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Name,
        [Parameter(Mandatory = $true)]
        [scriptblock]$Action
    )

    Write-Host ""
    Write-Host "==> $Name"
    & $Action
}

$Root = Split-Path -Parent $PSScriptRoot
Push-Location $Root

try {
    Invoke-Step -Name "Check Windows" -Action {
        if ($env:OS -ne "Windows_NT") {
            throw "Bu script Windows uzerinde calistirilmalidir."
        }
    }

    Invoke-Step -Name "Check Node" -Action {
        node --version
        npm --version
    }

    Invoke-Step -Name "Check Rust" -Action {
        rustc --version
        cargo --version
    }

    if (-not $SkipInstall) {
        Invoke-Step -Name "Install frontend dependencies" -Action {
            if (Test-Path "package-lock.json") {
                npm ci
            } else {
                npm install
            }
        }
    }

    Invoke-Step -Name "Run preflight" -Action {
        npm run preflight
    }

    Invoke-Step -Name "Run dependency-free tool tests" -Action {
        npm run test:tools
    }

    Invoke-Step -Name "Build frontend" -Action {
        npm run build
    }

    Invoke-Step -Name "Check Rust formatting" -Action {
        Push-Location "src-tauri"
        try {
            cargo fmt --all -- --check
        } finally {
            Pop-Location
        }
    }

    Invoke-Step -Name "Check Rust backend" -Action {
        Push-Location "src-tauri"
        try {
            cargo check
        } finally {
            Pop-Location
        }
    }

    Invoke-Step -Name "Run Rust unit tests" -Action {
        Push-Location "src-tauri"
        try {
            cargo test --lib
        } finally {
            Pop-Location
        }
    }

    Write-Host ""
    Write-Host "PixelTone Windows CI kontrolleri basarili."
}
finally {
    Pop-Location
}
