import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { globalAlertSystem } from "@/lib/alert-system"
import { getErrorMessage } from "@/lib/utils"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Obtener alertas no leídas para el usuario
    const alerts = await globalAlertSystem.getUnreadAlerts(session.user.id)

    return NextResponse.json({
      alerts: alerts.map(a => ({
        id: a.id,
        type: a.type,
        priority: a.priority,
        title: a.title,
        message: a.message,
        action: a.action,
        read: a.read,
        createdAt: a.createdAt
      }))
    })
  } catch (error: unknown) {
    console.error("Get alerts error:", error)
    return NextResponse.json(
      { error: getErrorMessage(error) || "Internal server error" },
      { status: 500 }
    )
  }
}






