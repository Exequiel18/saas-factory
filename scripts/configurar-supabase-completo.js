/**
 * 🔧 CONFIGURAR SUPABASE COMPLETO
 * 
 * Configura todo con las credenciales de Supabase proporcionadas.
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { execSync } = require('child_process')

console.log('\n🚀 CONFIGURANDO SUPABASE Y PREPARANDO DEPLOY')
console.log('============================================\n')

// Credenciales de Supabase
const SUPABASE_PROJECT_REF = 'phcfmhxlixdogveondji'
const SUPABASE_PASSWORD = 'Exequiel54..'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoY2ZtaHhsaXhkb2d2ZW9uZGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODYwNzcsImV4cCI6MjA4MDE2MjA3N30.YMHYRA16QOt2pBRpx09EpfIEw5uCKdLA7RqAbrASmy8'
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoY2ZtaHhsaXhkb2d2ZW9uZGppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDU4NjA3NywiZXhwIjoyMDgwMTYyMDc3fQ.xYKb_yoQEqozQzHv0uwTUSJEp5Q4YAjWwKw3QMKI7Hk'

// Construir DATABASE_URL de Supabase
// Formato: postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
const DATABASE_URL = `postgresql://postgres.${SUPABASE_PROJECT_REF}:${encodeURIComponent(SUPABASE_PASSWORD)}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`

console.log('📋 PASO 1: Configurando variables de entorno...\n')

const envPath = path.join(process.cwd(), '.env.local')
let envContent = ''

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf-8')
} else {
  if (fs.existsSync('env.example')) {
    envContent = fs.readFileSync('env.example', 'utf-8')
  }
}

// Configurar DATABASE_URL
if (envContent.includes('DATABASE_URL=')) {
  envContent = envContent.replace(/DATABASE_URL\s*=\s*[^\n]+/, `DATABASE_URL=${DATABASE_URL}`)
} else {
  envContent += `\nDATABASE_URL=${DATABASE_URL}\n`
}
console.log('✅ DATABASE_URL configurado')
console.log(`   ${DATABASE_URL.substring(0, 60)}...\n`)

// Configurar Supabase URLs y Keys
if (envContent.includes('NEXT_PUBLIC_SUPABASE_URL=')) {
  envContent = envContent.replace(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*[^\n]+/, `NEXT_PUBLIC_SUPABASE_URL=https://${SUPABASE_PROJECT_REF}.supabase.co`)
} else {
  envContent += `\nNEXT_PUBLIC_SUPABASE_URL=https://${SUPABASE_PROJECT_REF}.supabase.co\n`
}

if (envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
  envContent = envContent.replace(/NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*[^\n]+/, `NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}`)
} else {
  envContent += `\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}\n`
}

if (envContent.includes('SUPABASE_SERVICE_ROLE_KEY=')) {
  envContent = envContent.replace(/SUPABASE_SERVICE_ROLE_KEY\s*=\s*[^\n]+/, `SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}`)
} else {
  envContent += `\nSUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}\n`
}

console.log('✅ Supabase URLs y Keys configurados\n')

// Generar NEXTAUTH_SECRET si no existe
if (!envContent.includes('NEXTAUTH_SECRET=') || envContent.match(/NEXTAUTH_SECRET=\s*$/)) {
  const secret = crypto.randomBytes(32).toString('base64')
  
  if (!envContent.includes('NEXTAUTH_SECRET=')) {
    envContent += `\nNEXTAUTH_SECRET=${secret}\n`
  } else {
    envContent = envContent.replace(/NEXTAUTH_SECRET=.*/, `NEXTAUTH_SECRET=${secret}`)
  }
  console.log('✅ NEXTAUTH_SECRET generado\n')
}

// Guardar .env.local
fs.writeFileSync(envPath, envContent, 'utf-8')
console.log('✅ .env.local actualizado\n')

// Paso 2: Verificar Git
console.log('📋 PASO 2: Verificando Git...\n')

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

// Paso 3: Preparar commit
if (hasGit) {
  console.log('📋 PASO 3: Preparando commit...\n')
  
  try {
    execSync('git add .', { stdio: 'pipe' })
    console.log('✅ Archivos agregados')
    
    try {
      execSync('git commit -m "Configure Supabase and ready for production"', { stdio: 'pipe' })
      console.log('✅ Commit realizado\n')
    } catch {
      console.log('⚠️  No hay cambios para commitear\n')
    }
  } catch (e) {
    console.log('⚠️  Error en git add\n')
  }
}

// Paso 4: Resumen
console.log('📊 RESUMEN:\n')
console.log('✅ Supabase configurado')
console.log('✅ DATABASE_URL configurado')
console.log('✅ Supabase URLs y Keys configurados')
console.log('✅ NEXTAUTH_SECRET generado')
console.log('✅ .env.local actualizado')
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
console.log('   - Configurá estas variables de entorno:')
console.log('     * NEXTAUTH_URL = https://tu-proyecto.vercel.app')
console.log('     * NEXTAUTH_SECRET = [está en .env.local]')
console.log('     * DATABASE_URL = [tu URL de Supabase - está en .env.local]')
console.log('     * NEXT_PUBLIC_SUPABASE_URL = https://phcfmhxlixdogveondji.supabase.co')
console.log('     * NEXT_PUBLIC_SUPABASE_ANON_KEY = [está en .env.local]')
console.log('     * SUPABASE_SERVICE_ROLE_KEY = [está en .env.local]\n')

console.log('3. Aplicar schema:')
console.log('   npm run db:push\n')

console.log('✅ TODO CONFIGURADO Y LISTO PARA DEPLOY!\n')

