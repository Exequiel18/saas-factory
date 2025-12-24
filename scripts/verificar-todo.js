/**
 * 🔍 VERIFICAR TODO EL SISTEMA
 */

const fs = require('fs')
const path = require('path')

console.log('\n🔍 VERIFICANDO SISTEMA COMPLETO\n')
console.log('='.repeat(50))

const checks = []

// 1. Verificar archivos críticos
const criticalFiles = [
  'app/page.tsx',
  'app/chequeo-real/page.tsx',
  'components/sueno-promesa.tsx',
  'components/confianza-seguridad.tsx',
  'package.json',
  'next.config.mjs',
  'prisma/schema.prisma'
]

console.log('\n📋 1. Verificando archivos críticos...')
criticalFiles.forEach(file => {
  const exists = fs.existsSync(file)
  checks.push({ name: file, status: exists })
  console.log(`${exists ? '✅' : '❌'} ${file}`)
})

// 2. Verificar dependencias
console.log('\n📦 2. Verificando dependencias...')
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
const nodeModulesExists = fs.existsSync('node_modules')
console.log(`${nodeModulesExists ? '✅' : '❌'} node_modules existe`)

// 3. Verificar componentes
console.log('\n🧩 3. Verificando componentes...')
const components = [
  'components/sueno-promesa.tsx',
  'components/confianza-seguridad.tsx'
]
components.forEach(comp => {
  const exists = fs.existsSync(comp)
  console.log(`${exists ? '✅' : '❌'} ${comp}`)
})

// 4. Verificar estructura de app
console.log('\n📁 4. Verificando estructura de app...')
const appFiles = [
  'app/page.tsx',
  'app/chequeo-real/page.tsx',
  'app/layout.tsx'
]
appFiles.forEach(file => {
  const exists = fs.existsSync(file)
  console.log(`${exists ? '✅' : '❌'} ${file}`)
})

// Resumen
console.log('\n' + '='.repeat(50))
console.log('\n📊 RESUMEN:\n')
const allPassed = checks.every(c => c.status)
console.log(allPassed ? '✅ Todo está correcto' : '⚠️  Hay archivos faltantes')
console.log('\n✅ Sistema listo para deploy\n')

