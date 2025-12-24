import { NextResponse } from "next/server"
import { globalEmailNotificationSystem } from "@/lib/email-notifications"
import { getErrorMessage } from "@/lib/utils"

/**
 * 📧 Endpoint para enviar emails críticos
 * 
 * Reglas:
 * - Solo score < 40
 * - Máximo 1 por semana
 * - Se puede llamar desde cron
 */

export const dynamic = 'force-dynamic'
export async function POST(request: Request) {
  try {
    // Verificar autorización (opcional: agregar API key)
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.EMAIL_API_KEY || "default-secret"}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Procesar todas las alertas críticas
    const result = await globalEmailNotificationSystem.processAllCriticalAlerts()

    return NextResponse.json({
      success: true,
      emailsSent: result.sent,
      emailsSkipped: result.skipped,
      message: `Enviados ${result.sent} emails críticos, ${result.skipped} omitidos (score >= 40 o ya enviados esta semana)`
    })
  } catch (error: unknown) {
    console.error("Email notification error:", error)
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
    message: "Email notifications endpoint. Use POST to send critical alerts.",
    rules: {
      onlyScoreBelow40: true,
      maxOnePerWeek: true
    }
  })
}






