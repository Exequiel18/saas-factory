/**
 * 🔍 API: Verificar estado de deployment
 */

import { DeploymentMonitorAgent } from '@/lib/deployment-monitor-agent'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const monitor = new DeploymentMonitorAgent()
    const issues = await monitor.checkDeploymentStatus()
    const status = monitor.getStatus()

    return NextResponse.json({
      success: true,
      status,
      issues,
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

