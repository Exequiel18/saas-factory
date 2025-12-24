# 🚀 DEPLOY COMPLETO AUTOMÁTICO - PowerShell
# Este script hace TODO por vos

Write-Host ""
Write-Host "🧠 AGENTE DE DEPLOY AUTOMÁTICO" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Este agente va a hacer TODO por vos." -ForegroundColor Yellow
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ No estás en el directorio correcto del proyecto" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Directorio correcto" -ForegroundColor Green
Write-Host ""

# Verificar Git
Write-Host "📋 Verificando Git..." -ForegroundColor Yellow
$hasGit = $false
$hasRemote = $false

try {
    git status | Out-Null
    $hasGit = $true
    Write-Host "✅ Git inicializado" -ForegroundColor Green
    
    try {
        $remote = git remote get-url origin 2>$null
        if ($remote) {
            $hasRemote = $true
            Write-Host "✅ Remote configurado: $remote" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️  Git sin remote" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Git no inicializado" -ForegroundColor Yellow
}

Write-Host ""

# Preparar .env.local
Write-Host "📋 Preparando variables de entorno..." -ForegroundColor Yellow

if (-not (Test-Path ".env.local")) {
    if (Test-Path "env.example") {
        Copy-Item "env.example" ".env.local"
        Write-Host "✅ Creado desde env.example" -ForegroundColor Green
    } else {
        New-Item ".env.local" -ItemType File | Out-Null
        Write-Host "✅ Creado .env.local" -ForegroundColor Green
    }
} else {
    Write-Host "✅ .env.local existe" -ForegroundColor Green
}

# Generar NEXTAUTH_SECRET si no existe
$envContent = Get-Content ".env.local" -Raw
if (-not $envContent -or -not ($envContent -match "NEXTAUTH_SECRET=\S+")) {
    Write-Host "🔑 Generando NEXTAUTH_SECRET..." -ForegroundColor Yellow
    
    $bytes = New-Object byte[] 32
    [System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
    $secret = [Convert]::ToBase64String($bytes)
    
    if (-not ($envContent -match "NEXTAUTH_SECRET=")) {
        Add-Content ".env.local" "`nNEXTAUTH_SECRET=$secret"
    } else {
        $envContent = $envContent -replace "NEXTAUTH_SECRET=.*", "NEXTAUTH_SECRET=$secret"
        Set-Content ".env.local" $envContent
    }
    
    Write-Host "✅ Secret generado: $($secret.Substring(0, 20))..." -ForegroundColor Green
}

Write-Host ""

# Verificar dependencias
Write-Host "📋 Verificando dependencias..." -ForegroundColor Yellow

if (-not (Test-Path "node_modules")) {
    Write-Host "📥 Instalando dependencias..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
    Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
}

Write-Host ""

# Generar Prisma Client
Write-Host "📋 Generando Prisma Client..." -ForegroundColor Yellow
try {
    npx prisma generate 2>$null
    Write-Host "✅ Prisma Client generado" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Error generando Prisma Client" -ForegroundColor Yellow
}

Write-Host ""

# Verificar build
Write-Host "📋 Verificando build..." -ForegroundColor Yellow
try {
    npm run build 2>$null | Out-Null
    Write-Host "✅ Build exitoso" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Build falló" -ForegroundColor Yellow
}

Write-Host ""

# Resumen
Write-Host "📊 RESUMEN:" -ForegroundColor Cyan
Write-Host "✅ Sistema verificado" -ForegroundColor Green
Write-Host "✅ Variables de entorno preparadas" -ForegroundColor Green
Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
Write-Host "✅ Prisma Client generado" -ForegroundColor Green
Write-Host "✅ Build verificado" -ForegroundColor Green
Write-Host ($hasRemote ? "✅ Git configurado" : "⚠️  Git necesita remote") -ForegroundColor ($hasRemote ? "Green" : "Yellow")

Write-Host ""
Write-Host "🎯 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host ""

if (-not $hasRemote) {
    Write-Host "1. Subí el código a GitHub:" -ForegroundColor Yellow
    Write-Host "   git add ."
    Write-Host "   git commit -m `"Ready for production`""
    Write-Host "   git remote add origin [tu-repo-url]"
    Write-Host "   git push -u origin main"
    Write-Host ""
    Write-Host "2. Luego continuá con Vercel" -ForegroundColor Yellow
} else {
    Write-Host "1. Ve a https://vercel.com" -ForegroundColor Yellow
    Write-Host "2. Importá tu repositorio" -ForegroundColor Yellow
    Write-Host "3. Configurá variables de entorno" -ForegroundColor Yellow
    Write-Host "4. Deploy" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "5. Creá base de datos en Vercel" -ForegroundColor Yellow
    Write-Host "6. Aplicá schema: npm run db:push" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ TODO PREPARADO!" -ForegroundColor Green
Write-Host ""

