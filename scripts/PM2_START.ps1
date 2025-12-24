# PM2 START SCRIPT (Elite Vision)
Write-Host "🚀 Iniciando Ecosistema SaaS Factory con PM2..." -ForegroundColor Cyan

$NODE_BIN = "C:\Users\Exequiel rogers\Desktop\Nueva carpeta\bin\node-v20.10.0-win-x64"
$env:PATH = "$NODE_BIN;$env:PATH"

# Verificar si PM2 está instalado
$pm2_path = & $NODE_BIN\npm.cmd config get prefix
$pm2_bin = "$pm2_path\pm2.cmd"

if (!(Test-Path $pm2_bin)) {
    Write-Host "Installing PM2..." -ForegroundColor Yellow
    & $NODE_BIN\npm.cmd install -g pm2
}

Write-Host "Iniciando procesos..." -ForegroundColor Yellow
& $NODE_BIN\node.exe "$pm2_path\node_modules\pm2\bin\pm2" start ecosystem.config.js

Write-Host ""
Write-Host "===============================" -ForegroundColor Green
Write-Host "   SISTEMA ONLINE (PM2)        " -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green
Write-Host ""
Write-Host "Para ver el estado ejecuta: pm2 list"
Write-Host "Para ver logs ejecuta: pm2 logs"
