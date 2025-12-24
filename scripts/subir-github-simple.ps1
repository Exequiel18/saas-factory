# 📤 SUBIR A GITHUB - PowerShell
# Ejecutá este script con la URL de tu repo

param(
    [Parameter(Mandatory=$true)]
    [string]$RepoUrl
)

Write-Host ""
Write-Host "📤 SUBIR CÓDIGO A GITHUB" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Verificar si ya existe remote
try {
    $existing = git remote get-url origin 2>$null
    if ($existing) {
        Write-Host "⚠️  Ya existe un remote: $existing" -ForegroundColor Yellow
        $replace = Read-Host "¿Reemplazarlo? (s/n)"
        if ($replace -eq "s") {
            git remote set-url origin $RepoUrl
            Write-Host "✅ Remote actualizado" -ForegroundColor Green
        } else {
            Write-Host "Usando remote existente" -ForegroundColor Yellow
        }
    }
} catch {
    # No hay remote, agregarlo
    Write-Host "Agregando remote..." -ForegroundColor Yellow
    git remote add origin $RepoUrl
    Write-Host "✅ Remote agregado" -ForegroundColor Green
}

Write-Host ""
Write-Host "📤 Haciendo push..." -ForegroundColor Yellow
Write-Host ""

# Intentar push a main
try {
    git push -u origin main
    Write-Host ""
    Write-Host "✅ Push exitoso!" -ForegroundColor Green
} catch {
    # Intentar con master
    Write-Host "Intentando con 'master'..." -ForegroundColor Yellow
    try {
        git push -u origin master
        Write-Host ""
        Write-Host "✅ Push exitoso!" -ForegroundColor Green
    } catch {
        Write-Host ""
        Write-Host "❌ Error en push" -ForegroundColor Red
        Write-Host "Verificá que:" -ForegroundColor Yellow
        Write-Host "1. El repositorio existe en GitHub"
        Write-Host "2. Tenés permisos"
        Write-Host "3. Estás autenticado"
    }
}

Write-Host ""
Write-Host "🎯 PRÓXIMO PASO: Deploy en Vercel" -ForegroundColor Cyan
Write-Host ""

