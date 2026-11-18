# 📄 Dosya Yolu: pixeltone/scripts/build_windows_setup.ps1
# 📌 Amac: PixelTone TurkuazInstaller ile PixelTone Windows Setup EXE uretmek
# 📌 Tool - PowerShell
# Version: 1.1.3
# Aciklama: Ikonlari kaynak SVG'den yeniler, CI kontrollerini calistirir ve Rust TurkuazInstaller .tzpkg ve yerel setup artifactleri uretir
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
$RustExeRelativePath = "src-tauri/target/release/pixeltone.exe"
$InstallerCommit = "10101dee8b6efe4775f5cf72aa05f3a3da934bfa"
$InstallerCheckout = Join-Path $Root "dist-installer-engine"
$PackagePath = Join-Path $Root "package.json"
$OutputDir = Join-Path $Root $OutputDirName
$SetupConfigPath = Join-Path $Root $SetupConfigRelativePath
$IconSourcePath = Join-Path $Root $IconSourceRelativePath

Push-Location $Root

try {
    if ($env:OS -ne "Windows_NT") {
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

    # @dev-id PT-TI-SETUP-001
    # Build the app without NSIS, and use the pinned Community Rust engine.
    Invoke-Step -Name "Build Windows application without bundling" -Action {
        npm run tauri build -- --config $SetupConfigRelativePath --no-bundle
        if ($LASTEXITCODE -ne 0) { throw "PixelTone Windows EXE build basarisiz." }
    }

    Invoke-Step -Name "Build pinned TurkuazInstaller engine" -Action {
        if (-not (Test-Path -LiteralPath $InstallerCheckout -PathType Container)) {
            & git clone --no-checkout 'https://github.com/TurkuazLabs/TurkuazInstaller.git' $InstallerCheckout
            if ($LASTEXITCODE -ne 0) { throw "TurkuazInstaller clone basarisiz." }
        }
        & git -C $InstallerCheckout checkout --detach $InstallerCommit
        if ($LASTEXITCODE -ne 0) { throw "TurkuazInstaller pinned checkout basarisiz." }
        $checkedCommit = (& git -C $InstallerCheckout rev-parse HEAD).Trim()
        if ($LASTEXITCODE -ne 0 -or $checkedCommit -cne $InstallerCommit) {
            throw "TurkuazInstaller source commit identity mismatch."
        }
        & cargo build --locked --manifest-path (Join-Path $InstallerCheckout 'rust/Cargo.toml') -p turkuaz-installer-cli --release --bin turkuaz-installer --features setup-authoring-gui
        if ($LASTEXITCODE -ne 0) { throw "TurkuazInstaller Rust build basarisiz." }
    }

    Invoke-Step -Name "Build TurkuazInstaller package and Windows Setup" -Action {
        $Executable = Join-Path $Root $RustExeRelativePath
        if (-not (Test-Path -LiteralPath $Executable -PathType Leaf)) {
            throw "PixelTone Windows executable bulunamadi: $Executable"
        }
        $Cli = Join-Path $InstallerCheckout 'rust/target/release/turkuaz-installer.exe'
        if (-not (Test-Path -LiteralPath $Cli -PathType Leaf)) { throw "TurkuazInstaller CLI bulunamadi." }
        $Payload = Join-Path $OutputDir 'payload'
        New-Item -ItemType Directory -Path $Payload -Force | Out-Null
        Copy-Item -LiteralPath $Executable -Destination (Join-Path $Payload 'pixeltone.exe') -Force
        $Package = Join-Path $OutputDir "$ProductName-v$Version.tzpkg"
        $FinalName = "$ProductName-Setup-v$Version.exe"
        $FinalPath = Join-Path $OutputDir $FinalName
        & $Cli build-package --package-id com.turkuazlabs.pixeltone --version $Version --source $Payload --output $Package --executable pixeltone.exe
        if ($LASTEXITCODE -ne 0) { throw "TurkuazInstaller package build basarisiz." }
        & $Cli build-native-setup --stub $Cli --package $Package --output $FinalPath
        if ($LASTEXITCODE -ne 0) { throw "TurkuazInstaller Setup build basarisiz." }
        $Hash = Get-FileHash -LiteralPath $FinalPath -Algorithm SHA256
        $HashValue = $Hash.Hash.ToLowerInvariant()
        $HashLine = "$HashValue  $FinalName"
        Set-Content -LiteralPath "$FinalPath.sha256" -Value $HashLine -Encoding ascii
        $MetadataPath = Join-Path $OutputDir "$ProductName-Setup-v$Version.json"
        $Metadata = [ordered]@{
            product = $ProductName
            version = $Version
            file = $FinalName
            sha256 = $HashValue
            package_type = "turkuaz-installer-native"
            installer_version = "0.2.24"
            installer_source_commit = $InstallerCommit
            updater_artifact = $false
            code_signed = $false
        }
        $Metadata | ConvertTo-Json | Set-Content -LiteralPath $MetadataPath -Encoding utf8
        Write-Host "TurkuazInstaller Setup: $FinalPath"
    }
}
finally {
    Pop-Location
}
