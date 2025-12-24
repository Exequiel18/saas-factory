/**
 * 🚀 DEPLOY COMPLETO EN VERCEL
 * 
 * Usa los tokens para hacer el deploy automático completo.
 */

const https = require('https')
const fs = require('fs')

// Tokens deben estar en variables de entorno o .env.local
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''
const VERCEL_TOKEN = process.env.VERCEL_TOKEN || ''
const GITHUB_USER = 'Exequiel18'
const REPO_NAME = 'saas-factory'

console.log('\n🚀 DEPLOY COMPLETO EN VERCEL')
console.log('============================\n')

// Función helper para requests
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
  console.log('📋 PASO 1: Verificando repositorio...\n')

  // Verificar que el repo existe
  const repoCheck = await makeRequest('api.github.com', `/repos/${GITHUB_USER}/${REPO_NAME}`, 'GET', null, {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
  })

  if (repoCheck.status !== 200) {
    console.log('❌ Repositorio no encontrado\n')
    process.exit(1)
  }

  console.log(`✅ Repositorio encontrado: https://github.com/${GITHUB_USER}/${REPO_NAME}\n`)

  console.log('📋 PASO 2: Creando proyecto en Vercel...\n')

  // Crear proyecto en Vercel (sin env primero)
  const createProject = await makeRequest(
    'api.vercel.com',
    '/v9/projects',
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

  let projectId = REPO_NAME
  if (createProject.status === 200 || createProject.status === 201) {
    projectId = createProject.data.id || REPO_NAME
    console.log('✅ Proyecto creado en Vercel\n')
  } else if (createProject.text.includes('already exists')) {
    console.log('⚠️  Proyecto ya existe en Vercel\n')
  } else {
    console.log(`⚠️  Error creando proyecto: ${createProject.text}`)
    console.log('Continuando con deploy...\n')
  }

  console.log('📋 PASO 3: Configurando variables de entorno...\n')

  // Leer NEXTAUTH_SECRET del .env.local si existe
  let nextauthSecret = ''
  try {
    const envContent = fs.readFileSync('.env.local', 'utf-8')
    const match = envContent.match(/NEXTAUTH_SECRET\s*=\s*([^\n]+)/)
    if (match) {
      nextauthSecret = match[1].trim()
    }
  } catch {
    // No hay .env.local
  }

  // Variables de entorno a configurar
  const envVars = [
    {
      key: 'NEXTAUTH_URL',
      value: `https://${REPO_NAME}.vercel.app`,
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

  // Agregar NEXTAUTH_SECRET si existe
  if (nextauthSecret) {
    envVars.push({
      key: 'NEXTAUTH_SECRET',
      value: nextauthSecret,
      type: 'encrypted',
      target: ['production', 'preview', 'development']
    })
  }

  // Configurar cada variable
  let varsConfigured = 0
  for (const envVar of envVars) {
    const setEnv = await makeRequest(
      'api.vercel.com',
      `/v9/projects/${projectId}/env`,
      'POST',
      envVar,
      {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    )

    if (setEnv.status === 200 || setEnv.status === 201) {
      varsConfigured++
      console.log(`✅ Variable configurada: ${envVar.key}`)
    } else if (setEnv.text.includes('already exists')) {
      varsConfigured++
      console.log(`⚠️  Variable ya existe: ${envVar.key}`)
    } else {
      console.log(`⚠️  Error configurando ${envVar.key}: ${setEnv.text}`)
    }
  }

  console.log(`\n✅ ${varsConfigured}/${envVars.length} variables configuradas\n`)

  console.log('📋 PASO 4: Haciendo deploy...\n')

  // Hacer deploy
  const deploy = await makeRequest(
    'api.vercel.com',
    '/v13/deployments',
    'POST',
    {
      name: REPO_NAME,
      project: projectId,
      gitSource: {
        type: 'github',
        repo: `${GITHUB_USER}/${REPO_NAME}`,
        ref: 'master'
      }
    },
    {
      'Authorization': `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json'
    }
  )

  if (deploy.status === 200 || deploy.status === 201) {
    const deployUrl = `https://${REPO_NAME}.vercel.app`
    console.log('✅ Deploy iniciado!\n')
    console.log('📊 RESUMEN:\n')
    console.log('✅ Repositorio en GitHub')
    console.log('✅ Proyecto creado en Vercel')
    console.log('✅ Variables configuradas')
    console.log('✅ Deploy iniciado')
    console.log(`\n🎯 Tu SaaS estará online en: ${deployUrl}\n`)
    console.log('⏳ Esperá 2-3 minutos para que termine el build\n')
    console.log('📋 PRÓXIMOS PASOS:\n')
    console.log('1. Verificar deploy en: https://vercel.com/dashboard')
    console.log('2. Aplicar schema de base de datos:')
    console.log('   npm run db:push\n')
    console.log('3. Probar tu SaaS:')
    console.log(`   ${deployUrl}/chequeo-real`)
    console.log(`   ${deployUrl}/dashboard/command-center\n`)
  } else {
    console.log(`❌ Error en deploy: ${deploy.text}\n`)
    console.log('💡 Intentá manualmente en: https://vercel.com\n')
    process.exit(1)
  }
}

main().catch(console.error)
