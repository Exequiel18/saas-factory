import { NextResponse } from "next/server"
import { getCentralAgent } from "@/lib/central-command-agent"

/**
 * Endpoint para obtener eventos en tiempo real
 * Soporta polling para actualización continua
 */

export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const since = searchParams.get('since') // Timestamp del último evento
    
    const agent = getCentralAgent()
    let events = agent.getRecentEvents(limit)
    
    // Si hay 'since', filtrar eventos más recientes
    if (since) {
      const sinceDate = new Date(since)
      events = events.filter(e => e.timestamp > sinceDate)
    }
    
    return NextResponse.json({
      events,
      count: events.length,
      timestamp: new Date()
    })
  } catch (error) {
    console.error("Error getting events:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * Endpoint para registrar eventos manualmente
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { system, type, message, data } = body
    
    const agent = getCentralAgent()
    const event = agent.recordEvent({
      system: system || 'unknown',
      type: type || 'info',
      message: message || 'Evento sin mensaje',
      data
    })
    
    return NextResponse.json({
      success: true,
      event,
      timestamp: new Date()
    })
  } catch (error) {
    console.error("Error recording event:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

