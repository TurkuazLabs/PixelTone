# 📄 Dosya Yolu: pixeltone/scripts/setup_self_hosted_runner.ps1
# 📌 Amac: GitHub hosted runner kotasindan bagimsiz PixelTone Windows self-hosted runner kurmak
# 📌 Tool - PowerShell
# Version: 1.0.0
# Aciklama: Actions Runner son surumunu indirir, PixelTone etiketiyle repository runner olarak kaydeder ve Windows service olarak kurar
#
# Bagimli Oldugu Katman: Tool

param(
    [Parameter(Mandatory = $true)]
    [string]$Token,

    [string]$RepoUrl = "https://github.com/TurkuazLabs/PixelTone",

    [string]$InstallDir = "C:\PixelToneRunner",

    [string]$RunnerName = $env:COMPUTERNAME
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

function Test-Administrator {
    $Identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $Principal = New-Object Security.Principal.WindowsPrincipal($Identity)
    return $Principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not $IsWindows) {
    throw "Self-hosted runner kurulumu Windows uzerinde calistirilmalidir."
}

if (-not (Test-Administrator)) {
    throw "PowerShell'i Yonetici olarak calistirin."
}

New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null

$Release = Invoke-RestMethod -Uri "https://api.github.com/repos/actions/runner/releases/latest" -Headers @{ "User-Agent" = "PixelTone-Runner-Setup" }

$Asset = $Release.assets |
    Where-Object { $_.name -match "^actions-runner-win-x64-.*\.zip$" } |
    Select-Object -First 1

if ($null -eq $Asset) {
    throw "Windows x64 GitHub Actions Runner paketi bulunamadi."
}

$ZipPath = Join-Path $env:TEMP $Asset.name

Write-Host "Runner indiriliyor: $($Asset.name)"
Invoke-WebRequest -Uri $Asset.browser_download_url -OutFile $ZipPath

Write-Host "Runner aciliyor: $InstallDir"
Expand-Archive -Path $ZipPath -DestinationPath $InstallDir -Force

Push-Location $InstallDir

try {
    Write-Host "Runner PixelTone reposuna kaydediliyor."

    & ".\config.cmd" --url $RepoUrl --token $Token --name $RunnerName --labels "pixeltone,windows,x64" --work "_work" --unattended --replace --runasservice

    Write-Host ""
    Write-Host "PixelTone self-hosted runner kuruldu."
    Write-Host "Etiketler: self-hosted, windows, x64, pixeltone"
}
finally {
    Pop-Location
}
