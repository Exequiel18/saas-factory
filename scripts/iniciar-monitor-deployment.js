/**
 * 🤖 INICIAR MONITOR DE DEPLOYMENT
 * 
 * Este script inicia el monitor que detecta y soluciona problemas automáticamente
 */

const { DeploymentMonitorAgent } = require('../lib/deployment-monitor-agent')

async function main() {
  console.log('\n🤖 INICIANDO MONITOR DE DEPLOYMENT\n')
  console.log('='.repeat(60))
  console.log('Este agente:')
  console.log('  ✅ Detecta problemas de deployment automáticamente')
  console.log('  ✅ Verifica estado de Vercel cada 2 minutos')
  console.log('  ✅ Soluciona problemas automáticamente cuando es posible')
  console.log('  ✅ Reporta problemas que requieren acción manual')
  console.log('='.repeat(60))
  console.log('\n🚀 Iniciando monitoreo continuo...\n')

  const monitor = new DeploymentMonitorAgent()
  
  // Primera verificación inmediata
  console.log('🔍 Verificando estado inicial...\n')
  const issues = await monitor.checkDeploymentStatus()
  
  if (issues.length > 0) {
    console.log(`⚠️  Se encontraron ${issues.length} problema(s):\n`)
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. [${issue.severity.toUpperCase()}] ${issue.type}`)
      console.log(`   Mensaje: ${issue.message}`)
      console.log(`   Solución: ${issue.solution}`)
      console.log(`   Auto-fixable: ${issue.autoFixable ? '✅ Sí' : '❌ No'}\n`)
    })

    // Intentar solucionar automáticamente
    const fixableIssues = issues.filter(i => i.autoFixable)
    if (fixableIssues.length > 0) {
      console.log(`🔧 Intentando solucionar ${fixableIssues.length} problema(s) automáticamente...\n`)
      const result = await monitor.autoFix()
      console.log(`✅ Solucionados: ${result.fixed}`)
      console.log(`❌ Fallidos: ${result.failed}\n`)
    }
  } else {
    console.log('✅ No se encontraron problemas. Todo está funcionando correctamente.\n')
  }

  // Iniciar monitoreo continuo
  monitor.startMonitoring()
  
  console.log('✅ Monitor iniciado. Verificando cada 2 minutos...\n')
  console.log('💡 El monitor detectará y solucionará problemas automáticamente')
  console.log('💡 Presioná Ctrl+C para detener\n')
  console.log('='.repeat(60))
}

main().catch(error => {
  console.error('❌ Error:', error)
  process.exit(1)
})

