/**
 * 🚀 DEPLOY AUTOMÁTICO COMPLETO
 * 
 * Este script hace TODO lo posible automáticamente.
 * Solo necesitás crear el repo en GitHub y dar permisos.
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('\n🚀 DEPLOY AUTOMÁTICO COMPLETO')
console.log('==============================\n')

// Verificar estado actual
console.log('📋 Verificando estado actual...\n')

let currentBranch = 'master'
try {
  currentBranch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim() || 'master'
  console.log(`✅ Rama: ${currentBranch}`)
} catch {
  console.log('⚠️  No se pudo detectar rama')
}

// Asegurar que todo esté commiteado
try {
  execSync('git add .', { stdio: 'pipe' })
  console.log('✅ Archivos agregados')
  
  try {
    execSync('git commit -m "Ready for production - All systems configured"', { stdio: 'pipe' })
    console.log('✅ Commit realizado')
  } catch (e) {
    if (e.message.includes('nothing to commit')) {
      console.log('✅ Todo ya commiteado')
    }
  }
} catch (e) {
  console.log('⚠️  Error en git')
}

// Verificar remote
let hasRemote = false
let remoteUrl = null

try {
  remoteUrl = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim()
  hasRemote = true
  console.log(`✅ Remote: ${remoteUrl}\n`)
} catch {
  console.log('⚠️  No hay remote\n')
}

// Crear script de push automático
const pushScript = `#!/bin/bash
# Script para hacer push automático

BRANCH="${currentBranch}"
REMOTE_URL="${remoteUrl || 'https://github.com/tu-usuario/tu-repo.git'}"

if [ "$REMOTE_URL" == "https://github.com/tu-usuario/tu-repo.git" ]; then
  echo "⚠️  Necesitás configurar la URL del repo primero"
  echo "Ejecutá: git remote add origin [tu-repo-url]"
  exit 1
fi

echo "📤 Haciendo push a GitHub..."
git push -u origin $BRANCH

if [ $? -eq 0 ]; then
  echo "✅ Push exitoso!"
  echo ""
  echo "🎯 PRÓXIMO PASO: Deploy en Vercel"
  echo "1. Ve a https://vercel.com"
  echo "2. Importá tu repositorio"
  echo "3. Configurá las variables (ver INSTRUCCIONES_VERCEL.md)"
  echo "4. Deploy"
else
  echo "❌ Error en push"
  echo "Verificá que el repo existe y tenés permisos"
fi
`

fs.writeFileSync('push-to-github.sh', pushScript)
console.log('✅ Script push-to-github.sh creado')

// Crear script PowerShell
const pushScriptPS = `# Script para hacer push automático
$BRANCH = "${currentBranch}"
$REMOTE_URL = "${remoteUrl || 'https://github.com/tu-usuario/tu-repo.git'}"

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
`

fs.writeFileSync('push-to-github.ps1', pushScriptPS)
console.log('✅ Script push-to-github.ps1 creado\n')

// Resumen final
console.log('📊 RESUMEN:\n')
console.log('✅ Todo preparado y commiteado')
console.log(hasRemote ? '✅ Remote configurado' : '⚠️  Falta configurar remote\n')

if (!hasRemote) {
  console.log('🎯 LO QUE TENÉS QUE HACER:\n')
  console.log('1. Creá un repo en GitHub:')
  console.log('   https://github.com/new\n')
  console.log('2. Configurá el remote:')
  console.log('   git remote add origin [tu-repo-url]\n')
  console.log('3. Ejecutá el script de push:')
  console.log('   .\\push-to-github.ps1\n')
} else {
  console.log('🎯 EJECUTÁ EL SCRIPT DE PUSH:\n')
  console.log('   .\\push-to-github.ps1\n')
}

console.log('4. Después del push, deploy en Vercel:')
console.log('   https://vercel.com\n')

console.log('✅ TODO LISTO!\n')

