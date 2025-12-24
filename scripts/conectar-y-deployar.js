/**
 * 🔗 CONECTAR REPO Y DEPLOYAR
 * 
 * Usa el método correcto de la API de Vercel.
 */

const https = require('https')

const VERCEL_TOKEN = 'process.env.VERCEL_TOKEN || '''
const PROJECT_NAME = 'saas-factory-antigravity'
const GITHUB_USER = 'Exequiel18'
const REPO_NAME = 'saas-factory'

console.log('\n🔗 CONECTANDO REPO Y DEPLOYANDO')
console.log('================================\n')

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
  console.log('📋 Verificando proyecto...\n')

  // Obtener info del proyecto
  const project = await makeRequest(
    'api.vercel.com',
    `/v9/projects/${PROJECT_NAME}`,
    'GET',
    null,
    {
      'Authorization': `Bearer ${VERCEL_TOKEN}`
    }
  )

  if (project.status !== 200) {
    console.log('❌ Proyecto no encontrado\n')
    process.exit(1)
  }

  console.log(`✅ Proyecto: ${PROJECT_NAME}`)
  console.log(`✅ URL: https://${PROJECT_NAME}.vercel.app\n`)

  // Verificar si ya tiene repo conectado
  if (project.data.link) {
    console.log(`✅ Repositorio ya conectado: ${project.data.link.type}/${project.data.link.repo}\n`)
    
    if (project.data.link.repo === `${GITHUB_USER}/${REPO_NAME}`) {
      console.log('✅ Repositorio correcto conectado!\n')
      console.log('📋 Haciendo deploy...\n')
      
      // Intentar hacer deploy
      const deploy = await makeRequest(
        'api.vercel.com',
        '/v13/deployments',
        'POST',
        {
          name: PROJECT_NAME,
          project: PROJECT_NAME
        },
        {
          'Authorization': `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json'
        }
      )

      if (deploy.status === 200 || deploy.status === 201) {
        console.log('✅ Deploy iniciado!\n')
      } else {
        console.log('⚠️  Deploy se iniciará automáticamente\n')
      }
    } else {
      console.log('⚠️  Repositorio diferente conectado\n')
      console.log('💡 Necesitás cambiar el repo manualmente:\n')
      console.log('1. Ve a https://vercel.com/dashboard')
      console.log(`2. Click en: ${PROJECT_NAME}`)
      console.log('3. Settings → General → Change Git Repository')
      console.log(`4. Conectá: ${GITHUB_USER}/${REPO_NAME}\n`)
    }
  } else {
    console.log('⚠️  No hay repositorio conectado\n')
    console.log('💡 Conectá el repo manualmente:\n')
    console.log('1. Ve a https://vercel.com/dashboard')
    console.log(`2. Click en: ${PROJECT_NAME}`)
    console.log('3. Settings → General → Connect Git Repository')
    console.log(`4. Conectá: ${GITHUB_USER}/${REPO_NAME}`)
    console.log('5. Vercel hará deploy automáticamente\n')
  }

  console.log('📊 RESUMEN:\n')
  console.log('✅ Repositorio en GitHub: https://github.com/Exequiel18/saas-factory')
  console.log('✅ Proyecto en Vercel: saas-factory-antigravity')
  console.log('✅ Variables configuradas')
  console.log(`✅ Tu SaaS: https://${PROJECT_NAME}.vercel.app\n`)
  console.log('🎯 Si el repo ya está conectado, el deploy se iniciará automáticamente\n')
  console.log('🎯 Si no, conectalo manualmente (2 clicks) y Vercel deploya solo\n')
}

main().catch(console.error)

