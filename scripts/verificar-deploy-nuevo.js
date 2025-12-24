/**
 * 🔍 VERIFICAR NUEVO DEPLOYMENT
 */

const https = require('https')

const VERCEL_TOKEN = '9DcHcwyLkRUzRg5RCVTlWpHc'
const DEPLOYMENT_ID = 'dpl_BzmHmCTbehenvS11XSVdfei2rqyJ'

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
  console.log('\n🔍 VERIFICANDO NUEVO DEPLOYMENT\n')
  console.log('='.repeat(60))
  console.log(`Deployment ID: ${DEPLOYMENT_ID}`)
  console.log('='.repeat(60))
  console.log('\n')

  const status = await checkDeployment()

  if (!status) {
    console.log('⚠️  No se pudo verificar el estado\n')
    return
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
  } else if (status.error) {
    console.log('='.repeat(60))
    console.log('\n❌ DEPLOYMENT FALLÓ\n')
    console.log('💡 Revisá los logs en Vercel Dashboard\n')
    console.log('='.repeat(60))
  } else if (status.building) {
    console.log('⏳ Todavía construyendo...\n')
    console.log('💡 Esperá 2-3 minutos más\n')
  }
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
      const url = deployment.url || `https://saas-factory-antigravity.vercel.app`

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

main().catch(console.error)

