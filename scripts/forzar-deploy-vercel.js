/**
 * 🚀 FORZAR DEPLOY EN VERCEL - GARANTIZADO
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
    // Paso 1: Obtener proyecto
    console.log('1️⃣ Obteniendo información del proyecto...\n')
    const project = await makeRequest(
      'api.vercel.com',
      `/v9/projects/${PROJECT_NAME}`
    )

    if (project.status !== 200) {
      console.log('❌ Error obteniendo proyecto')
      console.log(`Status: ${project.status}`)
      console.log(`Error: ${project.text}\n`)
      console.log('💡 Verificá que el proyecto exista en Vercel\n')
      return
    }

    console.log('✅ Proyecto encontrado\n')
    console.log(`   Nombre: ${project.data.name}`)
    console.log(`   ID: ${project.data.id}\n`)

    // Paso 2: Obtener deployments recientes
    console.log('2️⃣ Verificando deployments recientes...\n')
    const deployments = await makeRequest(
      'api.vercel.com',
      `/v6/deployments?projectId=${project.data.id}&limit=3`
    )

    if (deployments.status === 200 && deployments.data.deployments) {
      const latest = deployments.data.deployments[0]
      console.log(`   Último deployment:`)
      console.log(`   - Branch: ${latest.gitSource?.ref || 'N/A'}`)
      console.log(`   - Estado: ${latest.readyState}`)
      console.log(`   - URL: ${latest.url}\n`)
    }

    // Paso 3: Crear nuevo deployment
    console.log(`3️⃣ Creando nuevo deployment desde branch: ${BRANCH}...\n`)
    
    const deployBody = {
      name: PROJECT_NAME,
      project: PROJECT_NAME,
      gitSource: {
        type: 'github',
        repo: GITHUB_REPO,
        ref: BRANCH
      },
      target: 'production'
    }

    console.log('   Payload:', JSON.stringify(deployBody, null, 2))
    console.log('')

    const deploy = await makeRequest(
      'api.vercel.com',
      '/v13/deployments',
      'POST',
      deployBody
    )

    if (deploy.status === 200 || deploy.status === 201) {
      const deployment = deploy.data
      const url = deployment.url || `https://${PROJECT_NAME}.vercel.app`
      
      console.log('✅ DEPLOYMENT INICIADO EXITOSAMENTE!\n')
      console.log('📊 DETALLES DEL DEPLOYMENT:\n')
      console.log(`   URL: ${url}`)
      console.log(`   Branch: ${BRANCH}`)
      console.log(`   Estado: ${deployment.readyState || 'BUILDING'}`)
      console.log(`   ID: ${deployment.uid || deployment.id}\n`)
      console.log('⏳ Esperá 2-3 minutos para que termine el build\n')
      console.log('🌐 Tu web mejorada estará en:')
      console.log(`   ${url}\n`)
      console.log('💡 Podés ver el progreso en:')
      console.log(`   https://vercel.com/dashboard\n`)
      console.log('='.repeat(60))
      console.log('\n✅ DEPLOYMENT FORZADO EXITOSAMENTE\n')
    } else {
      console.log(`❌ Error al crear deployment`)
      console.log(`Status: ${deploy.status}`)
      console.log(`Error: ${JSON.stringify(deploy.data, null, 2)}\n`)
      
      // Intentar método alternativo
      console.log('🔄 Intentando método alternativo...\n')
      
      const altDeploy = await makeRequest(
        'api.vercel.com',
        '/v13/deployments',
        'POST',
        {
          name: PROJECT_NAME,
          gitSource: {
            type: 'github',
            repo: GITHUB_REPO,
            ref: BRANCH
          }
        }
      )

      if (altDeploy.status === 200 || altDeploy.status === 201) {
        console.log('✅ Deployment iniciado con método alternativo!\n')
        const url = altDeploy.data.url || `https://${PROJECT_NAME}.vercel.app`
        console.log(`🌐 Tu web: ${url}\n`)
      } else {
        console.log('❌ Ambos métodos fallaron\n')
        console.log('💡 SOLUCIÓN MANUAL (2 minutos):\n')
        console.log('1. Ve a: https://vercel.com/dashboard')
        console.log(`2. Click en: ${PROJECT_NAME}`)
        console.log('3. Settings → Git')
        console.log(`4. Cambiá el branch a: ${BRANCH}`)
        console.log('5. Save')
        console.log('6. Deployments → Redeploy\n')
      }
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

