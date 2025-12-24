# Script para iniciar el servidor de desarrollo
Write-Host "🚀 Iniciando servidor de desarrollo..." -ForegroundColor Green

# Cambiar al directorio del proyecto
Set-Location "C:\Users\Exequiel rogers\Desktop\SAAS-FACTORY"

# Verificar que node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
}

# Iniciar el servidor
Write-Host "✅ Servidor iniciando en http://localhost:3000" -ForegroundColor Green
Write-Host "⏳ Esperá 10-15 segundos..." -ForegroundColor Yellow
npm run dev

