/**
 * 📊 APLICAR SCHEMA COMPLETO - Con manejo de errores
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Cargar .env.local manualmente
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim()
      if (value && !value.startsWith('#')) {
        process.env[key.trim()] = value.replace(/^["']|["']$/g, '')
      }
    }
  })
}

console.log('\n📊 APLICANDO SCHEMA DE BASE DE DATOS\n')

// Verificar DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.log('❌ DATABASE_URL no encontrado\n')
  console.log('💡 Verificá que .env.local tenga DATABASE_URL configurado\n')
  process.exit(1)
}

console.log('✅ DATABASE_URL encontrado\n')
console.log('🔄 Aplicando schema a Supabase...\n')

try {
  const binPath = path.join(process.cwd(), 'bin', 'node-v20.10.0-win-x64')
  const npxPath = path.join(binPath, 'npx.cmd')
  const prismaPath = path.join(process.cwd(), 'node_modules', '.bin', 'prisma.cmd')

  // Configurar PATH para que Prisma encuentre Node
  const newPath = `${binPath};${process.env.PATH || ''}`

  // Intentar con npx primero
  if (fs.existsSync(npxPath)) {
    execSync(`"${npxPath}" prisma db push`, {
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
        PATH: newPath
      },
      cwd: process.cwd(),
      shell: true
    })
  } else if (fs.existsSync(prismaPath)) {
    execSync(`"${prismaPath}" db push`, {
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
        PATH: newPath
      },
      cwd: process.cwd(),
      shell: true
    })
  } else {
    throw new Error('Prisma no encontrado')
  }

  console.log('\n✅ Schema aplicado exitosamente!\n')
  console.log('📊 Tu base de datos está lista\n')
  console.log('🎯 Próximo paso: Configurar Mercado Pago\n')

} catch (error) {
  console.log('\n❌ Error aplicando schema\n')
  console.log('💡 SOLUCIÓN:\n')
  console.log('1. Verificá que DATABASE_URL esté correcto en .env.local')
  console.log('2. Verificá que la conexión a Supabase funcione')
  console.log('3. Ejecutá manualmente:')
  console.log('   .\\bin\\node-v20.10.0-win-x64\\npx.cmd prisma db push\n')
  process.exit(1)
}

