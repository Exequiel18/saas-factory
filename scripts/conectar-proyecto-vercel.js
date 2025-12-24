/**
 * 🔗 CONECTAR REPO A PROYECTO EXISTENTE EN VERCEL
 */

const https = require('https')

const VERCEL_TOKEN = 'process.env.VERCEL_TOKEN || '''
const PROJECT_NAME = 'saas-factory-antigravity'
const GITHUB_USER = 'Exequiel18'
const REPO_NAME = 'saas-factory'

console.log('\n🔗 CONECTANDO REPO A PROYECTO EXISTENTE')
console.log('========================================\n')

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
  console.log(`📋 Conectando repo a proyecto: ${PROJECT_NAME}\n`)

  // Leer NEXTAUTH_SECRET
  const fs = require('fs')
  let nextauthSecret = ''
  try {
    const envContent = fs.readFileSync('.env.local', 'utf-8')
    const match = envContent.match(/NEXTAUTH_SECRET\s*=\s*([^\n]+)/)
    if (match) {
      nextauthSecret = match[1].trim()
    }
  } catch {
    console.log('⚠️  No se encontró NEXTAUTH_SECRET en .env.local\n')
  }

  // Configurar variables de entorno
  console.log('📋 Configurando variables de entorno...\n')

  const envVars = [
    {
      key: 'NEXTAUTH_URL',
      value: `https://${PROJECT_NAME}.vercel.app`,
      type: 'system',
      target: ['production', 'preview', 'development']
    },
    {
      key: 'DATABASE_URL',
      value: 'postgresql://postgres.phcfmhxlixdogveondji:Exequiel54..@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
      type: 'encrypted',
      target: ['production', 'preview', 'development']
    },
    {
      key: 'NEXT_PUBLIC_SUPABASE_URL',
      value: 'https://phcfmhxlixdogveondji.supabase.co',
      type: 'system',
      target: ['production', 'preview', 'development']
    },
    {
      key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoY2ZtaHhsaXhkb2d2ZW9uZGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODYwNzcsImV4cCI6MjA4MDE2MjA3N30.YMHYRA16QOt2pBRpx09EpfIEw5uCKdLA7RqAbrASmy8',
      type: 'system',
      target: ['production', 'preview', 'development']
    },
    {
      key: 'SUPABASE_SERVICE_ROLE_KEY',
      value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoY2ZtaHhsaXhkb2d2ZW9uZGppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDU4NjA3NywiZXhwIjoyMDgwMTYyMDc3fQ.xYKb_yoQEqozQzHv0uwTUSJEp5Q4YAjWwKw3QMKI7Hk',
      type: 'encrypted',
      target: ['production', 'preview', 'development']
    }
  ]

  if (nextauthSecret) {
    envVars.push({
      key: 'NEXTAUTH_SECRET',
      value: nextauthSecret,
      type: 'encrypted',
      target: ['production', 'preview', 'development']
    })
  }

  let varsConfigured = 0
  for (const envVar of envVars) {
    const setEnv = await makeRequest(
      'api.vercel.com',
      `/v9/projects/${PROJECT_NAME}/env`,
      'POST',
      envVar,
      {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    )

    if (setEnv.status === 200 || setEnv.status === 201) {
      varsConfigured++
      console.log(`✅ ${envVar.key}`)
    } else if (setEnv.text.includes('already exists')) {
      varsConfigured++
      console.log(`⚠️  ${envVar.key} (ya existe)`)
    } else {
      console.log(`❌ ${envVar.key}: ${setEnv.text}`)
    }
  }

  console.log(`\n✅ ${varsConfigured}/${envVars.length} variables configuradas\n`)

  console.log('📋 PRÓXIMOS PASOS:\n')
  console.log('1. Ve a https://vercel.com/dashboard')
  console.log(`2. Click en el proyecto: ${PROJECT_NAME}`)
  console.log('3. Settings → General → Connect Git Repository')
  console.log(`4. Conectá: https://github.com/${GITHUB_USER}/${REPO_NAME}`)
  console.log('5. Vercel hará deploy automáticamente\n')
  console.log(`✅ Tu SaaS estará en: https://${PROJECT_NAME}.vercel.app\n`)
}

main().catch(console.error)

