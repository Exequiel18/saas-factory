/**
 * 🔧 SOLUCIONAR TODO AUTOMÁTICAMENTE
 * 
 * Este script usa el agente de deployment para detectar y solucionar problemas
 */

require('dotenv').config({ path: '.env.local' })

async function main() {
  console.log('\n🔧 SOLUCIONANDO PROBLEMAS AUTOMÁTICAMENTE\n')
  console.log('='.repeat(60))

  try {
    // Verificar estado
    console.log('\n1️⃣ Verificando estado de deployment...\n')
    const checkResponse = await fetch('http://localhost:3000/api/deployment-monitor/check')
    
    if (!checkResponse.ok) {
      console.log('⚠️  No se pudo conectar al API. Verificando localmente...\n')
      
      // Verificación local básica
      const fs = require('fs')
      const path = require('path')
      
      const criticalFiles = [
        'app/page.tsx',
        'app/chequeo-real/page.tsx',
        'app/configurar-webhook/page.tsx'
      ]
      
      let allExist = true
      criticalFiles.forEach(file => {
        const exists = fs.existsSync(path.join(process.cwd(), file))
        console.log(`${exists ? '✅' : '❌'} ${file}`)
        if (!exists) allExist = false
      })
      
      if (!allExist) {
        console.log('\n❌ Faltan archivos críticos. No se puede continuar.\n')
        process.exit(1)
      }
      
      console.log('\n✅ Archivos críticos verificados')
      console.log('💡 Para verificar deployment, iniciá el servidor con: npm run dev\n')
      return
    }

    const checkData = await checkResponse.json()
    console.log('📊 Estado:', JSON.stringify(checkData.status, null, 2))
    console.log('\n📋 Problemas encontrados:', checkData.issues.length)
    
    if (checkData.issues.length > 0) {
      checkData.issues.forEach((issue, index) => {
        console.log(`\n${index + 1}. [${issue.severity.toUpperCase()}] ${issue.type}`)
        console.log(`   ${issue.message}`)
        console.log(`   Solución: ${issue.solution}`)
        console.log(`   Auto-fixable: ${issue.autoFixable ? '✅' : '❌'}`)
      })

      // Intentar solucionar
      const fixableIssues = checkData.issues.filter(i => i.autoFixable)
      if (fixableIssues.length > 0) {
        console.log(`\n2️⃣ Solucionando ${fixableIssues.length} problema(s) automáticamente...\n`)
        
        const fixResponse = await fetch('http://localhost:3000/api/deployment-monitor/fix', {
          method: 'POST'
        })
        
        if (fixResponse.ok) {
          const fixData = await fixResponse.json()
          console.log(`✅ Solucionados: ${fixData.fixed}`)
          console.log(`❌ Fallidos: ${fixData.failed}\n`)
        } else {
          console.log('⚠️  No se pudo ejecutar auto-fix\n')
        }
      }
    } else {
      console.log('\n✅ No se encontraron problemas. Todo está funcionando correctamente.\n')
    }

    console.log('='.repeat(60))
    console.log('\n💡 El monitor está activo y verificará automáticamente cada 2 minutos')
    console.log('💡 Para ver el estado completo, visitá: http://localhost:3000/dashboard/command-center\n')

  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('\n💡 Asegurate de que el servidor esté corriendo: npm run dev\n')
  }
}

main().catch(console.error)

