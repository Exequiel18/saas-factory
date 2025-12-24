/**
 * 🔍 VERIFICAR ESTADO REAL DEL SISTEMA
 */

const fs = require('fs')
const path = require('path')

console.log('\n🔍 VERIFICANDO ESTADO REAL DEL SISTEMA\n')
console.log('='.repeat(60))

// 1. Verificar archivos críticos
console.log('\n📁 VERIFICANDO ARCHIVOS CRÍTICOS...\n')

const criticalFiles = [
  'app/page.tsx',
  'app/chequeo-real/page.tsx',
  'app/configurar-webhook/page.tsx',
  'app/dashboard/deploy/page.tsx',
  'package.json',
  'next.config.mjs',
  'prisma/schema.prisma'
]

criticalFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file))
  console.log(`${exists ? '✅' : '❌'} ${file}`)
})

// 2. Verificar estructura de configurar-webhook
console.log('\n📁 VERIFICANDO ESTRUCTURA DE CONFIGURAR-WEBHOOK...\n')

const webhookDir = path.join(process.cwd(), 'app', 'configurar-webhook')
if (fs.existsSync(webhookDir)) {
  const files = fs.readdirSync(webhookDir)
  console.log('✅ Directorio existe')
  files.forEach(file => {
    console.log(`   - ${file}`)
  })
} else {
  console.log('❌ Directorio NO existe')
}

// 3. Verificar contenido de page.tsx
console.log('\n📄 VERIFICANDO CONTENIDO DE PAGE.TSX...\n')

const pagePath = path.join(webhookDir, 'page.tsx')
if (fs.existsSync(pagePath)) {
  const content = fs.readFileSync(pagePath, 'utf8')
  const hasExport = content.includes('export default')
  const hasClient = content.includes('"use client"')
  
  console.log(`✅ Archivo existe`)
  console.log(`   ${hasExport ? '✅' : '❌'} Tiene export default`)
  console.log(`   ${hasClient ? '✅' : '❌'} Es client component`)
  console.log(`   Tamaño: ${content.length} caracteres`)
} else {
  console.log('❌ Archivo NO existe')
}

// 4. Verificar que no haya route.ts
const routePath = path.join(webhookDir, 'route.ts')
if (fs.existsSync(routePath)) {
  console.log('\n⚠️  PROBLEMA: route.ts existe (debe eliminarse)\n')
} else {
  console.log('\n✅ No hay route.ts (correcto)\n')
}

// 5. Verificar build
console.log('🔨 VERIFICANDO BUILD...\n')

const nextDir = path.join(process.cwd(), '.next')
if (fs.existsSync(nextDir)) {
  console.log('✅ .next existe (build realizado)')
} else {
  console.log('⚠️  .next NO existe (necesita build)')
}

// 6. Resumen
console.log('\n' + '='.repeat(60))
console.log('📊 RESUMEN\n')

const allFilesExist = criticalFiles.every(file => fs.existsSync(path.join(process.cwd(), file)))
const pageExists = fs.existsSync(pagePath)
const noRoute = !fs.existsSync(routePath)

console.log(`Archivos críticos: ${allFilesExist ? '✅' : '❌'}`)
console.log(`Página webhook: ${pageExists ? '✅' : '❌'}`)
console.log(`Sin route.ts: ${noRoute ? '✅' : '❌'}`)

if (allFilesExist && pageExists && noRoute) {
  console.log('\n✅ ESTRUCTURA CORRECTA')
  console.log('💡 Si sigue dando 404, el problema es que Vercel no desplegó el nuevo código')
  console.log('💡 Solución: Hacé redeploy manual en Vercel Dashboard\n')
} else {
  console.log('\n❌ HAY PROBLEMAS EN LA ESTRUCTURA')
  console.log('💡 Necesito corregirlos\n')
}

console.log('='.repeat(60))

