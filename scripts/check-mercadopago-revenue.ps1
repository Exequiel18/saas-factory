# 💰 VERIFICAR INGRESOS DE MERCADO PAGO
# Ejecuta: .\scripts\check-mercadopago-revenue.ps1

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     VERIFICACIÓN DE INGRESOS - MERCADO PAGO              ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar variables de entorno
Write-Host "1️⃣ Verificando configuración de Mercado Pago..." -ForegroundColor Yellow

$hasAccessToken = [System.Environment]::GetEnvironmentVariable("MERCADOPAGO_ACCESS_TOKEN", "Process")
$hasPublicKey = [System.Environment]::GetEnvironmentVariable("NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY", "Process")

if (-not $hasAccessToken -or -not $hasPublicKey) {
    Write-Host "❌ Mercado Pago NO está configurado" -ForegroundColor Red
    Write-Host ""
    Write-Host "📝 Configura estas variables en .env.local:" -ForegroundColor Yellow
    Write-Host "   MERCADOPAGO_ACCESS_TOKEN=APP_USR-..."
    Write-Host "   NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-..."
    Write-Host "   MERCADOPAGO_ALIAS=tu_alias.mp"
    Write-Host ""
    Write-Host "🔗 Obtén tus credenciales en:" -ForegroundColor Cyan
    Write-Host "   https://www.mercadopago.com.ar/developers/panel"
    Write-Host ""
    exit 1
}

Write-Host "✅ Mercado Pago configurado" -ForegroundColor Green

# Verificar que el servidor esté corriendo
Write-Host ""
Write-Host "2️⃣ Verificando servidor..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/mercadopago/status" -Method GET -UseBasicParsing -ErrorAction Stop
    $status = $response.Content | ConvertFrom-Json
    
    if ($status.configured) {
        Write-Host "✅ Servidor funcionando" -ForegroundColor Green
        Write-Host "   Total de pagos aprobados: $($status.stats.totalPayments)" -ForegroundColor Cyan
        Write-Host "   Ingresos totales: ARS $($status.stats.totalRevenue)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Servidor funcionando pero Mercado Pago no configurado" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Servidor no está corriendo en localhost:3000" -ForegroundColor Yellow
    Write-Host "   Ejecuta: npm run dev" -ForegroundColor Cyan
}

# Mostrar páginas de monetización
Write-Host ""
Write-Host "3️⃣ Páginas de Monetización Disponibles:" -ForegroundColor Yellow
Write-Host ""
Write-Host "💰 Pago Único ($3.000 ARS):" -ForegroundColor Green
Write-Host "   http://localhost:3000/calculator" -ForegroundColor Cyan
Write-Host ""
Write-Host "💳 Suscripciones Mensuales:" -ForegroundColor Green
Write-Host "   http://localhost:3000/pricing" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Dashboard de Ingresos:" -ForegroundColor Green
Write-Host "   http://localhost:3000/dashboard/payments" -ForegroundColor Cyan
Write-Host "   http://localhost:3000/dashboard/analytics" -ForegroundColor Cyan
Write-Host ""

# Checklist de monetización
Write-Host "4️⃣ Checklist de Monetización:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   [ ] Variables de entorno configuradas"
Write-Host "   [ ] Servidor corriendo (npm run dev)"
Write-Host "   [ ] Webhook configurado en Mercado Pago"
Write-Host "   [ ] Prueba de pago realizada"
Write-Host "   [ ] Pago aparece en /dashboard/payments"
Write-Host ""

Write-Host "🚀 Para generar ingresos:" -ForegroundColor Green
Write-Host "   1. Comparte: http://localhost:3000/calculator" -ForegroundColor Cyan
Write-Host "   2. Comparte: http://localhost:3000/pricing" -ForegroundColor Cyan
Write-Host "   3. Monitorea: http://localhost:3000/dashboard/payments" -ForegroundColor Cyan
Write-Host ""





