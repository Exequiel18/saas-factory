/**
 * 🚀 REDEPLOY EN VERCEL
 * 
 * Hace redeploy del último deployment en Vercel
 */

const https = require('https')

const VERCEL_TOKEN = process.env.VERCEL_TOKEN || ''
const PROJECT_NAME = 'saas-factory-antigravity'

if (!VERCEL_TOKEN) {
  console.log('\n❌ Necesitás VERCEL_TOKEN en variables de entorno\n')
  console.log('Obtén tu token en: https://vercel.com/account/tokens\n')
  process.exit(1)
}

function makeRequest(hostname, path, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      path,
      method,
      headers: {
        'User-Agent': 'Node.js',
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        ...headers
      }
    }

    if (body) {
      options.headers['Content-Type'] = 'application/json'
      body = JSON.stringify(body)
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          resolve({ status: res.statusCode, data: json, text: data })
        } catch {
          resolve({ status: res.statusCode, data: null, text: data })
        }
      })
    })

    req.on('error', reject)
    if (body) req.write(body)
    req.end()
  })
}

async function main() {
  console.log('\n🚀 REDEPLOY EN VERCEL\n')
  console.log('='.repeat(50))

  // Obtener deployments
  console.log('\n📋 Obteniendo deployments...\n')
  const deployments = await makeRequest(
    'api.vercel.com',
    `/v6/deployments?projectId=${PROJECT_NAME}&limit=1`,
    'GET'
  )

  if (deployments.status !== 200) {
    console.log('❌ Error obteniendo deployments\n')
    console.log('💡 Hacé redeploy manualmente en Vercel Dashboard\n')
    process.exit(1)
  }

  const latestDeployment = deployments.data.deployments?.[0]
  
  if (!latestDeployment) {
    console.log('❌ No se encontraron deployments\n')
    process.exit(1)
  }

  console.log(`✅ Deployment encontrado: ${latestDeployment.uid}`)
  console.log(`✅ URL: ${latestDeployment.url}\n`)

  // Hacer redeploy
  console.log('🚀 Iniciando redeploy...\n')
  const redeploy = await makeRequest(
    'api.vercel.com',
    `/v13/deployments`,
    'POST',
    {
      name: PROJECT_NAME,
      project: PROJECT_NAME,
      gitSource: {
        type: 'github',
        repo: 'Exequiel18/saas-factory',
        ref: 'master'
      }
    }
  )

  if (redeploy.status === 200 || redeploy.status === 201) {
    console.log('✅ Redeploy iniciado!\n')
    console.log('📊 RESUMEN:\n')
    console.log('✅ Nuevo deploy iniciado en Vercel')
    console.log('⏳ Esperá 2-3 minutos para que termine\n')
    console.log(`✅ Tu SaaS: https://${PROJECT_NAME}.vercel.app\n`)
  } else {
    console.log(`⚠️  Error: ${redeploy.text}\n`)
    console.log('💡 Hacé redeploy manualmente:\n')
    console.log('1. Ve a https://vercel.com/dashboard')
    console.log(`2. Click en: ${PROJECT_NAME}`)
    console.log('3. Deployments → Redeploy\n')
  }
}

main().catch(console.error)

