import { NextResponse } from "next/server"
import { AutonomousMarketingSystem } from "@/lib/autonomous-marketing"

/**
 * Endpoint que genera el plan semanal automático
 * El sistema decide qué, cuándo y dónde postear
 */

export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const system = new AutonomousMarketingSystem()
    const plan = system.generateWeeklyPlan()
    const recommendations = system.getRecommendations()
    const analysis = system.analyzePerformance()
    
    // Registrar evento en Command Center
    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/central-command/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: 'marketing',
          type: 'action',
          message: `Plan semanal generado: ${plan.length} acciones programadas`,
          data: { 
            actionsCount: plan.length,
            recommendationsCount: recommendations.length
          }
        })
      })
    } catch (error) {
      console.error("Error recording marketing event:", error)
    }
    
    return NextResponse.json({
      plan,
      recommendations,
      analysis,
      message: "Plan semanal generado automáticamente"
    })
  } catch (error) {
    console.error("Error generating marketing plan:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * Registra performance de una acción
 */
export async function POST(request: Request) {
  try {
    const { actionId, clicks, conversions, shares } = await request.json()
    
    const system = new AutonomousMarketingSystem()
    system.recordPerformance({
      actionId,
      clicks: clicks || 0,
      conversions: conversions || 0,
      shares: shares || 0,
      timestamp: new Date()
    })
    
    return NextResponse.json({
      success: true,
      message: "Performance registrada"
    })
  } catch (error) {
    console.error("Error recording performance:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

