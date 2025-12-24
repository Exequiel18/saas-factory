/**
 * 🔧 CONFIGURAR DATABASE_URL CORRECTO
 */

const fs = require('fs')
const path = require('path')

const PROJECT_REF = 'phcfmhxlixdogveondji'
const PASSWORD = 'Exequiel54..'

// Formato 1: Pooler (recomendado para producción)
const DATABASE_URL_POOLER = `postgresql://postgres.${PROJECT_REF}:${PASSWORD}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`

// Formato 2: Direct connection
const DATABASE_URL_DIRECT = `postgresql://postgres.${PROJECT_REF}:${PASSWORD}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`

// Formato 3: Alternativo
const DATABASE_URL_ALT = `postgresql://postgres:${PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres`

console.log('\n🔧 CONFIGURANDO DATABASE_URL\n')

const envPath = path.join(process.cwd(), '.env.local')
let envContent = ''

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8')
} else {
  console.log('⚠️  .env.local no existe, creándolo...\n')
}

// Reemplazar o agregar DATABASE_URL
if (envContent.includes('DATABASE_URL=')) {
  // Reemplazar línea existente
  envContent = envContent.replace(
    /DATABASE_URL=.*/g,
    `DATABASE_URL=${DATABASE_URL_POOLER}`
  )
  console.log('✅ DATABASE_URL actualizado\n')
} else {
  // Agregar al final
  envContent += `\nDATABASE_URL=${DATABASE_URL_POOLER}\n`
  console.log('✅ DATABASE_URL agregado\n')
}

// Guardar
fs.writeFileSync(envPath, envContent, 'utf8')

console.log('📊 DATABASE_URL configurado:')
console.log(`   ${DATABASE_URL_POOLER}\n`)

console.log('🔄 Intentando aplicar schema...\n')

// Intentar aplicar schema
const { execSync } = require('child_process')
const binPath = path.join(process.cwd(), 'bin', 'node-v20.10.0-win-x64')
const npxPath = path.join(binPath, 'npx.cmd')
const newPath = `${binPath};${process.env.PATH || ''}`

try {
  execSync(`"${npxPath}" prisma db push`, {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: DATABASE_URL_POOLER,
      PATH: newPath
    },
    cwd: process.cwd(),
    shell: true
  })
  
  console.log('\n✅ Schema aplicado exitosamente!\n')
} catch (error) {
  console.log('\n⚠️  Error aplicando schema con pooler, intentando formato alternativo...\n')
  
  // Intentar con formato alternativo
  try {
    envContent = envContent.replace(
      /DATABASE_URL=.*/g,
      `DATABASE_URL=${DATABASE_URL_ALT}`
    )
    fs.writeFileSync(envPath, envContent, 'utf8')
    
    execSync(`"${npxPath}" prisma db push`, {
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: DATABASE_URL_ALT,
        PATH: newPath
      },
      cwd: process.cwd(),
      shell: true
    })
    
    console.log('\n✅ Schema aplicado exitosamente con formato alternativo!\n')
  } catch (error2) {
    console.log('\n❌ Error aplicando schema\n')
    console.log('💡 Verificá las credenciales en Supabase Dashboard\n')
    console.log('💡 O ejecutá manualmente:')
    console.log('   .\\bin\\node-v20.10.0-win-x64\\npx.cmd prisma db push\n')
  }
}

