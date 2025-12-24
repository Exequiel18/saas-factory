/**
 * 🚀 DEPLOY COMPLETO CON SUPABASE
 * 
 * Este script hace TODO: configura Supabase y prepara para deploy.
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const crypto = require('crypto')

console.log('\n🚀 DEPLOY COMPLETO CON SUPABASE')
console.log('================================\n')

// Paso 1: Buscar credenciales de Supabase
console.log('📋 PASO 1: Buscando credenciales de Supabase...\n')

let databaseUrl = null

// Buscar en archivos
const searchFiles = [
  '.env.local',
  '.env',
  'supabase.txt',
  'database.txt',
  'credentials.txt',
  'config.txt'
]

for (const file of searchFiles) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf-8')
    const match = content.match(/postgresql:\/\/[^\s\n]+/i)
    if (match) {
      databaseUrl = match[0]
      console.log(`✅ Encontrado en: ${file}`)
      console.log(`   ${databaseUrl.substring(0, 50)}...\n`)
      break
    }
  }
}

// Si no se encontró, pedir al usuario
if (!databaseUrl) {
  console.log('⚠️  No se encontraron credenciales automáticamente.\n')
  console.log('Por favor, proporcioná tu DATABASE_URL de Supabase:')
  console.log('Formato: postgresql://usuario:password@host:puerto/database\n')
  
  // Intentar leer desde argumentos
  if (process.argv[2] && process.argv[2].includes('postgresql://')) {
    databaseUrl = process.argv[2]
    console.log('✅ Usando URL proporcionada\n')
  } else {
    console.log('💡 TIP: Podés ejecutar este script con la URL como argumento:')
    console.log('   node scripts/deploy-completo-supabase.js "postgresql://..."\n')
    console.log('O creá un archivo "supabase.txt" con tu DATABASE_URL\n')
    process.exit(1)
  }
}

// Paso 2: Configurar .env.local
console.log('📋 PASO 2: Configurando .env.local...\n')

const envPath = path.join(process.cwd(), '.env.local')
let envContent = ''

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf-8')
} else {
  if (fs.existsSync('env.example')) {
    envContent = fs.readFileSync('env.example', 'utf-8')
  }
}

// Actualizar DATABASE_URL
if (envContent.includes('DATABASE_URL=')) {
  envContent = envContent.replace(/DATABASE_URL\s*=\s*[^\n]+/, `DATABASE_URL=${databaseUrl}`)
} else {
  envContent += `\nDATABASE_URL=${databaseUrl}\n`
}
console.log('✅ DATABASE_URL configurado')

// Generar NEXTAUTH_SECRET si no existe
if (!envContent.includes('NEXTAUTH_SECRET=') || envContent.match(/NEXTAUTH_SECRET=\s*$/)) {
  const secret = crypto.randomBytes(32).toString('base64')
  
  if (!envContent.includes('NEXTAUTH_SECRET=')) {
    envContent += `\nNEXTAUTH_SECRET=${secret}\n`
  } else {
    envContent = envContent.replace(/NEXTAUTH_SECRET=.*/, `NEXTAUTH_SECRET=${secret}`)
  }
  console.log('✅ NEXTAUTH_SECRET generado')
}

// Guardar
fs.writeFileSync(envPath, envContent, 'utf-8')
console.log('✅ .env.local actualizado\n')

// Paso 3: Verificar Git
console.log('📋 PASO 3: Verificando Git...\n')

let hasGit = false
let hasRemote = false
let remoteUrl = null

try {
  execSync('git status', { stdio: 'ignore' })
  hasGit = true
  console.log('✅ Git inicializado')
  
  try {
    remoteUrl = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim()
    hasRemote = true
    console.log(`✅ Remote configurado: ${remoteUrl}\n`)
  } catch {
    console.log('⚠️  Git sin remote\n')
  }
} catch {
  console.log('⚠️  Git no inicializado\n')
}

// Paso 4: Preparar para commit
if (hasGit) {
  console.log('📋 PASO 4: Preparando commit...\n')
  
  try {
    execSync('git add .', { stdio: 'pipe' })
    console.log('✅ Archivos agregados')
    
    try {
      execSync('git commit -m "Ready for production with Supabase"', { stdio: 'pipe' })
      console.log('✅ Commit realizado\n')
    } catch {
      console.log('⚠️  No hay cambios para commitear\n')
    }
  } catch (e) {
    console.log('⚠️  Error en git add\n')
  }
}

// Paso 5: Resumen
console.log('📊 RESUMEN:\n')
console.log('✅ Supabase configurado')
console.log('✅ .env.local actualizado')
console.log('✅ NEXTAUTH_SECRET generado')
console.log(hasGit ? '✅ Git configurado' : '⚠️  Git no inicializado')
console.log(hasRemote ? '✅ Remote configurado' : '⚠️  Git sin remote\n')

console.log('🎯 PRÓXIMOS PASOS:\n')

if (!hasRemote) {
  console.log('1. Subí el código a GitHub:')
  console.log('   git remote add origin [tu-repo-url]')
  console.log('   git push -u origin main\n')
}

console.log('2. Deploy en Vercel:')
console.log('   - Ve a https://vercel.com')
console.log('   - Importá tu repositorio')
console.log('   - Configurá estas variables:')
console.log('     * NEXTAUTH_URL (se auto-completa)')
console.log('     * NEXTAUTH_SECRET (está en .env.local)')
console.log('     * DATABASE_URL (tu URL de Supabase)\n')

console.log('3. Aplicar schema:')
console.log('   npm run db:push\n')

console.log('✅ TODO LISTO PARA DEPLOY!\n')

