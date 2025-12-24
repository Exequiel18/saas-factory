# Script para hacer push automático
$BRANCH = "master"
$REMOTE_URL = "https://github.com/tu-usuario/tu-repo.git"

if ($REMOTE_URL -eq "https://github.com/tu-usuario/tu-repo.git") {
    Write-Host "⚠️  Necesitás configurar la URL del repo primero" -ForegroundColor Yellow
    Write-Host "Ejecutá: git remote add origin [tu-repo-url]"
    exit 1
}

Write-Host "📤 Haciendo push a GitHub..." -ForegroundColor Cyan
git push -u origin $BRANCH

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Push exitoso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎯 PRÓXIMO PASO: Deploy en Vercel" -ForegroundColor Cyan
    Write-Host "1. Ve a https://vercel.com"
    Write-Host "2. Importá tu repositorio"
    Write-Host "3. Configurá las variables (ver INSTRUCCIONES_VERCEL.md)"
    Write-Host "4. Deploy"
} else {
    Write-Host "❌ Error en push" -ForegroundColor Red
    Write-Host "Verificá que el repo existe y tenés permisos"
}
