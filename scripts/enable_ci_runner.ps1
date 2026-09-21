# 📄 Dosya Yolu: pixeltone/scripts/enable_ci_runner.ps1
# 📌 Amac: PixelTone Windows self-hosted CI runner kurulumunu GitHub CLI ile tek komuta indirmek
# 📌 Tool - PowerShell
# Version: 1.0.0
# Aciklama: gh auth kontrolu yapar, repository registration token alir ve runner bootstrap scriptini cagirir
#
# Bagimli Oldugu Katman: Tool

param(
    [string]$Repo = "TurkuazLabs/PixelTone",
    [string]$InstallDir = "C:\actions-runner",
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
    throw "Bu script Windows uzerinde calistirilmalidir."
}

if (-not (Test-Administrator)) {
    throw "PowerShell'i Yonetici olarak calistirin."
}

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    throw "GitHub CLI bulunamadi. Once gh kurun ve gh auth login calistirin."
}

Write-Host "GitHub CLI authentication kontrol ediliyor."
gh auth status

Write-Host "PixelTone runner registration token aliniyor."
$Token = gh api --method POST "repos/$Repo/actions/runners/registration-token" --jq ".token"

if ([string]::IsNullOrWhiteSpace($Token)) {
    throw "Runner registration token alinamadi."
}

$RepoUrl = "https://github.com/$Repo"
$Bootstrap = Join-Path $PSScriptRoot "setup_self_hosted_runner.ps1"

& $Bootstrap -Token $Token -RepoUrl $RepoUrl -InstallDir $InstallDir -RunnerName $RunnerName

Write-Host ""
Write-Host "Runner GitHub tarafinda kontrol ediliyor."
gh api "repos/$Repo/actions/runners" --jq ".runners[] | [.name, .status, (.labels | map(.name) | join(","))] | @tsv"
