# Script para iniciar el servidor de desarrollo

Write-Host "🚀 Iniciando servidor de desarrollo..." -ForegroundColor Green
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Buscar npm
$npmPath = $null

# Buscar en node_modules local
if (Test-Path "node_modules\.bin\npm.cmd") {
    $npmPath = "node_modules\.bin\npm.cmd"
}
# Buscar en AppData
elseif (Test-Path "$env:APPDATA\npm\npm.cmd") {
    $npmPath = "$env:APPDATA\npm\npm.cmd"
}
# Buscar en Program Files
elseif (Test-Path "${env:ProgramFiles}\nodejs\npm.cmd") {
    $npmPath = "${env:ProgramFiles}\nodejs\npm.cmd"
}
# Buscar en Program Files (x86)
elseif (Test-Path "${env:ProgramFiles(x86)}\nodejs\npm.cmd") {
    $npmPath = "${env:ProgramFiles(x86)}\nodejs\npm.cmd"
}
# Buscar en PATH
else {
    $npmPath = Get-Command npm -ErrorAction SilentlyContinue
    if ($npmPath) {
        $npmPath = $npmPath.Source
    }
}

if (-not $npmPath) {
    Write-Host "❌ ERROR: No se encontró npm" -ForegroundColor Red
    Write-Host ""
    Write-Host "Instalá Node.js desde: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "✅ Usando npm en: $npmPath" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Iniciando servidor en http://localhost:3000" -ForegroundColor Cyan
Write-Host "💡 Presiona Ctrl+C para detener" -ForegroundColor Yellow
Write-Host ""

& $npmPath run dev

