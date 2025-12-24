/**
 * 🔄 CAMBIAR BRANCH EN VERCEL
 */

const https = require('https')

const VERCEL_TOKEN = '9DcHcwyLkRUzRg5RCVTlWpHc'
const PROJECT_NAME = 'saas-factory-antigravity'

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
  console.log('\n🔄 CAMBIANDO BRANCH EN VERCEL\n')
  
  // Obtener proyecto
  const project = await makeRequest(
    'api.vercel.com',
    `/v9/projects/${PROJECT_NAME}`,
    'GET'
  )

  if (project.status !== 200) {
    console.log('❌ Error obteniendo proyecto\n')
    process.exit(1)
  }

  console.log('✅ Proyecto encontrado\n')

  // Hacer nuevo deployment desde el branch nuevo
  console.log('🚀 Creando nuevo deployment desde branch nuevo-diseno...\n')
  
  const deploy = await makeRequest(
    'api.vercel.com',
    '/v13/deployments',
    'POST',
    {
      name: PROJECT_NAME,
      project: PROJECT_NAME,
      gitSource: {
        type: 'github',
        repo: 'Exequiel18/saas-factory',
        ref: 'nuevo-diseno',
        sha: 'nuevo-diseno'
      }
    }
  )

  if (deploy.status === 200 || deploy.status === 201) {
    console.log('✅ Nuevo deployment iniciado!\n')
    console.log('📊 RESUMEN:\n')
    console.log('✅ Branch nuevo-diseno conectado')
    console.log('✅ Nuevo deployment iniciado')
    console.log('⏳ Esperá 2-3 minutos para que termine\n')
    console.log(`✅ Tu SaaS: https://${PROJECT_NAME}.vercel.app\n`)
  } else {
    console.log(`⚠️  Error: ${deploy.text}\n`)
    console.log('💡 SOLUCIÓN MANUAL:\n')
    console.log('1. Ve a https://vercel.com/dashboard')
    console.log(`2. Click en: ${PROJECT_NAME}`)
    console.log('3. Settings → Git → Change Branch → nuevo-diseno')
    console.log('4. Save\n')
  }
}

main().catch(console.error)

