/**
 * 🧠 EJECUTOR AUTÓNOMO DE MARKETING
 * 
 * Este script ejecuta el plan generado por el sistema.
 * Se puede correr manualmente o con un cron job.
 * 
 * Uso:
 * node scripts/autonomous-marketing-executor.js
 */

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'

async function executeMarketingPlan() {
  console.log('🧠 Sistema Autónomo de Marketing - Iniciando...\n')
  
  try {
    // 1. Obtener plan del sistema
    console.log('📋 Obteniendo plan semanal...')
    const planResponse = await fetch(`${BASE_URL}/api/autonomous-marketing/plan`)
    const { plan, recommendations, analysis } = await planResponse.json()
    
    console.log(`✅ Plan obtenido: ${plan.length} acciones programadas\n`)
    
    // 2. Mostrar recomendaciones
    if (recommendations.length > 0) {
      console.log('💡 Recomendaciones del Sistema:')
      recommendations.forEach((rec, i) => {
        console.log(`   ${i + 1}. ${rec}`)
      })
      console.log('')
    }
    
    // 3. Mostrar análisis
    if (analysis) {
      console.log('📊 Análisis de Performance:')
      console.log(`   Mejor plataforma: ${analysis.bestPlatform}`)
      console.log(`   Mejor tipo de contenido: ${analysis.bestContentType}`)
      console.log(`   Mejor horario: ${analysis.bestTime}`)
      console.log('')
    }
    
    // 4. Mostrar acciones programadas
    console.log('📅 Acciones Programadas:\n')
    plan.forEach((action, i) => {
      const date = new Date(action.scheduledFor)
      console.log(`${i + 1}. ${action.type.toUpperCase()} - ${action.platform}`)
      console.log(`   Fecha: ${date.toLocaleString('es-AR')}`)
      console.log(`   Prioridad: ${action.priority}`)
      console.log(`   Impacto esperado: ${action.expectedImpact}`)
      console.log(`   Razón: ${action.reason}`)
      console.log(`   Contenido:`)
      console.log(`   ${action.content.split('\n').map(l => `   ${l}`).join('\n')}`)
      console.log('')
    })
    
    // 5. Preguntar si ejecutar (en modo interactivo)
    if (process.stdin.isTTY) {
      console.log('⚠️  Modo interactivo: Las acciones NO se ejecutan automáticamente.')
      console.log('   Revisá el plan en /dashboard/autonomous-marketing')
      console.log('   y aprobá las acciones que quieras ejecutar.\n')
    }
    
    console.log('✅ Plan generado exitosamente')
    console.log('📱 Revisá el dashboard en /dashboard/autonomous-marketing para aprobar acciones\n')
    
  } catch (error) {
    console.error('❌ Error ejecutando plan:', error.message)
    process.exit(1)
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  executeMarketingPlan()
}

module.exports = { executeMarketingPlan }

