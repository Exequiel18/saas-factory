/**
 * 🔧 API: Estado del Auto-Healing Agent
 */

import { getAutoHealingAgent } from '@/lib/auto-healing-agent'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const agent = getAutoHealingAgent()
    const status = agent.getStatus()

    return NextResponse.json({
      success: true,
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

