/**
 * 🔧 API: Solucionar problemas automáticamente
 */

import { DeploymentMonitorAgent } from '@/lib/deployment-monitor-agent'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const monitor = new DeploymentMonitorAgent()
    
    // Primero verificar problemas
    await monitor.checkDeploymentStatus()
    
    // Intentar solucionar
    const result = await monitor.autoFix()
    const status = monitor.getStatus()

    return NextResponse.json({
      success: true,
      fixed: result.fixed,
      failed: result.failed,
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

