import { NextResponse } from "next/server"
import { getCentralAgent } from "@/lib/central-command-agent"

/**
 * Endpoint que devuelve el estado de todos los sistemas en tiempo real
 */
export async function GET() {
  try {
    const agent = getCentralAgent()
    const systems = await agent.getSystemStatus()
    const stats = await agent.getOverallStats()
    const events = agent.getRecentEvents(20)
    
    return NextResponse.json({
      systems,
      stats,
      events,
      timestamp: new Date()
    })
  } catch (error) {
    console.error("Error getting system status:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

