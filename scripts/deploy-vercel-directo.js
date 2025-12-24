/**
 * 🚀 DEPLOY DIRECTO EN VERCEL
 */

const https = require('https')

const VERCEL_TOKEN = '9DcHcwyLkRUzRg5RCVTlWpHc'
const PROJECT_NAME = 'saas-factory-antigravity'
const GITHUB_REPO = 'Exequiel18/saas-factory'
const BRANCH = 'nuevo-diseno'

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
          resolve({ status: res.statusCode, data: json, text: data })
        } catch {
          resolve({ status: res.statusCode, data: data, text: data })
        }
      })
    })

    req.on('error', reject)
    if (body) req.write(JSON.stringify(body))
    req.end()
  })
}

async function main() {
  console.log('\n🚀 FORZANDO DEPLOY EN VERCEL\n')
  console.log('='.repeat(60))
  console.log(`Proyecto: ${PROJECT_NAME}`)
  console.log(`Repo: ${GITHUB_REPO}`)
  console.log(`Branch: ${BRANCH}`)
  console.log('='.repeat(60))
  console.log('\n')

  try {
    // Paso 1: Obtener proyecto para conseguir repoId
    console.log('1️⃣ Obteniendo información del proyecto...\n')
    const project = await makeRequest(
      'api.vercel.com',
      `/v9/projects/${PROJECT_NAME}`
    )

    if (project.status !== 200) {
      console.log('❌ Error obteniendo proyecto\n')
      console.log('💡 SOLUCIÓN MANUAL:\n')
      console.log('1. Ve a: https://vercel.com/dashboard')
      console.log(`2. Click en: ${PROJECT_NAME}`)
      console.log('3. Settings → Git')
      console.log(`4. Production Branch: cambiá a ${BRANCH}`)
      console.log('5. Save')
      console.log('6. Deployments → Redeploy\n')
      return
    }

    const link = project.data.link
    if (!link || !link.repoId) {
      console.log('⚠️  No hay repo conectado\n')
      console.log('💡 SOLUCIÓN MANUAL:\n')
      console.log('1. Ve a: https://vercel.com/dashboard')
      console.log(`2. Click en: ${PROJECT_NAME}`)
      console.log('3. Settings → Git')
      console.log(`4. Production Branch: cambiá a ${BRANCH}`)
      console.log('5. Save')
      console.log('6. Deployments → Redeploy\n')
      return
    }

    console.log(`✅ Repo conectado: ${link.repo}\n`)

    // Paso 2: Crear deployment
    console.log('2️⃣ Creando deployment desde branch nuevo-diseno...\n')
    
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
          ref: BRANCH
        },
        target: 'production'
      }
    )

    if (deploy.status === 200 || deploy.status === 201) {
      const deployment = deploy.data
      const url = deployment.url || `https://${PROJECT_NAME}.vercel.app`
      
      console.log('✅ DEPLOYMENT INICIADO EXITOSAMENTE!\n')
      console.log('📊 DETALLES:\n')
      console.log(`   URL: ${url}`)
      console.log(`   Branch: ${BRANCH}`)
      console.log(`   Estado: ${deployment.readyState || 'BUILDING'}`)
      console.log(`   ID: ${deployment.uid || deployment.id}\n`)
      console.log('⏳ Esperá 2-3 minutos para que termine el build\n')
      console.log('🌐 Tu web estará en:')
      console.log(`   ${url}\n`)
      console.log('💡 Podés ver el progreso en:')
      console.log(`   https://vercel.com/dashboard\n`)
      console.log('='.repeat(60))
      console.log('\n✅ DEPLOYMENT FORZADO EXITOSAMENTE\n')
    } else {
      console.log(`❌ Error: ${deploy.status}`)
      console.log(`Detalles: ${deploy.text}\n`)
      console.log('💡 SOLUCIÓN MANUAL:\n')
      console.log('1. Ve a: https://vercel.com/dashboard')
      console.log(`2. Click en: ${PROJECT_NAME}`)
      console.log('3. Settings → Git')
      console.log(`4. Production Branch: cambiá a ${BRANCH}`)
      console.log('5. Save')
      console.log('6. Deployments → Redeploy\n')
    }

  } catch (error) {
    console.error('❌ Error:', error.message, '\n')
    console.log('💡 SOLUCIÓN MANUAL:\n')
    console.log('1. Ve a: https://vercel.com/dashboard')
    console.log(`2. Click en: ${PROJECT_NAME}`)
    console.log('3. Settings → Git')
    console.log(`4. Production Branch: cambiá a ${BRANCH}`)
    console.log('5. Save')
    console.log('6. Deployments → Redeploy\n')
  }
}

main().catch(console.error)

