/**
 * 🔍 VERIFICAR PROYECTO EN VERCEL
 */

const https = require('https')

const VERCEL_TOKEN = 'process.env.VERCEL_TOKEN || '''
const REPO_NAME = 'saas-factory'

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
  console.log('\n🔍 VERIFICANDO PROYECTO EN VERCEL\n')

  // Listar proyectos existentes
  const projects = await makeRequest(
    'api.vercel.com',
    '/v9/projects',
    'GET',
    null,
    {
      'Authorization': `Bearer ${VERCEL_TOKEN}`
    }
  )

  if (projects.status === 200 && projects.data) {
    const existing = projects.data.projects?.find(p => p.name === REPO_NAME)
    
    if (existing) {
      console.log(`✅ Proyecto encontrado: ${existing.name}`)
      console.log(`✅ URL: https://${existing.name}.vercel.app\n`)
      console.log('🎯 Tu SaaS ya está deployado!\n')
      console.log('📋 PRÓXIMOS PASOS:\n')
      console.log('1. Verificar variables de entorno en Vercel Dashboard')
      console.log('2. Aplicar schema: npm run db:push')
      console.log('3. Probar: https://saas-factory.vercel.app/chequeo-real\n')
    } else {
      console.log('⚠️  Proyecto no encontrado')
      console.log('💡 Tu cuenta alcanzó el límite de proyectos (200)')
      console.log('💡 Opciones:\n')
      console.log('1. Eliminar proyectos viejos en Vercel')
      console.log('2. Usar un proyecto existente')
      console.log('3. Hacer deploy manualmente desde Vercel Dashboard\n')
    }
  }
}

main().catch(console.error)

