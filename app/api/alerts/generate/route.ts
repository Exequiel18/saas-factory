import { NextResponse } from "next/server"
import { globalAlertSystem } from "@/lib/alert-system"
import { getErrorMessage } from "@/lib/utils"

/**
 * 🔔 Endpoint para generar alertas automáticamente
 * 
 * Se puede llamar desde:
 * - Cron job (Vercel Cron)
 * - Scheduled task
 * - Manualmente para testing
 */

export const dynamic = 'force-dynamic'
export async function POST(request: Request) {
  try {
    // Verificar autorización (opcional: agregar API key)
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.ALERT_API_KEY || "default-secret"}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Generar alertas para todas las organizaciones activas
    const alerts = await globalAlertSystem.generateAlertsForActiveOrganizations()

    return NextResponse.json({
      success: true,
      alertsGenerated: alerts.length,
      alerts: alerts.map(a => ({
        id: a.id,
        organizationId: a.organizationId,
        type: a.type,
        priority: a.priority,
        title: a.title
      }))
    })
  } catch (error: unknown) {
    console.error("Alert generation error:", error)
    return NextResponse.json(
      { error: getErrorMessage(error) || "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * GET para verificar que el endpoint funciona
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Alert generation endpoint. Use POST to generate alerts."
  })
}






