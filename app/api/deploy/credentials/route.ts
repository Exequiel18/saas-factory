import { NextResponse } from "next/server"
import { getDeployAgent } from "@/lib/deploy-agent"

/**
 * POST - Guardar credenciales para deploy
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const agent = getDeployAgent()
    
    const result = await agent.setCredentials({
      vercelToken: body.vercelToken,
      githubToken: body.githubToken,
      databaseUrl: body.databaseUrl,
      nextauthSecret: body.nextauthSecret,
      nextauthUrl: body.nextauthUrl
    })

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

/**
 * GET - Obtener credenciales necesarias
 */
export async function GET() {
  try {
    const agent = getDeployAgent()
    const required = agent.getRequiredCredentials()
    
    return NextResponse.json({ credentials: required })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

