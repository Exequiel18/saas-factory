/**
 * 🚀 IMPORTAR PROYECTO DESDE GITHUB
 * 
 * Importa el proyecto directamente desde GitHub a Vercel.
 */

const https = require('https')

const VERCEL_TOKEN = 'process.env.VERCEL_TOKEN || '''
const GITHUB_USER = 'Exequiel18'
const REPO_NAME = 'saas-factory'

console.log('\n🚀 IMPORTANDO PROYECTO DESDE GITHUB')
console.log('==================================\n')

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
  console.log('📋 Importando proyecto desde GitHub...\n')

  // Intentar crear/importar proyecto
  const importProject = await makeRequest(
    'api.vercel.com',
    '/v10/projects/import',
    'POST',
    {
      name: REPO_NAME,
      gitRepository: {
        type: 'github',
        repo: `${GITHUB_USER}/${REPO_NAME}`
      },
      framework: 'nextjs',
      installCommand: 'npm install --legacy-peer-deps',
      buildCommand: 'npm run build',
      outputDirectory: '.next'
    },
    {
      'Authorization': `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json'
    }
  )

  if (importProject.status === 200 || importProject.status === 201) {
    console.log('✅ Proyecto importado exitosamente!\n')
    console.log('📊 RESUMEN:\n')
    console.log('✅ Repositorio importado desde GitHub')
    console.log('✅ Proyecto creado en Vercel')
    console.log(`✅ Tu SaaS: https://${REPO_NAME}.vercel.app\n`)
    console.log('⏳ Vercel está haciendo deploy automáticamente...\n')
    console.log('📋 PRÓXIMOS PASOS:\n')
    console.log('1. Verificar deploy: https://vercel.com/dashboard')
    console.log('2. Configurar variables si faltan')
    console.log('3. Aplicar schema: npm run db:push\n')
  } else if (importProject.text.includes('already exists') || importProject.text.includes('limit')) {
    console.log('⚠️  Límite de proyectos alcanzado\n')
    console.log('💡 SOLUCIÓN (2 minutos):\n')
    console.log('1. Ve a https://vercel.com/dashboard')
    console.log(`2. Click en: saas-factory-antigravity`)
    console.log('3. Settings → General → Connect Git Repository')
    console.log(`4. Conectá: ${GITHUB_USER}/${REPO_NAME}`)
    console.log('5. Vercel hará deploy automáticamente\n')
    console.log(`✅ Tu SaaS: https://saas-factory-antigravity.vercel.app\n`)
  } else {
    console.log(`⚠️  Error: ${importProject.text}\n`)
    console.log('💡 SOLUCIÓN MANUAL (2 minutos):\n')
    console.log('1. Ve a https://vercel.com/dashboard')
    console.log(`2. Click en: saas-factory-antigravity`)
    console.log('3. Settings → General → Connect Git Repository')
    console.log(`4. Conectá: ${GITHUB_USER}/${REPO_NAME}`)
    console.log('5. Vercel hará deploy automáticamente\n')
    console.log(`✅ Tu SaaS: https://saas-factory-antigravity.vercel.app\n`)
  }
}

main().catch(console.error)

