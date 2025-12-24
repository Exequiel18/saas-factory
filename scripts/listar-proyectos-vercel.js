/**
 * 📋 LISTAR PROYECTOS EN VERCEL
 */

const https = require('https')

const VERCEL_TOKEN = 'process.env.VERCEL_TOKEN || '''

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
  console.log('\n📋 PROYECTOS EN VERCEL\n')

  const projects = await makeRequest(
    'api.vercel.com',
    '/v9/projects?limit=20',
    'GET',
    null,
    {
      'Authorization': `Bearer ${VERCEL_TOKEN}`
    }
  )

  if (projects.status === 200 && projects.data) {
    const projs = projects.data.projects || []
    
    if (projs.length === 0) {
      console.log('No se encontraron proyectos\n')
      return
    }

    console.log(`Encontrados ${projs.length} proyectos:\n`)
    
    projs.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`)
      console.log(`   URL: https://${p.name}.vercel.app`)
      console.log(`   Creado: ${new Date(p.createdAt).toLocaleDateString()}`)
      console.log('')
    })

    console.log('💡 Para usar uno de estos proyectos:')
    console.log('1. Ve a https://vercel.com/dashboard')
    console.log('2. Click en el proyecto que querés usar')
    console.log('3. Settings → General → Connect Git Repository')
    console.log('4. Conectá: https://github.com/Exequiel18/saas-factory')
    console.log('5. Configurá las variables (ver DEPLOY_VERCEL_LIMITE.md)')
    console.log('6. Deploy\n')
  } else {
    console.log('Error obteniendo proyectos\n')
  }
}

main().catch(console.error)

