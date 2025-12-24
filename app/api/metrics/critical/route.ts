import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { globalCriticalMetricsCollector } from "@/lib/critical-metrics"
import { getErrorMessage } from "@/lib/utils"

/**
 * 📊 Endpoint para métricas críticas
 * 
 * Mide:
 * - % de usuarios que vuelven sin email
 * - % de score < 40 que ve upsell
 * - % de score < 40 que convierte
 * - Tiempo promedio para subir de RIESGO a ATENCIÓN
 * - Cuántos abandonan con score alto
 */

export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const headers = new Headers(request.headers)
    const empireSecret = headers.get("x-empire-secret")
    const isEmpireMonitor = empireSecret === process.env.EMPIRE_SECRET

    // Solo admin/owner (o el monitor autónomo) puede ver métricas críticas
    if (!session && !isEmpireMonitor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    // Por ahora permitir a todos, en producción agregar verificación de rol

    const metrics = await globalCriticalMetricsCollector.collectMetrics()

    return NextResponse.json({
      success: true,
      metrics,
      collectedAt: new Date().toISOString()
    })
  } catch (error: unknown) {
    console.error("Critical metrics error:", error)
    return NextResponse.json(
      { error: getErrorMessage(error) || "Internal server error" },
      { status: 500 }
    )
  }
}






