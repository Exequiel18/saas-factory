/**
 * 🔧 API: Forzar verificación y solución
 */

import { getAutoHealingAgent } from '@/lib/auto-healing-agent'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const agent = getAutoHealingAgent()
    
    // Forzar verificación y solución
    await agent.checkAndFix()
    
    const status = agent.getStatus()

    return NextResponse.json({
      success: true,
      message: 'Verificación y solución completadas',
      status,
      timestamp: new Date().toISOString()
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

