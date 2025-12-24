/**
 * 🧠 INICIAR COMMAND CENTER
 * 
 * Este script inicia el monitoreo continuo del Command Center
 * Se puede correr como servicio o con PM2
 * 
 * Uso:
 * node scripts/start-command-center.js
 * 
 * O con PM2:
 * pm2 start scripts/start-command-center.js --name command-center
 */

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'

console.log('🧠 Command Center - Iniciando monitoreo continuo...\n')

// Función para registrar evento de heartbeat
async function sendHeartbeat() {
  try {
    await fetch(`${BASE_URL}/api/central-command/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system: 'central',
        type: 'info',
        message: 'Command Center monitoreando...',
        data: { timestamp: new Date().toISOString() }
      })
    })
  } catch (error) {
    console.error('Error enviando heartbeat:', error.message)
  }
}

// Función para verificar estado de sistemas
async function checkSystemStatus() {
  try {
    const response = await fetch(`${BASE_URL}/api/central-command/status`)
    const data = await response.json()
    
    const runningSystems = data.systems.filter(s => s.status === 'running').length
    const totalSystems = data.systems.length
    
    console.log(`✅ Sistemas activos: ${runningSystems}/${totalSystems}`)
    console.log(`📊 Acciones hoy: ${data.stats.actionsToday}`)
    console.log(`💰 Tasa de éxito: ${data.stats.avgSuccessRate}%`)
    console.log(`📡 Eventos recientes: ${data.events.length}\n`)
    
  } catch (error) {
    console.error('❌ Error verificando estado:', error.message)
  }
}

// Heartbeat cada minuto
setInterval(() => {
  sendHeartbeat()
}, 60000)

// Verificación de estado cada 5 minutos
setInterval(() => {
  checkSystemStatus()
}, 5 * 60000)

// Verificación inicial
checkSystemStatus()

console.log('✅ Command Center iniciado')
console.log('📡 Monitoreo continuo activo')
console.log('🔄 Heartbeat cada 1 minuto')
console.log('📊 Verificación de estado cada 5 minutos\n')
console.log('Presiona Ctrl+C para detener\n')

// Mantener el proceso vivo
process.on('SIGINT', () => {
  console.log('\n🛑 Deteniendo Command Center...')
  process.exit(0)
})

