# 📄 Dosya Yolu: pixeltone/scripts/configure_updater_signing.ps1
# 📌 Amac: PixelTone imzali updater anahtarlarini guvenli sekilde olusturmak ve GitHub Secrets ile yapilandirmak
# 📌 Tool - PowerShell
# Version: 1.0.1
# Aciklama: Windows PowerShell 5.1 ve PowerShell Core ile keypair uretir, GitHub Secrets'a aktarir ve public key'i repo config ile senkronlar
#
# Bagimli Oldugu Katman: Tool

param(
    [string]$Repo = "TurkuazLabs/PixelTone",
    [string]$KeyPath = "$env:USERPROFILE\.tauri\pixeltone-updater.key",
    [switch]$Force
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

if ($env:OS -ne "Windows_NT") {
    throw "Bu script Windows uzerinde calistirilmalidir."
}

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    throw "GitHub CLI bulunamadi. Once gh auth login calistirin."
}

gh auth status

if ($LASTEXITCODE -ne 0) {
    throw "GitHub CLI oturumu aktif degil. Once gh auth login calistirin."
}

$Root = Split-Path -Parent $PSScriptRoot
Push-Location $Root

try {
    $KeyDirectory = Split-Path -Parent $KeyPath
    New-Item -ItemType Directory -Path $KeyDirectory -Force | Out-Null

    if ((Test-Path $KeyPath) -and -not $Force) {
        throw "Updater private key zaten var: $KeyPath. Yenilemek icin -Force kullanin."
    }

    $SecurePassword = Read-Host "Updater signing key sifresi" -AsSecureString
    $Password = Convert-SecureStringToPlainText -SecureValue $SecurePassword

    if ([string]::IsNullOrWhiteSpace($Password)) {
        throw "Updater signing key sifresi bos olamaz."
    }

    $env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD = $Password

    Write-Host "Tauri updater keypair uretiliyor."
    $GenerateArgs = @("run", "tauri", "signer", "generate", "--", "-w", $KeyPath)

    if ($Force) {
        $GenerateArgs += "-f"
    }

    & npm @GenerateArgs

    if ($LASTEXITCODE -ne 0) {
        throw "Tauri signer key uretimi basarisiz."
    }

    $PublicKeyPath = "$KeyPath.pub"

    if (-not (Test-Path $PublicKeyPath)) {
        throw "Updater public key bulunamadi: $PublicKeyPath"
    }

    Write-Host "Public key PixelTone kaynak konfigurasyonuna yaziliyor."
    node "tools/set_updater_pubkey.mjs" $PublicKeyPath

    if ($LASTEXITCODE -ne 0) {
        throw "Updater public key kaynak konfigurasyonu basarisiz."
    }

    Write-Host "Private key GitHub Actions Secret olarak kaydediliyor."
    Get-Content $KeyPath -Raw | gh secret set TAURI_SIGNING_PRIVATE_KEY --repo $Repo

    if ($LASTEXITCODE -ne 0) {
        throw "TAURI_SIGNING_PRIVATE_KEY GitHub Secret kaydi basarisiz."
    }

    Write-Host "Signing password GitHub Actions Secret olarak kaydediliyor."
    $Password | gh secret set TAURI_SIGNING_PRIVATE_KEY_PASSWORD --repo $Repo

    if ($LASTEXITCODE -ne 0) {
        throw "TAURI_SIGNING_PRIVATE_KEY_PASSWORD GitHub Secret kaydi basarisiz."
    }

    Write-Host ""
    Write-Host "PixelTone updater signing hazir."
    Write-Host "Private key: $KeyPath"
    Write-Host "Public key: $PublicKeyPath"
    Write-Host "Repoda degisen public dosyalari commit edin:"
    Write-Host "  src-tauri/updater.pubkey"
    Write-Host "  src-tauri/tauri.conf.json5"
}
finally {
    Remove-Item Env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD -ErrorAction SilentlyContinue
    $Password = $null
    Pop-Location
}
