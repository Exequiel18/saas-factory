import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Obtener notificaciones del usuario
    // Por ahora retornamos notificaciones básicas
    // En producción, crearías un modelo Notification

    const notifications = [
      {
        id: "1",
        type: "payment_success",
        title: "Pago Aprobado",
        message: "Tu suscripción Pro ha sido activada",
        read: false,
        createdAt: new Date(),
      },
      {
        id: "2",
        type: "referral",
        title: "Nuevo Referido",
        message: "Has ganado $10 de crédito por un nuevo referido",
        read: false,
        createdAt: new Date(),
      },
    ]

    return NextResponse.json(notifications)
  } catch (error) {
    console.error("Notifications fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}






