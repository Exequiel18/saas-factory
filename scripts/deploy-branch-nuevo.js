/**
 * 🚀 DEPLOY DESDE BRANCH NUEVO
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
  console.log('\n🚀 DEPLOY DESDE BRANCH NUEVO\n')
  
  // Obtener proyecto para obtener repoId
  const project = await makeRequest(
    'api.vercel.com',
    `/v9/projects/${PROJECT_NAME}`,
    'GET'
  )

  if (project.status !== 200) {
    console.log('❌ Error obteniendo proyecto\n')
    process.exit(1)
  }

  const link = project.data.link
  if (!link || !link.repoId) {
    console.log('⚠️  No hay repo conectado o falta repoId\n')
    console.log('💡 Conectá el repo manualmente en Vercel Dashboard\n')
    process.exit(1)
  }

  console.log(`✅ RepoId encontrado: ${link.repoId}\n`)
  console.log('🚀 Creando deployment desde branch nuevo-diseno...\n')

  // Crear deployment desde el branch nuevo
  const deploy = await makeRequest(
    'api.vercel.com',
    '/v13/deployments',
    'POST',
    {
      name: PROJECT_NAME,
      project: PROJECT_NAME,
      gitSource: {
        type: 'github',
        repoId: link.repoId,
        ref: 'nuevo-diseno'
      }
    }
  )

  if (deploy.status === 200 || deploy.status === 201) {
    const url = deploy.data.url || `https://${PROJECT_NAME}.vercel.app`
    console.log('✅ Deployment iniciado exitosamente!\n')
    console.log('📊 RESUMEN:\n')
    console.log('✅ Branch nuevo-diseno conectado')
    console.log('✅ Nuevo deployment iniciado')
    console.log('⏳ Esperá 2-3 minutos para que termine\n')
    console.log(`✅ Tu SaaS: ${url}\n`)
    console.log('🎯 Cuando termine, verás el nuevo diseño oscuro\n')
  } else {
    console.log(`⚠️  Error: ${deploy.text}\n`)
    console.log('💡 SOLUCIÓN MANUAL (1 minuto):\n')
    console.log('1. Ve a https://vercel.com/dashboard')
    console.log(`2. Click en: ${PROJECT_NAME}`)
    console.log('3. Settings → Git → Change Branch')
    console.log('4. Seleccioná: nuevo-diseno')
    console.log('5. Save\n')
    console.log('Vercel hará deploy automático\n')
  }
}

main().catch(console.error)

