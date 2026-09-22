# 📄 Dosya Yolu: pixeltone/scripts/build_windows_setup.ps1
# 📌 Amac: PixelTone Windows NSIS Setup.exe paketini tek komutla uretmek
# 📌 Tool - PowerShell
# Version: 1.1.0
# Aciklama: Ikonlari kaynak SVG'den yeniler, CI kontrollerini calistirir ve unsigned test NSIS setup artifactleri uretir
#
# Bagimli Oldugu Katman: Tool

param(
    [switch]$SkipValidation,
    [switch]$Clean
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
$ProductName = "PixelTone"
$OutputDirName = "dist-installer"
$SetupConfigRelativePath = "src-tauri/tauri.setup.conf.json5"
$IconSourceRelativePath = "src-tauri/icons/app-icon.svg"
$BundleRelativePath = "src-tauri/target/release/bundle/nsis"
$PackagePath = Join-Path $Root "package.json"
$OutputDir = Join-Path $Root $OutputDirName
$SetupConfigPath = Join-Path $Root $SetupConfigRelativePath
$IconSourcePath = Join-Path $Root $IconSourceRelativePath

Push-Location $Root

try {
    if (-not $IsWindows) {
        throw "$ProductName Setup.exe build Windows uzerinde calistirilmalidir."
    }

    if (-not (Test-Path $SetupConfigPath)) {
        throw "Setup config bulunamadi: $SetupConfigPath"
    }

    if (-not (Test-Path $IconSourcePath)) {
        throw "Ikon kaynak dosyasi bulunamadi: $IconSourcePath"
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

            if ($LASTEXITCODE -ne 0) {
                throw "package-lock.json hazirlama basarisiz."
            }
        }
    }

    Invoke-Step -Name "Prepare Cargo.lock" -Action {
        if (-not (Test-Path "src-tauri/Cargo.lock")) {
            cargo generate-lockfile --manifest-path "src-tauri/Cargo.toml"

            if ($LASTEXITCODE -ne 0) {
                throw "Cargo.lock hazirlama basarisiz."
            }
        }
    }

    Invoke-Step -Name "Install locked frontend dependencies" -Action {
        npm ci

        if ($LASTEXITCODE -ne 0) {
            throw "npm ci basarisiz."
        }
    }

    Invoke-Step -Name "Generate platform icons from canonical SVG" -Action {
        npm run tauri icon $IconSourceRelativePath

        if ($LASTEXITCODE -ne 0) {
            throw "Tauri icon generation basarisiz."
        }
    }

    if (-not $SkipValidation) {
        Invoke-Step -Name "Run Windows CI validation" -Action {
            & (Join-Path $PSScriptRoot "ci_windows.ps1") -SkipInstall
        }
    }

    Invoke-Step -Name "Build unsigned NSIS Setup.exe" -Action {
        npm run tauri build -- --config $SetupConfigRelativePath --bundles nsis

        if ($LASTEXITCODE -ne 0) {
            throw "NSIS Setup.exe build basarisiz."
        }
    }

    Invoke-Step -Name "Collect setup artifacts" -Action {
        $BundleDir = Join-Path $Root $BundleRelativePath
        $Setup = Get-ChildItem -Path $BundleDir -Filter "*-setup.exe" -File |
            Sort-Object LastWriteTimeUtc -Descending |
            Select-Object -First 1

        if ($null -eq $Setup) {
            throw "NSIS Setup.exe bulunamadi: $BundleDir"
        }

        New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null

        $FinalName = "$ProductName-Setup-v$Version.exe"
        $FinalPath = Join-Path $OutputDir $FinalName
        Copy-Item $Setup.FullName $FinalPath -Force

        $Hash = Get-FileHash -Path $FinalPath -Algorithm SHA256
        $HashValue = $Hash.Hash.ToLowerInvariant()
        $HashLine = "$HashValue  $FinalName"
        $HashPath = "$FinalPath.sha256"
        Set-Content -Path $HashPath -Value $HashLine -Encoding ascii

        $MetadataPath = Join-Path $OutputDir "$ProductName-Setup-v$Version.json"
        $Metadata = [ordered]@{
            product = $ProductName
            version = $Version
            file = $FinalName
            sha256 = $HashValue
            package_type = "nsis"
            updater_artifact = $false
            code_signed = $false
        }

        $Metadata | ConvertTo-Json | Set-Content -Path $MetadataPath -Encoding utf8

        Write-Host ""
        Write-Host "Setup hazir:"
        Write-Host $FinalPath
        Write-Host "SHA256:"
        Write-Host $Hash.Hash
        Write-Host "Metadata:"
        Write-Host $MetadataPath
    }
}
finally {
    Pop-Location
}
