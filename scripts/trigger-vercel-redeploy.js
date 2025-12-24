/**
 * 🔄 TRIGGER REDEPLOY EN VERCEL
 */

const https = require('https')

const VERCEL_TOKEN = '9DcHcwyLkRUzRg5RCVTlWpHc'
const PROJECT_NAME = 'saas-factory-antigravity'

function makeRequest(hostname, path, method = 'GET', body = null) {
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
    if (body) req.write(JSON.stringify(body))
    req.end()
  })
}

async function main() {
  console.log('\n🔄 TRIGGERING REDEPLOY EN VERCEL\n')

  try {
    // Obtener proyecto
    const project = await makeRequest(
      'api.vercel.com',
      `/v9/projects/${PROJECT_NAME}`,
      'GET'
    )

    if (project.status !== 200) {
      console.log('❌ Error obteniendo proyecto\n')
      return
    }

    const link = project.data.link
    if (!link || !link.repoId) {
      console.log('⚠️  No hay repo conectado\n')
      console.log('💡 Vercel hará deploy automático cuando detecte el nuevo commit\n')
      return
    }

    console.log('✅ Proyecto encontrado\n')
    console.log('🔄 Creando nuevo deployment...\n')

    // Crear nuevo deployment
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
      console.log('✅ Nuevo deployment iniciado!\n')
      console.log('📊 RESUMEN:\n')
      console.log('✅ Deployment iniciado desde branch nuevo-diseno')
      console.log('⏳ Esperá 2-3 minutos para que termine\n')
      console.log(`✅ Tu SaaS: ${url}\n`)
      console.log('🎯 Después del deploy, la página estará en:')
      console.log(`   ${url}/configurar-webhook\n`)
    } else {
      console.log(`⚠️  Error: ${JSON.stringify(deploy.data)}\n`)
      console.log('💡 Vercel hará deploy automático cuando detecte el nuevo commit\n')
      console.log('💡 O podés hacerlo manualmente:\n')
      console.log('   1. Ve a: https://vercel.com/dashboard')
      console.log(`   2. Click en: ${PROJECT_NAME}`)
      console.log('   3. Deployments → Click en "Redeploy" del último deploy\n')
    }
  } catch (error) {
    console.log('❌ Error:', error.message, '\n')
    console.log('💡 Vercel hará deploy automático cuando detecte el nuevo commit\n')
  }
}

main().catch(console.error)

