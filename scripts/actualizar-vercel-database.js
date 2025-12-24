/**
 * 🔧 ACTUALIZAR DATABASE_URL EN VERCEL
 */

const https = require('https')

const VERCEL_TOKEN = '9DcHcwyLkRUzRg5RCVTlWpHc'
const PROJECT_NAME = 'saas-factory-antigravity'
const DATABASE_URL = 'postgresql://postgres:Exequiel54..@db.phcfmhxlixdogveondji.supabase.co:5432/postgres'

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
  console.log('\n🔧 ACTUALIZANDO DATABASE_URL EN VERCEL\n')

  try {
    // Obtener proyecto
    const project = await makeRequest(
      'api.vercel.com',
      `/v9/projects/${PROJECT_NAME}`,
      'GET'
    )

    if (project.status !== 200) {
      console.log('❌ Error obteniendo proyecto\n')
      console.log('💡 Actualizá DATABASE_URL manualmente en Vercel Dashboard\n')
      return
    }

    console.log('✅ Proyecto encontrado\n')

    // Obtener variables existentes
    console.log('🔄 Obteniendo variables existentes...\n')
    
    const envVars = await makeRequest(
      'api.vercel.com',
      `/v9/projects/${PROJECT_NAME}/env`,
      'GET'
    )

    // Buscar DATABASE_URL existente
    let existingEnv = null
    if (envVars.status === 200 && Array.isArray(envVars.data.envs)) {
      existingEnv = envVars.data.envs.find(e => e.key === 'DATABASE_URL')
    }

    // Actualizar variable de entorno
    console.log('🔄 Actualizando DATABASE_URL...\n')

    let update
    if (existingEnv) {
      // Actualizar existente
      update = await makeRequest(
        'api.vercel.com',
        `/v9/projects/${PROJECT_NAME}/env/${existingEnv.id}`,
        'PATCH',
        {
          value: DATABASE_URL,
          target: ['production', 'preview', 'development']
        }
      )
    } else {
      // Crear nueva
      update = await makeRequest(
        'api.vercel.com',
        `/v9/projects/${PROJECT_NAME}/env`,
        'POST',
        {
          key: 'DATABASE_URL',
          value: DATABASE_URL,
          type: 'encrypted',
          target: ['production', 'preview', 'development']
        }
      )
    }

    if (update.status === 200 || update.status === 201) {
      console.log('✅ DATABASE_URL actualizado en Vercel!\n')
      console.log('📊 RESUMEN:\n')
      console.log('✅ Variable actualizada')
      console.log('✅ Aplicada a: production, preview, development\n')
    } else {
      console.log(`⚠️  Error: ${JSON.stringify(update.data)}\n`)
      console.log('💡 Actualizá DATABASE_URL manualmente:\n')
      console.log('   1. Ve a: https://vercel.com/dashboard')
      console.log(`   2. Click en: ${PROJECT_NAME}`)
      console.log('   3. Settings → Environment Variables')
      console.log('   4. Actualizá DATABASE_URL con:')
      console.log(`      ${DATABASE_URL}\n`)
    }
  } catch (error) {
    console.log('❌ Error:', error.message, '\n')
    console.log('💡 Actualizá DATABASE_URL manualmente en Vercel Dashboard\n')
  }
}

main().catch(console.error)

