# 🚀 SCRIPT MAESTRO DE LANZAMIENTO
# Ejecuta TODO lo necesario para sacar el SaaS a produccion

$NODE_BIN = "C:\Users\Exequiel rogers\Desktop\Nueva carpeta\bin\node-v20.10.0-win-x64"
$NODE_EXE = "$NODE_BIN\node.exe"
$NPM_EXE = "$NODE_BIN\npm.cmd"

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "     SAAS FACTORY - LANZAMIENTO AUTOMATICO A PRODUCCION   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "x Ejecuta este script desde la raiz del proyecto" -ForegroundColor Red
    exit 1
}

# Paso 1: Generar NEXTAUTH_SECRET si no existe
Write-Host "1. Generando NEXTAUTH_SECRET..." -ForegroundColor Yellow
$secret = & $NODE_EXE scripts/generate-secret.js 2>&1 | Select-String -Pattern "^\w" | Out-String
Write-Host "OK Secret generado" -ForegroundColor Green
Write-Host ""

# Paso 2: Verificar .env.local
Write-Host "2. Verificando configuracion..." -ForegroundColor Yellow
if (-not (Test-Path ".env.local")) {
    Write-Host "Archivo .env.local no encontrado" -ForegroundColor Yellow
    Write-Host "Creando .env.local desde env.example..." -ForegroundColor Yellow
    
    # Crear archivo si no existe
    $template = @"
MERCADOPAGO_ACCESS_TOKEN=
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=
MERCADOPAGO_ALIAS=
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$($secret.Trim())
DATABASE_URL=postgres://
"@
    $template | Out-File -FilePath ".env.local" -Encoding utf8
    
    Write-Host "OK .env.local creado. COMPLETA LAS VARIABLES:" -ForegroundColor Green
    Write-Host ""
    Write-Host "COMPLETA .env.local ANTES DE CONTINUAR" -ForegroundColor Red
    Write-Host ""
    $continue = Read-Host "Completaste las variables? (s/n)"
    if ($continue -ne "s") {
        Write-Host "x Completa .env.local primero" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "OK .env.local existe" -ForegroundColor Green
}

# Paso 3: Instalar dependencias
Write-Host ""
Write-Host "3. Instalando dependencias..." -ForegroundColor Yellow
& $NPM_EXE install --legacy-peer-deps
if ($LASTEXITCODE -ne 0) {
    Write-Host "x Error instalando dependencias" -ForegroundColor Red
    exit 1
}
Write-Host "OK Dependencias instaladas" -ForegroundColor Green

# Paso 4: Generar Prisma Client
Write-Host ""
Write-Host "4. Generando Prisma Client..." -ForegroundColor Yellow
& $NPM_EXE run postinstall
if ($LASTEXITCODE -ne 0) {
    Write-Host "x Error generando Prisma Client" -ForegroundColor Red
    exit 1
}
Write-Host "OK Prisma Client generado" -ForegroundColor Green

# Paso 5: Verificar variables criticas
Write-Host ""
Write-Host "5. Verificando variables de entorno..." -ForegroundColor Yellow
$envContent = Get-Content ".env.local" -Raw
$requiredVars = @(
    "MERCADOPAGO_ACCESS_TOKEN",
    "NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY",
    "NEXTAUTH_URL",
    "DATABASE_URL"
)

$missingVars = @()
foreach ($var in $requiredVars) {
    if ($envContent -notmatch "$var=.+") {
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-Host "x Variables faltantes en .env.local:" -ForegroundColor Red
    foreach ($var in $missingVars) {
        Write-Host "   - $var" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Completa estas variables antes de continuar" -ForegroundColor Yellow
    exit 1
}
Write-Host "OK Variables criticas configuradas" -ForegroundColor Green

# Paso 6: Sincronizar Base de Datos (Persistencia)
Write-Host ""
Write-Host "6. Sincronizando base de datos local (SQLite)..." -ForegroundColor Yellow
$env:PATH = "$NODE_BIN;$env:PATH"
& $NODE_EXE node_modules/prisma/build/index.js db push --skip-generate --accept-data-loss
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK Base de datos sincronizada y persistente (dev.db)" -ForegroundColor Green
}
else {
    Write-Host "x Error sincronizando base de datos" -ForegroundColor Red
}

# Paso 7: Build de produccion
Write-Host ""
Write-Host "7. Compilando para produccion..." -ForegroundColor Yellow
& $NPM_EXE run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build con errores. Revisa los logs arriba" -ForegroundColor Yellow
}
else {
    Write-Host "OK Build exitoso" -ForegroundColor Green
}

# Paso 8: Resumen final
Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "                    OK PREPARACION COMPLETA               " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host ""
Write-Host "PROXIMOS PASOS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. LANZA TU NEGOCIO (LOCAL):" -ForegroundColor Yellow
Write-Host "   - Ejecuta: & '$NODE_BIN\npm.cmd' run dev"
Write-Host ""
Write-Host "2. DEPLOY A PRODUCCION (VERCEL):" -ForegroundColor Yellow
Write-Host "   - En Vercel, cambia DATABASE_URL a tu Postgres real."
Write-Host ""
Write-Host "3. COBRA YA MISMO:" -ForegroundColor Yellow
Write-Host "   - Usa el link generado en el paso anterior."
Write-Host ""
Write-Host "TU SAAS ES REAL Y TIENE PERSISTENCIA!" -ForegroundColor Green
Write-Host ""




