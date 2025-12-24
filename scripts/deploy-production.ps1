# Script de Deploy Automático para Producción
# Ejecuta: .\scripts\deploy-production.ps1

Write-Host "🚀 SAAS FACTORY - DEPLOY A PRODUCCIÓN" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar Node.js
Write-Host "1️⃣ Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js no encontrado. Instala Node.js 18+ primero." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js $nodeVersion instalado" -ForegroundColor Green

# 2. Verificar variables de entorno críticas
Write-Host ""
Write-Host "2️⃣ Verificando variables de entorno..." -ForegroundColor Yellow
$requiredVars = @(
    "MERCADOPAGO_ACCESS_TOKEN",
    "NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY",
    "NEXTAUTH_URL",
    "NEXTAUTH_SECRET",
    "DATABASE_URL"
)

$missingVars = @()
foreach ($var in $requiredVars) {
    $value = [System.Environment]::GetEnvironmentVariable($var, "Process")
    if (-not $value) {
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-Host "❌ Variables faltantes:" -ForegroundColor Red
    foreach ($var in $missingVars) {
        Write-Host "   - $var" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "📝 Crea un archivo .env.local con estas variables:" -ForegroundColor Yellow
    Write-Host "   MERCADOPAGO_ACCESS_TOKEN=APP_USR-..."
    Write-Host "   NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-..."
    Write-Host "   MERCADOPAGO_ALIAS=tu_alias.mp"
    Write-Host "   NEXTAUTH_URL=https://tu-dominio.com"
    Write-Host "   NEXTAUTH_SECRET=$(node scripts/generate-secret.js)"
    Write-Host "   DATABASE_URL=postgres://..."
    exit 1
}
Write-Host "✅ Todas las variables están configuradas" -ForegroundColor Green

# 3. Instalar dependencias
Write-Host ""
Write-Host "3️⃣ Instalando dependencias..." -ForegroundColor Yellow
npm install --legacy-peer-deps
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error instalando dependencias" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencias instaladas" -ForegroundColor Green

# 4. Generar Prisma Client
Write-Host ""
Write-Host "4️⃣ Generando Prisma Client..." -ForegroundColor Yellow
npm run postinstall
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error generando Prisma Client" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma Client generado" -ForegroundColor Green

# 5. Aplicar migraciones de base de datos
Write-Host ""
Write-Host "5️⃣ Aplicando migraciones de base de datos..." -ForegroundColor Yellow
npm run db:push
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error aplicando migraciones" -ForegroundColor Red
    Write-Host "⚠️  Verifica que DATABASE_URL sea correcta" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Base de datos actualizada" -ForegroundColor Green

# 6. Build de producción
Write-Host ""
Write-Host "6️⃣ Compilando aplicación para producción..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en build" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build completado" -ForegroundColor Green

# 7. Checklist final
Write-Host ""
Write-Host "✅ DEPLOY LISTO PARA PRODUCCIÓN" -ForegroundColor Green
Write-Host ""
Write-Host "📋 CHECKLIST FINAL:" -ForegroundColor Cyan
Write-Host "   [ ] Variables de entorno configuradas en Vercel/hosting"
Write-Host "   [ ] Webhook de Mercado Pago configurado: https://tu-dominio.com/api/mercadopago/webhook"
Write-Host "   [ ] Base de datos Postgres configurada (no SQLite)"
Write-Host "   [ ] Dominio apuntando correctamente"
Write-Host "   [ ] Prueba de pago realizada"
Write-Host ""
Write-Host "🚀 Para deployar en Vercel:" -ForegroundColor Yellow
Write-Host "   1. Conecta tu repo a Vercel"
Write-Host "   2. Configura las variables de entorno"
Write-Host "   3. Deploy automático"
Write-Host ""
Write-Host "💰 Para generar ingresos:" -ForegroundColor Yellow
Write-Host "   1. Comparte: https://tu-dominio.com/pricing"
Write-Host "   2. Comparte: https://tu-dominio.com/calculator"
Write-Host "   3. Monitorea: https://tu-dominio.com/dashboard/payments"
Write-Host ""






