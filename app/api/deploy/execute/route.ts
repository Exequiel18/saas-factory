import { NextResponse } from "next/server"
import { getDeployAgent } from "@/lib/deploy-agent"

/**
 * Ejecuta el deploy automático
 */
export async function POST() {
  try {
    const agent = getDeployAgent()
    
    // Preparar
    const prepareResult = await agent.prepareDeploy()
    if (!prepareResult.success) {
      return NextResponse.json(prepareResult, { status: 400 })
    }

    // Ejecutar
    const deployResult = await agent.executeDeploy()
    const status = agent.getStatus()
    
    return NextResponse.json({
      ...deployResult,
      status
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

/**
 * GET - Obtener estado del deploy
 */
export async function GET() {
  try {
    const agent = getDeployAgent()
    const status = agent.getStatus()
    
    return NextResponse.json({ status })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

