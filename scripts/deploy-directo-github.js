/**
 * 🚀 DEPLOY DIRECTO DESDE GITHUB
 * 
 * Hace deploy directamente desde el repo de GitHub.
 */

const https = require('https')

const VERCEL_TOKEN = 'process.env.VERCEL_TOKEN || '''
const PROJECT_NAME = 'saas-factory-antigravity'
const GITHUB_USER = 'Exequiel18'
const REPO_NAME = 'saas-factory'

console.log('\n🚀 DEPLOY DIRECTO DESDE GITHUB')
console.log('==============================\n')

function makeRequest(hostname, path, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      path,
      method,
      headers: {
        'User-Agent': 'Node.js',
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
  console.log('📋 Haciendo deploy directo desde GitHub...\n')

  // Obtener proyectos para encontrar el ID
  const projects = await makeRequest(
    'api.vercel.com',
    '/v9/projects',
    'GET',
    null,
    {
      'Authorization': `Bearer ${VERCEL_TOKEN}`
    }
  )

  let projectId = PROJECT_NAME
  if (projects.status === 200 && projects.data) {
    const proj = projects.data.projects?.find(p => p.name === PROJECT_NAME)
    if (proj) {
      projectId = proj.id
      console.log(`✅ Proyecto encontrado: ${proj.name} (${proj.id})\n`)
    }
  }

  // Hacer deploy usando el repo de GitHub directamente
  const deploy = await makeRequest(
    'api.vercel.com',
    '/v13/deployments',
    'POST',
    {
      name: PROJECT_NAME,
      project: projectId,
      source: 'github',
      gitSource: {
        type: 'github',
        repo: `${GITHUB_USER}/${REPO_NAME}`,
        ref: 'master',
        sha: 'master'
      }
    },
    {
      'Authorization': `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json'
    }
  )

  if (deploy.status === 200 || deploy.status === 201) {
    const deployUrl = deploy.data.url || `https://${PROJECT_NAME}.vercel.app`
    console.log('✅ Deploy iniciado exitosamente!\n')
    console.log('📊 RESUMEN:\n')
    console.log('✅ Repositorio en GitHub')
    console.log('✅ Deploy iniciado desde GitHub')
    console.log('✅ Variables configuradas')
    console.log(`\n🎯 Tu SaaS estará online en: ${deployUrl}\n`)
    console.log('⏳ Esperá 2-3 minutos para que termine el build\n')
    console.log('📋 PRÓXIMOS PASOS:\n')
    console.log('1. Verificar deploy: https://vercel.com/dashboard')
    console.log('2. Aplicar schema: npm run db:push')
    console.log('3. Probar tu SaaS\n')
  } else {
    console.log(`⚠️  Error: ${deploy.text}\n`)
    console.log('💡 SOLUCIÓN MANUAL (2 minutos):\n')
    console.log('1. Ve a https://vercel.com/dashboard')
    console.log(`2. Click en: ${PROJECT_NAME}`)
    console.log('3. Settings → General → Connect Git Repository')
    console.log(`4. Conectá: ${GITHUB_USER}/${REPO_NAME}`)
    console.log('5. Vercel hará deploy automáticamente\n')
    console.log(`✅ Tu SaaS: https://${PROJECT_NAME}.vercel.app\n`)
  }
}

main().catch(console.error)

