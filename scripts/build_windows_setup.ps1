# 📄 Dosya Yolu: pixeltone/scripts/build_windows_setup.ps1
# 📌 Amac: PixelTone Windows NSIS Setup.exe paketini tek komutla uretmek
# 📌 Tool - PowerShell
# Version: 1.0.0
# Aciklama: Dependency lockfilelarini hazirlar, CI kontrollerini calistirir, NSIS setup build eder ve SHA256 dosyasi olusturur
#
# Bagimli Oldugu Katman: Tool

param(
    [switch]$SkipValidation,
    [switch]$Clean
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

function Convert-SecureStringToPlainText {
    param(
        [Parameter(Mandatory = $true)]
        [Security.SecureString]$SecureValue
    )

    $Pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureValue)

    try {
        return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($Pointer)
    }
    finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($Pointer)
    }
}

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
$OutputDir = Join-Path $Root "dist-installer"
$PackagePath = Join-Path $Root "package.json"
$ManagedSigningKey = $false
$ManagedSigningPassword = $false

Push-Location $Root

try {
    if (-not $IsWindows) {
        throw "PixelTone Setup.exe build Windows uzerinde calistirilmalidir."
    }

    $Package = Get-Content $PackagePath -Raw | ConvertFrom-Json
    $Version = [string]$Package.version

    if ([string]::IsNullOrWhiteSpace($Version)) {
        throw "package.json surumu okunamadi."
    }

    if ($Clean) {
        Invoke-Step -Name "Clean previous installer output" -Action {
            if (Test-Path $OutputDir) {
                Remove-Item $OutputDir -Recurse -Force
            }
        }
    }

    Invoke-Step -Name "Prepare package-lock.json" -Action {
        if (-not (Test-Path "package-lock.json")) {
            npm install --package-lock-only
        }
    }

    Invoke-Step -Name "Prepare Cargo.lock" -Action {
        if (-not (Test-Path "src-tauri/Cargo.lock")) {
            cargo generate-lockfile --manifest-path "src-tauri/Cargo.toml"
        }
    }

    Invoke-Step -Name "Install locked frontend dependencies" -Action {
        npm ci
    }

    if (-not $SkipValidation) {
        Invoke-Step -Name "Run Windows CI validation" -Action {
            & (Join-Path $PSScriptRoot "ci_windows.ps1") -SkipInstall
        }
    }

    Invoke-Step -Name "Check updater signing configuration" -Action {
        npm run check:updater
    }

    Invoke-Step -Name "Configure updater signing environment" -Action {
        if ([string]::IsNullOrWhiteSpace($env:TAURI_SIGNING_PRIVATE_KEY)) {
            $DefaultKeyPath = Join-Path $env:USERPROFILE ".tauri\pixeltone-updater.key"

            if (-not (Test-Path $DefaultKeyPath)) {
                throw "Updater private key bulunamadi. Once npm run configure:updater calistirin."
            }

            $env:TAURI_SIGNING_PRIVATE_KEY = $DefaultKeyPath
            $script:ManagedSigningKey = $true
        }

        if ([string]::IsNullOrWhiteSpace($env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD)) {
            $SecurePassword = Read-Host "Updater signing key sifresi" -AsSecureString
            $env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD = Convert-SecureStringToPlainText -SecureValue $SecurePassword
            $script:ManagedSigningPassword = $true
        }
    }

    Invoke-Step -Name "Generate platform icons" -Action {
        npm run tauri icon "src-tauri/icons/icon.png"
    }

    Invoke-Step -Name "Build signed NSIS Setup.exe" -Action {
        npm run tauri build -- --bundles nsis
    }

    Invoke-Step -Name "Collect Setup.exe" -Action {
        $BundleDir = Join-Path $Root "src-tauri/target/release/bundle/nsis"
        $Setup = Get-ChildItem -Path $BundleDir -Filter "*-setup.exe" -File |
            Sort-Object LastWriteTimeUtc -Descending |
            Select-Object -First 1

        if ($null -eq $Setup) {
            throw "NSIS Setup.exe bulunamadi: $BundleDir"
        }

        New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null

        $FinalName = "PixelTone-Setup-v$Version.exe"
        $FinalPath = Join-Path $OutputDir $FinalName
        Copy-Item $Setup.FullName $FinalPath -Force

        $Hash = Get-FileHash -Path $FinalPath -Algorithm SHA256
        $HashLine = "$($Hash.Hash.ToLowerInvariant())  $FinalName"
        $HashPath = "$FinalPath.sha256"
        Set-Content -Path $HashPath -Value $HashLine -Encoding ascii

        Write-Host ""
        Write-Host "Setup hazir:"
        Write-Host $FinalPath
        Write-Host "SHA256:"
        Write-Host $Hash.Hash
    }
}
finally {
    if ($ManagedSigningPassword) {
        Remove-Item Env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD -ErrorAction SilentlyContinue
    }

    if ($ManagedSigningKey) {
        Remove-Item Env:TAURI_SIGNING_PRIVATE_KEY -ErrorAction SilentlyContinue
    }

    Pop-Location
}
