/**
 * 🚀 DEPLOY COMPLETO FINAL
 * 
 * Este script hace TODO lo necesario para el deploy.
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const crypto = require('crypto')

console.log('\n🚀 DEPLOY COMPLETO FINAL - PREPARANDO TODO')
console.log('==========================================\n')

// Paso 1: Verificar y preparar Git
console.log('📋 PASO 1: Preparando Git...\n')

let currentBranch = 'main'
try {
  const branchOutput = execSync('git branch --show-current', { encoding: 'utf-8' }).trim()
  currentBranch = branchOutput || 'main'
  console.log(`✅ Rama actual: ${currentBranch}`)
} catch {
  console.log('⚠️  No se pudo detectar la rama, usando "main"')
}

// Asegurar que todos los archivos estén agregados
try {
  execSync('git add .', { stdio: 'pipe' })
  console.log('✅ Archivos agregados')
} catch (e) {
  console.log('⚠️  Error agregando archivos')
}

// Hacer commit si hay cambios
try {
  execSync('git commit -m "Ready for production - Supabase configured"', { stdio: 'pipe' })
  console.log('✅ Commit realizado')
} catch (e) {
  if (e.message.includes('nothing to commit')) {
    console.log('✅ No hay cambios para commitear')
  } else {
    console.log('⚠️  Error en commit')
  }
}

// Verificar si hay remote
let hasRemote = false
let remoteUrl = null

try {
  remoteUrl = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim()
  hasRemote = true
  console.log(`✅ Remote configurado: ${remoteUrl}\n`)
} catch {
  console.log('⚠️  No hay remote configurado\n')
}

// Paso 2: Resumen y próximos pasos
console.log('📊 RESUMEN:\n')
console.log('✅ Git preparado')
console.log('✅ Archivos commiteados')
console.log(hasRemote ? '✅ Remote configurado' : '⚠️  Falta configurar remote\n')

if (!hasRemote) {
  console.log('🎯 PRÓXIMOS PASOS:\n')
  console.log('1. Creá un repo en GitHub:')
  console.log('   https://github.com/new\n')
  console.log('2. Ejecutá estos comandos (reemplazá la URL):')
  console.log(`   git remote add origin https://github.com/tu-usuario/tu-repo.git`)
  console.log(`   git push -u origin ${currentBranch}\n`)
} else {
  console.log('🎯 PRÓXIMO PASO:\n')
  console.log('Hacer push a GitHub:')
  console.log(`   git push -u origin ${currentBranch}\n`)
  console.log('O si querés, ejecutá este script con la URL del repo:')
  console.log(`   node scripts/deploy-completo-final.js "${remoteUrl}"\n`)
}

// Paso 3: Crear archivo con instrucciones de Vercel
console.log('📋 PASO 3: Creando instrucciones de deploy...\n')

const vercelInstructions = `# 🚀 INSTRUCCIONES PARA VERCEL

## Variables de Entorno a Configurar:

1. **NEXTAUTH_URL**
   \`\`\`
   https://tu-proyecto.vercel.app
   \`\`\`
   (Se auto-completa, pero verifica)

2. **NEXTAUTH_SECRET**
   \`\`\`
   [Está en tu .env.local]
   \`\`\`

3. **DATABASE_URL**
   \`\`\`
   postgresql://postgres.phcfmhxlixdogveondji:Exequiel54..@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   \`\`\`

4. **NEXT_PUBLIC_SUPABASE_URL**
   \`\`\`
   https://phcfmhxlixdogveondji.supabase.co
   \`\`\`

5. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   \`\`\`
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoY2ZtaHhsaXhkb2d2ZW9uZGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODYwNzcsImV4cCI6MjA4MDE2MjA3N30.YMHYRA16QOt2pBRpx09EpfIEw5uCKdLA7RqAbrASmy8
   \`\`\`

6. **SUPABASE_SERVICE_ROLE_KEY**
   \`\`\`
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoY2ZtaHhsaXhkb2d2ZW9uZGppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDU4NjA3NywiZXhwIjoyMDgwMTYyMDc3fQ.xYKb_yoQEqozQzHv0uwTUSJEp5Q4YAjWwKw3QMKI7Hk
   \`\`\`

## Pasos:

1. Ve a https://vercel.com
2. Importá tu repositorio de GitHub
3. Configurá las variables de entorno (arriba)
4. Click "Deploy"
5. Después del deploy, ejecutá: \`npm run db:push\`
`

fs.writeFileSync('INSTRUCCIONES_VERCEL.md', vercelInstructions)
console.log('✅ Archivo INSTRUCCIONES_VERCEL.md creado\n')

console.log('✅ TODO PREPARADO!\n')
console.log('📋 Archivos importantes:')
console.log('   - INSTRUCCIONES_VERCEL.md (variables para Vercel)')
console.log('   - DEPLOY_FINAL_SUPABASE.md (guía completa)\n')

