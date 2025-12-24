import { NextResponse } from "next/server"

/**
 * Crea un proyecto en Vercel y hace deploy
 */
export async function POST(request: Request) {
  try {
    const { repoUrl, vercelToken, githubToken } = await request.json()

    if (!repoUrl || !vercelToken) {
      return NextResponse.json(
        { error: "repoUrl y vercelToken requeridos" },
        { status: 400 }
      )
    }

    // Extraer nombre del repo de la URL
    const repoMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)\.git/)
    if (!repoMatch) {
      return NextResponse.json(
        { error: "URL de repositorio inválida" },
        { status: 400 }
      )
    }

    const [, owner, repo] = repoMatch

    // Crear proyecto en Vercel
    const createProjectResponse = await fetch('https://api.vercel.com/v9/projects', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: repo,
        gitRepository: {
          type: 'github',
          repo: `${owner}/${repo}`
        },
        framework: 'nextjs',
        rootDirectory: null,
        installCommand: 'npm install --legacy-peer-deps',
        buildCommand: 'npm run build',
        outputDirectory: '.next',
        env: [
          {
            key: 'NEXTAUTH_URL',
            value: `https://${repo}.vercel.app`,
            type: 'system'
          },
          {
            key: 'NEXTAUTH_SECRET',
            value: process.env.NEXTAUTH_SECRET || '',
            type: 'encrypted'
          },
          {
            key: 'DATABASE_URL',
            value: process.env.DATABASE_URL || 'postgresql://postgres.phcfmhxlixdogveondji:Exequiel54..@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
            type: 'encrypted'
          },
          {
            key: 'NEXT_PUBLIC_SUPABASE_URL',
            value: 'https://phcfmhxlixdogveondji.supabase.co',
            type: 'system'
          },
          {
            key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
            value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoY2ZtaHhsaXhkb2d2ZW9uZGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODYwNzcsImV4cCI6MjA4MDE2MjA3N30.YMHYRA16QOt2pBRpx09EpfIEw5uCKdLA7RqAbrASmy8',
            type: 'system'
          },
          {
            key: 'SUPABASE_SERVICE_ROLE_KEY',
            value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoY2ZtaHhsaXhkb2d2ZW9uZGppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDU4NjA3NywiZXhwIjoyMDgwMTYyMDc3fQ.xYKb_yoQEqozQzHv0uwTUSJEp5Q4YAjWwKw3QMKI7Hk',
            type: 'encrypted'
          }
        ]
      })
    })

    if (!createProjectResponse.ok) {
      const error = await createProjectResponse.text()
      return NextResponse.json(
        { error: `Error creando proyecto en Vercel: ${error}` },
        { status: createProjectResponse.status }
      )
    }

    const projectData = await createProjectResponse.json()

    // Hacer deploy
    const deployResponse = await fetch(`https://api.vercel.com/v13/deployments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: repo,
        project: projectData.id,
        gitSource: {
          type: 'github',
          repo: `${owner}/${repo}`,
          ref: 'master'
        }
      })
    })

    if (!deployResponse.ok) {
      const error = await deployResponse.text()
      return NextResponse.json(
        { error: `Error en deploy: ${error}` },
        { status: deployResponse.status }
      )
    }

    const deployData = await deployResponse.json()

    return NextResponse.json({
      success: true,
      url: `https://${repo}.vercel.app`,
      projectId: projectData.id,
      deploymentId: deployData.id
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

