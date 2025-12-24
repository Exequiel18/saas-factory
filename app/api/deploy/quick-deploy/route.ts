import { NextResponse } from "next/server"
import { execSync } from "child_process"

/**
 * Deploy rápido usando tokens proporcionados
 */
export async function POST(request: Request) {
  try {
    const { githubToken, vercelToken, repoName } = await request.json()

    if (!githubToken) {
      return NextResponse.json(
        { error: "GitHub token requerido" },
        { status: 400 }
      )
    }

    const repo = repoName || 'saas-factory'

    // Paso 1: Crear repo en GitHub
    const createRepoResponse = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: repo,
        description: 'Chequeo Real de Negocio - SaaS completo',
        private: false,
        auto_init: false
      })
    })

    let repoUrl = ''
    if (createRepoResponse.ok) {
      const repoData = await createRepoResponse.json()
      repoUrl = repoData.clone_url
    } else {
      const error = await createRepoResponse.text()
      if (error.includes('already exists')) {
        // Obtener info del repo existente
        const userResponse = await fetch('https://api.github.com/user', {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        })
        const user = await userResponse.json()
        repoUrl = `https://github.com/${user.login}/${repo}.git`
      } else {
        return NextResponse.json(
          { error: `Error creando repo: ${error}` },
          { status: createRepoResponse.status }
        )
      }
    }

    // Paso 2: Push código
    const urlWithToken = repoUrl.replace('https://', `https://${githubToken}@`)
    
    let branch = 'master'
    try {
      branch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim() || 'master'
    } catch {
      branch = 'master'
    }

    try {
      execSync('git remote get-url origin', { stdio: 'ignore' })
      execSync(`git remote set-url origin ${urlWithToken}`, { stdio: 'pipe' })
    } catch {
      execSync(`git remote add origin ${urlWithToken}`, { stdio: 'pipe' })
    }

    try {
      execSync('git add .', { stdio: 'pipe' })
      execSync('git commit -m "Ready for production"', { stdio: 'pipe' })
    } catch {
      // Puede que no haya cambios
    }

    try {
      execSync(`git push -u origin ${branch}`, { 
        stdio: 'pipe',
        env: { ...process.env, GIT_TERMINAL_PROMPT: '0' }
      })
    } catch (error: any) {
      return NextResponse.json(
        { error: `Error en push: ${error.message}` },
        { status: 500 }
      )
    }

    // Paso 3: Deploy en Vercel (si hay token)
    let vercelUrl = null
    if (vercelToken) {
      const repoMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)\.git/)
      if (repoMatch) {
        const [, owner, repo] = repoMatch

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

        if (createProjectResponse.ok) {
          const projectData = await createProjectResponse.json()
          vercelUrl = `https://${repo}.vercel.app`
        }
      }
    }

    return NextResponse.json({
      success: true,
      repoUrl: repoUrl.replace('.git', ''),
      vercelUrl,
      message: vercelToken ? 'Deploy completo exitoso' : 'Código subido, falta token de Vercel para deploy'
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

