/**
 * 🔍 VERIFICAR ESTADO DEL DEPLOYMENT EN VERCEL
 */

const https = require('https')

const VERCEL_TOKEN = '9DcHcwyLkRUzRg5RCVTlWpHc'
const PROJECT_NAME = 'saas-factory-antigravity'
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

async function checkDeployment() {
  try {
    const response = await makeRequest(
      'api.vercel.com',
      `/v13/deployments/${DEPLOYMENT_ID}`
    )

    if (response.status === 200) {
      const deployment = response.data
      const state = deployment.readyState || deployment.state
      const url = deployment.url || `https://${PROJECT_NAME}.vercel.app`

      return {
        state,
        url,
        ready: state === 'READY',
        building: state === 'BUILDING' || state === 'QUEUED',
        error: state === 'ERROR' || state === 'CANCELED'
      }
    }

    return null
  } catch (error) {
    return null
  }
}

async function main() {
  console.log('\n🔍 VERIFICANDO ESTADO DEL DEPLOYMENT\n')
  console.log('='.repeat(60))
  console.log(`Deployment ID: ${DEPLOYMENT_ID}`)
  console.log('='.repeat(60))
  console.log('\n')

  let attempts = 0
  const maxAttempts = 20 // 5 minutos máximo

  while (attempts < maxAttempts) {
    const status = await checkDeployment()

    if (!status) {
      console.log('⚠️  No se pudo verificar el estado\n')
      break
    }

    console.log(`Estado: ${status.state}`)
    console.log(`URL: ${status.url}\n`)

    if (status.ready) {
      console.log('='.repeat(60))
      console.log('\n✅ DEPLOYMENT COMPLETADO!\n')
      console.log('🌐 Tu web está lista en:')
      console.log(`   ${status.url}\n`)
      console.log('🎉 El nuevo diseño ya está online!\n')
      console.log('='.repeat(60))
      break
    }

    if (status.error) {
      console.log('='.repeat(60))
      console.log('\n❌ DEPLOYMENT FALLÓ\n')
      console.log('💡 Revisá los logs en Vercel Dashboard\n')
      console.log('='.repeat(60))
      break
    }

    if (status.building) {
      console.log('⏳ Todavía construyendo...\n')
      console.log('💡 Esperá 30 segundos más...\n')
      await new Promise(resolve => setTimeout(resolve, 30000))
      attempts++
    }
  }

  if (attempts >= maxAttempts) {
    console.log('⏳ El deployment está tardando más de lo esperado')
    console.log('💡 Verificá manualmente en: https://vercel.com/dashboard\n')
  }
}

main().catch(console.error)

