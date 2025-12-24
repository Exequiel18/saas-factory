/**
 * 📊 APLICAR SCHEMA DE BASE DE DATOS
 */

const { execSync } = require('child_process')
const path = require('path')

const NODE_PATH = path.join(__dirname, '..', 'bin', 'node-v20.10.0-win-x64', 'node.exe')
const PRISMA_PATH = path.join(__dirname, '..', 'node_modules', '.bin', 'prisma.cmd')

console.log('\n📊 APLICANDO SCHEMA DE BASE DE DATOS\n')

try {
  // Verificar que existe DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.log('⚠️  DATABASE_URL no encontrado en .env.local\n')
    console.log('💡 Asegurate de tener .env.local con DATABASE_URL configurado\n')
    process.exit(1)
  }

  console.log('✅ DATABASE_URL encontrado\n')
  console.log('🔄 Aplicando schema...\n')

  // Ejecutar prisma db push
  execSync(`"${PRISMA_PATH}" db push`, {
    stdio: 'inherit',
    env: {
      ...process.env,
      PATH: `${path.join(__dirname, '..', 'bin', 'node-v20.10.0-win-x64')};${process.env.PATH}`
    }
  })

  console.log('\n✅ Schema aplicado exitosamente!\n')
  console.log('📊 Tu base de datos está lista\n')
  console.log('🎯 Próximo paso: Configurar Mercado Pago\n')

} catch (error) {
  console.log('\n❌ Error aplicando schema\n')
  console.log('💡 SOLUCIÓN MANUAL:\n')
  console.log('1. Abrí PowerShell')
  console.log('2. cd "C:\\Users\\Exequiel rogers\\Desktop\\SAAS-FACTORY"')
  console.log('3. npm run db:push\n')
  process.exit(1)
}

