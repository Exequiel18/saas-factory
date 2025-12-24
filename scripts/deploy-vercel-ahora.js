/**
 * 🚀 DEPLOY A VERCEL AHORA - FORZAR DEPLOYMENT
 */

require('dotenv').config({ path: '.env.local' })

const https = require('https')

const VERCEL_TOKEN = process.env.VERCEL_TOKEN || '9DcHcwyLkRUzRg5RCVTlWpHc'
const PROJECT_NAME = 'saas-factory-antigravity'
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
  console.log('\n🚀 FORZANDO DEPLOY EN VERCEL\n')
  console.log('='.repeat(60))
  console.log(`Proyecto: ${PROJECT_NAME}`)
  console.log(`Branch: ${BRANCH}`)
  console.log('='.repeat(60))
  console.log('\n')

  try {
    // Paso 1: Obtener información del proyecto
    console.log('1️⃣ Obteniendo información del proyecto...\n')
    const project = await makeRequest(
      'api.vercel.com',
      `/v9/projects/${PROJECT_NAME}`
    )

    if (project.status !== 200) {
      console.log('❌ Error obteniendo proyecto')
      console.log('💡 Verificá que el proyecto exista en Vercel\n')
      return
    }

    console.log('✅ Proyecto encontrado\n')

    // Paso 2: Obtener el repo ID
    const link = project.data.link
    if (!link || !link.repoId) {
      console.log('⚠️  No hay repo conectado')
      console.log('💡 Conectá el repo de GitHub primero\n')
      return
    }

    console.log(`✅ Repo conectado: ${link.repo}\n`)

    // Paso 3: Crear nuevo deployment desde el branch correcto
    console.log(`2️⃣ Creando nuevo deployment desde branch: ${BRANCH}...\n`)
    
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
      
      console.log('✅ DEPLOYMENT INICIADO!\n')
      console.log('📊 DETALLES:\n')
      console.log(`   URL: ${url}`)
      console.log(`   Branch: ${BRANCH}`)
      console.log(`   Estado: ${deployment.readyState || 'BUILDING'}`)
      console.log(`   ID: ${deployment.uid}\n`)
      console.log('⏳ Esperá 2-3 minutos para que termine el build\n')
      console.log('🌐 Tu web estará en:')
      console.log(`   ${url}\n`)
      console.log('💡 Podés ver el progreso en:')
      console.log(`   https://vercel.com/dashboard\n`)
    } else {
      console.log(`❌ Error: ${JSON.stringify(deploy.data)}\n`)
      console.log('💡 Intentá manualmente:\n')
      console.log('   1. Ve a: https://vercel.com/dashboard')
      console.log(`   2. Click en: ${PROJECT_NAME}`)
      console.log('   3. Deployments → Redeploy\n')
    }

  } catch (error) {
    console.error('❌ Error:', error.message, '\n')
    console.log('💡 Verificá:')
    console.log('   - Que el token de Vercel sea correcto')
    console.log('   - Que el proyecto exista')
    console.log('   - Que el repo esté conectado\n')
  }
}

main().catch(console.error)

