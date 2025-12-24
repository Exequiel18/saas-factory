/**
 * 🔧 CONFIGURAR SUPABASE AUTOMÁTICO
 * 
 * Este script busca credenciales de Supabase y configura todo.
 */

const fs = require('fs')
const path = require('path')

console.log('\n🔍 Buscando credenciales de Supabase...\n')

// Buscar en archivos comunes
const possibleFiles = [
  '.env.local',
  '.env',
  'supabase.txt',
  'supabase-credentials.txt',
  'database.txt',
  'credentials.txt',
  'config.txt',
  'supabase.env',
  'db.txt'
]

let foundCredentials = null

for (const file of possibleFiles) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf-8')
    
    // Buscar DATABASE_URL de Supabase
    const dbUrlMatch = content.match(/DATABASE_URL\s*[=:]\s*(postgresql:\/\/[^\s\n]+)/i)
    const supabaseUrlMatch = content.match(/SUPABASE_URL\s*[=:]\s*([^\s\n]+)/i)
    const supabaseKeyMatch = content.match(/SUPABASE_KEY\s*[=:]\s*([^\s\n]+)/i)
    
    if (dbUrlMatch || supabaseUrlMatch) {
      console.log(`✅ Encontrado en: ${file}\n`)
      foundCredentials = {
        file,
        databaseUrl: dbUrlMatch ? dbUrlMatch[1] : null,
        supabaseUrl: supabaseUrlMatch ? supabaseUrlMatch[1] : null,
        supabaseKey: supabaseKeyMatch ? supabaseKeyMatch[1] : null
      }
      break
    }
  }
}

// Si no se encontró, buscar en todos los archivos .txt
if (!foundCredentials) {
  console.log('Buscando en archivos .txt...\n')
  const txtFiles = fs.readdirSync('.').filter(f => f.endsWith('.txt'))
  
  for (const file of txtFiles) {
    try {
      const content = fs.readFileSync(file, 'utf-8')
      const dbUrlMatch = content.match(/postgresql:\/\/[^\s\n]+/i)
      
      if (dbUrlMatch) {
        console.log(`✅ Encontrado en: ${file}\n`)
        foundCredentials = {
          file,
          databaseUrl: dbUrlMatch[0]
        }
        break
      }
    } catch (e) {
      // Ignorar errores
    }
  }
}

if (!foundCredentials) {
  console.log('⚠️  No se encontraron credenciales automáticamente.\n')
  console.log('Por favor, creá un archivo con tu DATABASE_URL de Supabase.')
  console.log('O ejecutá este script con la URL como argumento:\n')
  console.log('  node scripts/configurar-supabase.js "postgresql://..."\n')
  
  // Intentar leer desde argumentos
  if (process.argv[2] && process.argv[2].includes('postgresql://')) {
    foundCredentials = {
      databaseUrl: process.argv[2]
    }
    console.log('✅ Usando URL proporcionada\n')
  } else {
    console.log('❌ No se pudo configurar Supabase automáticamente')
    console.log('Por favor, agregá DATABASE_URL manualmente a .env.local\n')
    process.exit(1)
  }
}

// Actualizar .env.local
console.log('📝 Configurando .env.local...\n')

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
if (foundCredentials.databaseUrl) {
  if (envContent.includes('DATABASE_URL=')) {
    envContent = envContent.replace(/DATABASE_URL\s*=\s*[^\n]+/, `DATABASE_URL=${foundCredentials.databaseUrl}`)
  } else {
    envContent += `\nDATABASE_URL=${foundCredentials.databaseUrl}\n`
  }
  console.log('✅ DATABASE_URL configurado')
  console.log(`   ${foundCredentials.databaseUrl.substring(0, 50)}...\n`)
}

// Asegurar NEXTAUTH_SECRET
if (!envContent.includes('NEXTAUTH_SECRET=') || envContent.match(/NEXTAUTH_SECRET=\s*$/)) {
  const crypto = require('crypto')
  const secret = crypto.randomBytes(32).toString('base64')
  
  if (!envContent.includes('NEXTAUTH_SECRET=')) {
    envContent += `\nNEXTAUTH_SECRET=${secret}\n`
  } else {
    envContent = envContent.replace(/NEXTAUTH_SECRET=.*/, `NEXTAUTH_SECRET=${secret}`)
  }
  console.log('✅ NEXTAUTH_SECRET configurado\n')
}

// Guardar
fs.writeFileSync(envPath, envContent, 'utf-8')
console.log('✅ .env.local actualizado\n')

console.log('📊 RESUMEN:\n')
console.log('✅ Credenciales de Supabase configuradas')
console.log('✅ .env.local actualizado')
console.log('✅ DATABASE_URL:', foundCredentials.databaseUrl ? 'Configurado' : 'No encontrado')
console.log('\n🎯 PRÓXIMOS PASOS:\n')
console.log('1. Aplicar schema: npm run db:push')
console.log('2. Deploy en Vercel')
console.log('3. Configurar DATABASE_URL en Vercel (mismo valor)\n')
console.log('✅ TODO LISTO PARA DEPLOY!\n')
