/**
 * 🔧 SOLUCIONAR TODO - Script para aplicar schema y verificar sistema
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('\n🔧 SOLUCIONANDO TODO LO QUE FALTA\n')

// 1. Verificar que existe DATABASE_URL
const envPath = path.join(process.cwd(), '.env.local')
let hasDatabaseUrl = false

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  hasDatabaseUrl = envContent.includes('DATABASE_URL=')
  
  if (hasDatabaseUrl) {
    console.log('✅ DATABASE_URL encontrado en .env.local\n')
  } else {
    console.log('⚠️  DATABASE_URL no encontrado en .env.local\n')
    console.log('💡 Agregá DATABASE_URL a .env.local con tu conexión de Supabase\n')
  }
} else {
  console.log('⚠️  .env.local no existe\n')
  console.log('💡 Creá .env.local con DATABASE_URL\n')
}

// 2. Intentar aplicar schema
if (hasDatabaseUrl) {
  console.log('🔄 Intentando aplicar schema de base de datos...\n')
  
  try {
    const nodePath = path.join(process.cwd(), 'bin', 'node-v20.10.0-win-x64', 'node.exe')
    const prismaPath = path.join(process.cwd(), 'node_modules', '.bin', 'prisma.cmd')
    
    if (fs.existsSync(prismaPath)) {
      execSync(`"${prismaPath}" db push`, {
        stdio: 'inherit',
        env: {
          ...process.env,
          PATH: `${path.join(process.cwd(), 'bin', 'node-v20.10.0-win-x64')};${process.env.PATH}`
        }
      })
      console.log('\n✅ Schema aplicado exitosamente!\n')
    } else {
      console.log('⚠️  Prisma no encontrado. Ejecutá manualmente:\n')
      console.log('   npm run db:push\n')
    }
  } catch (error) {
    console.log('\n⚠️  Error aplicando schema\n')
    console.log('💡 Ejecutá manualmente en PowerShell:\n')
    console.log('   cd "C:\\Users\\Exequiel rogers\\Desktop\\SAAS-FACTORY"')
    console.log('   npm run db:push\n')
  }
} else {
  console.log('⏭️  Saltando aplicación de schema (falta DATABASE_URL)\n')
}

// 3. Verificar variables de Mercado Pago
console.log('📋 VERIFICACIÓN DE VARIABLES:\n')

const requiredVars = [
  'MERCADOPAGO_ACCESS_TOKEN',
  'NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY',
  'MERCADOPAGO_ALIAS',
  'MERCADO_PAGO_WEBHOOK_SECRET'
]

let missingVars = []

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  
  requiredVars.forEach(varName => {
    if (envContent.includes(`${varName}=`)) {
      console.log(`✅ ${varName}`)
    } else {
      console.log(`❌ ${varName} - FALTA`)
      missingVars.push(varName)
    }
  })
} else {
  requiredVars.forEach(varName => {
    console.log(`❌ ${varName} - FALTA`)
    missingVars.push(varName)
  })
}

if (missingVars.length > 0) {
  console.log('\n⚠️  FALTAN VARIABLES DE MERCADO PAGO\n')
  console.log('💡 Para obtenerlas:')
  console.log('   1. Ve a: https://www.mercadopago.com.ar/developers/panel')
  console.log('   2. Crea una aplicación')
  console.log('   3. Copiá las credenciales')
  console.log('   4. Agregalas a .env.local y a Vercel\n')
} else {
  console.log('\n✅ Todas las variables de Mercado Pago están configuradas\n')
}

// 4. Resumen
console.log('\n📊 RESUMEN:\n')

if (hasDatabaseUrl) {
  console.log('✅ DATABASE_URL configurado')
} else {
  console.log('❌ DATABASE_URL falta')
}

if (missingVars.length === 0) {
  console.log('✅ Variables de Mercado Pago configuradas')
} else {
  console.log(`❌ Faltan ${missingVars.length} variables de Mercado Pago`)
}

console.log('\n🎯 PRÓXIMOS PASOS:\n')

if (!hasDatabaseUrl) {
  console.log('1. Agregá DATABASE_URL a .env.local')
}

if (missingVars.length > 0) {
  console.log('2. Configurá Mercado Pago (ver arriba)')
  console.log('3. Agregá las variables a Vercel Dashboard')
}

console.log('4. Configurá el webhook de Mercado Pago:')
console.log('   URL: https://saas-factory-antigravity.vercel.app/api/mercadopago/webhook')
console.log('   Eventos: payment.created, payment.updated\n')

console.log('✅ Script completado\n')

