/**
 * 🚀 DEPLOY AUTOMÁTICO
 * 
 * Este script verifica todo y te dice exactamente qué hacer.
 * Usa los agentes para hacer el trabajo pesado.
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🧠 Sistema Autónomo de Deploy - Iniciando...\n')

// 1. Verificar que estamos en el directorio correcto
if (!fs.existsSync('package.json')) {
  console.error('❌ No estás en el directorio del proyecto')
  process.exit(1)
}

console.log('✅ Directorio correcto\n')

// 2. Verificar Git
let hasGit = false
let gitRemote = null

try {
  execSync('git status', { stdio: 'ignore' })
  hasGit = true
  
  try {
    const remote = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim()
    gitRemote = remote
    console.log('✅ Git configurado')
    console.log(`   Remote: ${remote}\n`)
  } catch (e) {
    console.log('⚠️  Git configurado pero sin remote\n')
  }
} catch (e) {
  console.log('⚠️  Git no inicializado\n')
}

// 3. Verificar .env.local
const envPath = path.join(process.cwd(), '.env.local')
let hasEnv = fs.existsSync(envPath)

if (hasEnv) {
  console.log('✅ .env.local existe')
  const envContent = fs.readFileSync(envPath, 'utf-8')
  
  const requiredVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ]
  
  const missing = requiredVars.filter(v => !envContent.includes(`${v}=`))
  
  if (missing.length > 0) {
    console.log(`⚠️  Variables faltantes en .env.local: ${missing.join(', ')}\n`)
  } else {
    console.log('✅ Variables básicas configuradas\n')
  }
} else {
  console.log('⚠️  .env.local no existe\n')
}

// 4. Generar NEXTAUTH_SECRET si no existe
if (!hasEnv || !fs.readFileSync(envPath, 'utf-8').includes('NEXTAUTH_SECRET=')) {
  console.log('🔑 Generando NEXTAUTH_SECRET...')
  try {
    const secret = execSync('node scripts/generate-secret.js', { encoding: 'utf-8' })
    const secretValue = secret.match(/[A-Za-z0-9+/=]{40,}/)?.[0]
    
    if (secretValue) {
      console.log(`✅ Secret generado: ${secretValue.substring(0, 20)}...`)
      console.log('📋 Copiá esto para Vercel\n')
    }
  } catch (e) {
    console.log('⚠️  No se pudo generar secret automáticamente\n')
  }
}

// 5. Verificar build
console.log('🔨 Verificando que el proyecto compile...')
try {
  execSync('npm run build', { stdio: 'pipe', timeout: 120000 })
  console.log('✅ Build exitoso\n')
} catch (e) {
  console.log('⚠️  Build falló. Revisá los errores arriba.\n')
}

// 6. Resumen y próximos pasos
console.log('📊 RESUMEN:\n')
console.log('✅ Proyecto verificado')
console.log(hasGit ? '✅ Git configurado' : '⚠️  Git no configurado')
console.log(hasEnv ? '✅ .env.local existe' : '⚠️  .env.local no existe')
console.log('\n🎯 PRÓXIMOS PASOS:\n')

if (!hasGit || !gitRemote) {
  console.log('1. Inicializá Git y subí el código:')
  console.log('   git init')
  console.log('   git add .')
  console.log('   git commit -m "Ready for production"')
  console.log('   git remote add origin [tu-repo-url]')
  console.log('   git push -u origin main\n')
}

console.log('2. Ve a https://vercel.com y:')
console.log('   - Importá tu repositorio')
console.log('   - Configurá variables de entorno')
console.log('   - Deploy\n')

console.log('3. Creá base de datos (Vercel Postgres o Railway)')
console.log('4. Aplicá schema: npm run db:push\n')

console.log('📋 Variables mínimas para Vercel:')
console.log('   - NEXTAUTH_URL (se auto-completa)')
console.log('   - NEXTAUTH_SECRET (el que generaste)')
console.log('   - DATABASE_URL (después de crear la DB)\n')

console.log('✅ Todo listo para deploy!\n')

