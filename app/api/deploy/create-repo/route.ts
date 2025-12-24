import { NextResponse } from "next/server"

/**
 * Crea un repositorio en GitHub usando la API
 */
export async function POST(request: Request) {
  try {
    const { name, token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: "GitHub token requerido" },
        { status: 400 }
      )
    }

    const repoName = name || 'saas-factory'

    // Crear repo en GitHub
    const response = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: repoName,
        description: 'Chequeo Real de Negocio - SaaS completo',
        private: false,
        auto_init: false
      })
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json(
        { error: `Error creando repo: ${error}` },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      repoUrl: data.clone_url,
      repoName: data.name,
      repoFullName: data.full_name
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

