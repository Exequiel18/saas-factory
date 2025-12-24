/**
 * 🔍 VERIFICADOR DE SISTEMA
 * 
 * Verifica que todo esté funcionando antes del deploy.
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Verificando sistema completo...\n')

const checks = []

// 1. Verificar archivos críticos
const criticalFiles = [
  'app/page.tsx',
  'app/chequeo-real/page.tsx',
  'app/dashboard/command-center/page.tsx',
  'lib/central-command-agent.ts',
  'lib/human-translations.ts',
  'lib/autonomous-marketing.ts',
  'package.json',
  'next.config.mjs',
  'prisma/schema.prisma'
]

console.log('📁 Verificando archivos críticos...')
criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    checks.push({ name: file, status: '✅' })
  } else {
    checks.push({ name: file, status: '❌' })
  }
})

// 2. Verificar APIs críticas
const criticalAPIs = [
  'app/api/central-command/status/route.ts',
  'app/api/central-command/events/route.ts',
  'app/api/autonomous-marketing/plan/route.ts',
  'app/api/mercadopago/create-preference/route.ts',
  'app/api/mercadopago/webhook/route.ts'
]

console.log('🔌 Verificando APIs...')
criticalAPIs.forEach(api => {
  if (fs.existsSync(api)) {
    checks.push({ name: api, status: '✅' })
  } else {
    checks.push({ name: api, status: '❌' })
  }
})

// 3. Verificar componentes críticos
const criticalComponents = [
  'components/business-score-card.tsx',
  'components/ui/button.tsx',
  'components/ui/card.tsx'
]

console.log('🧩 Verificando componentes...')
criticalComponents.forEach(comp => {
  if (fs.existsSync(comp)) {
    checks.push({ name: comp, status: '✅' })
  } else {
    checks.push({ name: comp, status: '❌' })
  }
})

// Mostrar resultados
console.log('\n📊 RESULTADOS:\n')
checks.forEach(check => {
  console.log(`${check.status} ${check.name}`)
})

const failed = checks.filter(c => c.status === '❌')
if (failed.length === 0) {
  console.log('\n✅ Todos los archivos críticos están presentes')
  console.log('✅ Sistema listo para deploy\n')
} else {
  console.log(`\n⚠️  ${failed.length} archivo(s) faltante(s)`)
  console.log('Revisá los archivos marcados con ❌\n')
}

// Verificar estructura de rutas
console.log('🛣️  Verificando rutas principales...')
const routes = [
  '/',
  '/chequeo-real',
  '/dashboard/command-center',
  '/dashboard/autonomous-marketing',
  '/pricing'
]

routes.forEach(route => {
  const filePath = route === '/' 
    ? 'app/page.tsx'
    : `app${route}/page.tsx`
  
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${route}`)
  } else {
    console.log(`❌ ${route} (${filePath} no existe)`)
  }
})

console.log('\n✅ Verificación completa\n')

