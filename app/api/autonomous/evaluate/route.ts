import { NextResponse } from "next/server"
import { globalAutonomousCreator } from "@/lib/autonomous-creator"
import { globalCoreProtection } from "@/lib/core-protection"
import { getErrorMessage } from "@/lib/utils"

/**
 * 🧠 Endpoint para evaluar creaciones autónomas
 * 
 * Evalúa experimentos activos y decide:
 * - Promover a core (si mejora ingresos/retención)
 * - Archivar (si no tiene impacto)
 * - Pausar (si rompe core loop)
 */
export async function POST(request: Request) {
  try {
    // Verificar integridad del core primero
    const coreIntegrity = await globalCoreProtection.verifyCoreIntegrity()
    
    if (!coreIntegrity.healthy) {
      return NextResponse.json({
        success: false,
        error: "Core integrity check failed",
        issues: coreIntegrity.issues
      }, { status: 500 })
    }

    // Evaluar creaciones autónomas
    const evaluation = await globalAutonomousCreator.evaluateCreations()

    return NextResponse.json({
      success: true,
      coreHealthy: true,
      evaluation,
      message: "Autonomous creations evaluated successfully"
    })
  } catch (error: unknown) {
    console.error("Autonomous evaluation error:", error)
    return NextResponse.json(
      { error: getErrorMessage(error) || "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * GET para verificar estado
 */
export async function GET() {
  const coreIntegrity = await globalCoreProtection.verifyCoreIntegrity()
  
  return NextResponse.json({
    status: "ok",
    coreHealthy: coreIntegrity.healthy,
    message: "Autonomous creator system operational"
  })
}






