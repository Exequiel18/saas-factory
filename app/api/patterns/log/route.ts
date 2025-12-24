import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { globalPatternLogger } from "@/lib/pattern-logger"
import { getErrorMessage } from "@/lib/utils"

/**
 * 📊 Endpoint para loggear patrones (fase 2 en sombra)
 * 
 * Sin exponer al usuario, solo logging interno
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type, organizationId, ...metadata } = await request.json()

    if (!type || !organizationId) {
      return NextResponse.json(
        { error: "type and organizationId are required" },
        { status: 400 }
      )
    }

    // Loggear patrón según tipo
    switch (type) {
      case "alert_view":
        await globalPatternLogger.logAlertView(
          organizationId,
          session.user.id,
          {
            score: metadata.score || 0,
            status: metadata.status || "OK",
            alert: metadata.alert || "",
            action: metadata.action || "",
            trend: "estable",
            comparison: "",
            lastEvaluated: new Date()
          }
        )
        break

      case "upsell_shown":
        await globalPatternLogger.logUpsellShown(
          organizationId,
          session.user.id,
          metadata.score || 0,
          metadata.angle || "risk"
        )
        break

      default:
        // Loggear genérico
        await globalPatternLogger.logPattern({
          type: type as any,
          organizationId,
          userId: session.user.id,
          metadata,
          timestamp: new Date()
        })
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error("Pattern logging error:", error)
    // No retornar error al usuario, solo loggear
    return NextResponse.json({ success: false })
  }
}






