/**
 * 📋 OBTENER LOGS DEL DEPLOYMENT FALLIDO
 */

const https = require('https')

const VERCEL_TOKEN = '9DcHcwyLkRUzRg5RCVTlWpHc'
const DEPLOYMENT_ID = 'dpl_5q6JPcZapNLQaxY2RU8hzHMyZWv8'

function makeRequest(hostname, path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      path,
      method,
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          resolve({ status: res.statusCode, data: json })
        } catch {
          resolve({ status: res.statusCode, data: data })
        }
      })
    })

    req.on('error', reject)
    req.end()
  })
}

async function main() {
  console.log('\n📋 OBTENIENDO INFORMACIÓN DEL DEPLOYMENT FALLIDO\n')
  console.log('='.repeat(60))
  
  try {
    const response = await makeRequest(
      'api.vercel.com',
      `/v13/deployments/${DEPLOYMENT_ID}/events`
    )

    if (response.status === 200) {
      const events = response.data.events || []
      
      console.log(`Eventos encontrados: ${events.length}\n`)
      
      if (events.length > 0) {
        console.log('Últimos eventos:\n')
        events.slice(-10).forEach((event, i) => {
          console.log(`${i + 1}. [${event.type}] ${event.payload?.text || event.payload?.message || 'Sin mensaje'}`)
        })
      }
    }

    // Obtener información del deployment
    const deployInfo = await makeRequest(
      'api.vercel.com',
      `/v13/deployments/${DEPLOYMENT_ID}`
    )

    if (deployInfo.status === 200) {
      const deploy = deployInfo.data
      console.log('\n' + '='.repeat(60))
      console.log('\n📊 INFORMACIÓN DEL DEPLOYMENT:\n')
      console.log(`Estado: ${deploy.readyState || deploy.state}`)
      console.log(`Branch: ${deploy.gitSource?.ref || 'N/A'}`)
      console.log(`URL: ${deploy.url || 'N/A'}\n`)
      
      if (deploy.readyState === 'ERROR') {
        console.log('❌ El deployment falló')
        console.log('💡 Revisá los logs en: https://vercel.com/dashboard\n')
      }
    }

  } catch (error) {
    console.error('Error:', error.message)
  }
}

main().catch(console.error)

