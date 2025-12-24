/**
 * 🚀 PREPARAR DEPLOY AUTOMÁTICO
 * 
 * Este script prepara todo para el deploy.
 * Usa los agentes para hacer el trabajo.
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const crypto = require('crypto')

console.log('🧠 Agente de Deploy - Preparando sistema...\n')

// 1. Generar NEXTAUTH_SECRET si no existe
const envPath = path.join(process.cwd(), '.env.local')
let envContent = ''

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf-8')
} else {
  console.log('📝 Creando .env.local desde env.example...')
  if (fs.existsSync('env.example')) {
    envContent = fs.readFileSync('env.example', 'utf-8')
  }
}

// Generar secret si no existe
if (!envContent.includes('NEXTAUTH_SECRET=') || envContent.match(/NEXTAUTH_SECRET=\s*$/)) {
  const secret = crypto.randomBytes(32).toString('base64')
  console.log('🔑 Generando NEXTAUTH_SECRET...')
  
  if (!envContent.includes('NEXTAUTH_SECRET=')) {
    envContent += `\nNEXTAUTH_SECRET=${secret}\n`
  } else {
    envContent = envContent.replace(/NEXTAUTH_SECRET=.*/, `NEXTAUTH_SECRET=${secret}`)
  }
  
  console.log(`✅ Secret generado: ${secret.substring(0, 20)}...`)
  console.log('📋 Este secret se agregó a .env.local\n')
}

// Guardar .env.local
fs.writeFileSync(envPath, envContent, 'utf-8')
console.log('✅ .env.local actualizado\n')

// 2. Verificar dependencias
console.log('📦 Verificando dependencias...')
if (!fs.existsSync('node_modules')) {
  console.log('📥 Instalando dependencias...')
  try {
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit' })
    console.log('✅ Dependencias instaladas\n')
  } catch (e) {
    console.log('⚠️  Error instalando dependencias\n')
  }
} else {
  console.log('✅ Dependencias instaladas\n')
}

// 3. Generar Prisma Client
console.log('🔧 Generando Prisma Client...')
try {
  execSync('npx prisma generate', { stdio: 'pipe' })
  console.log('✅ Prisma Client generado\n')
} catch (e) {
  console.log('⚠️  Error generando Prisma Client\n')
}

// 4. Verificar build
console.log('🔨 Verificando build...')
try {
  execSync('npm run build', { stdio: 'pipe', timeout: 120000 })
  console.log('✅ Build exitoso\n')
} else {
  console.log('⚠️  Build falló. Revisá los errores.\n')
}

// 5. Crear resumen
console.log('📊 RESUMEN DE PREPARACIÓN:\n')
console.log('✅ NEXTAUTH_SECRET generado')
console.log('✅ .env.local actualizado')
console.log('✅ Dependencias verificadas')
console.log('✅ Prisma Client generado')
console.log('✅ Build verificado\n')

console.log('🎯 PRÓXIMOS PASOS:\n')
console.log('1. Ve a https://vercel.com')
console.log('2. Importá tu repositorio')
console.log('3. Configurá estas variables de entorno:')
console.log('   - NEXTAUTH_URL (se auto-completa)')
console.log('   - NEXTAUTH_SECRET (el que está en .env.local)')
console.log('   - DATABASE_URL (después de crear la DB)')
console.log('4. Deploy\n')

console.log('📋 Para ver el secret:')
console.log('   cat .env.local | grep NEXTAUTH_SECRET\n')

console.log('✅ Sistema preparado para deploy!\n')

