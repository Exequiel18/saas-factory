/**
 * 🚀 API: DEPLOY INMEDIATO EN VERCEL
 */

import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const VERCEL_TOKEN = '9DcHcwyLkRUzRg5RCVTlWpHc'
const PROJECT_NAME = 'saas-factory-antigravity'
const GITHUB_REPO = 'Exequiel18/saas-factory'
const BRANCH = 'nuevo-diseno'

export async function GET() {
  try {
    // Obtener proyecto
    const projectRes = await fetch(
      `https://api.vercel.com/v9/projects/${PROJECT_NAME}`,
      {
        headers: {
          'Authorization': `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!projectRes.ok) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Error obteniendo proyecto',
          details: await projectRes.text()
        },
        { status: projectRes.status }
      )
    }

    const project = await projectRes.json()

    // Crear deployment
    const deployRes = await fetch(
      'https://api.vercel.com/v13/deployments',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: PROJECT_NAME,
          project: PROJECT_NAME,
          gitSource: {
            type: 'github',
            repo: GITHUB_REPO,
            ref: BRANCH
          },
          target: 'production'
        })
      }
    )

    if (!deployRes.ok) {
      const errorData = await deployRes.text()
      return NextResponse.json(
        { 
          success: false, 
          error: 'Error creando deployment',
          details: errorData
        },
        { status: deployRes.status }
      )
    }

    const deployment = await deployRes.json()
    const url = deployment.url || `https://${PROJECT_NAME}.vercel.app`

    return NextResponse.json({
      success: true,
      message: 'Deployment iniciado exitosamente',
      deployment: {
        url,
        branch: BRANCH,
        state: deployment.readyState || 'BUILDING',
        id: deployment.uid || deployment.id
      },
      vercelUrl: `https://vercel.com/dashboard`,
      productionUrl: `https://${PROJECT_NAME}.vercel.app`
    })

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

