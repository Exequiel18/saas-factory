import { NextResponse } from "next/server"
import { getDeployAgent } from "@/lib/deploy-agent"

/**
 * Verifica que el sistema esté listo para deploy
 */
export async function POST() {
  try {
    const agent = getDeployAgent()
    const checks = await agent.verifySystem()
    const status = agent.getStatus()
    
    return NextResponse.json({
      success: true,
      checks,
      status
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

