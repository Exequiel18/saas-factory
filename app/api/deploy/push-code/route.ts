import { NextResponse } from "next/server"
import { execSync } from "child_process"

/**
 * Hace push del código a GitHub
 */
export async function POST(request: Request) {
  try {
    const { repoUrl, token } = await request.json()

    if (!repoUrl || !token) {
      return NextResponse.json(
        { error: "repoUrl y token requeridos" },
        { status: 400 }
      )
    }

    // Construir URL con token para autenticación
    const urlWithToken = repoUrl.replace('https://', `https://${token}@`)

    // Verificar rama actual
    let branch = 'master'
    try {
      branch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim() || 'master'
    } catch {
      branch = 'master'
    }

    // Agregar remote si no existe
    try {
      execSync('git remote get-url origin', { stdio: 'ignore' })
      execSync(`git remote set-url origin ${urlWithToken}`, { stdio: 'pipe' })
    } catch {
      execSync(`git remote add origin ${urlWithToken}`, { stdio: 'pipe' })
    }

    // Asegurar que todo esté commiteado
    try {
      execSync('git add .', { stdio: 'pipe' })
      execSync('git commit -m "Ready for production"', { stdio: 'pipe' })
    } catch {
      // Puede que no haya cambios
    }

    // Hacer push
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

    return NextResponse.json({
      success: true,
      message: 'Código subido exitosamente'
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

