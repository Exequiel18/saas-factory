import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { globalUserClassifier } from "@/lib/user-classifier"
import { getErrorMessage } from "@/lib/utils"

/**
 * 👥 Endpoint para clasificar usuario (en sombra)
 * 
 * No exponer al usuario. Solo loguear.
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { organizationId } = await request.json()

    if (!organizationId) {
      return NextResponse.json(
        { error: "organizationId is required" },
        { status: 400 }
      )
    }

    // Clasificar usuario en sombra (sin exponer)
    const classification = await globalUserClassifier.classifyUser(
      session.user.id,
      organizationId
    )

    // Retornar éxito pero no exponer clasificación al usuario
    return NextResponse.json({
      success: true
      // No retornar classification al usuario
    })
  } catch (error: unknown) {
    console.error("User classification error:", error)
    // No retornar error al usuario, solo loggear
    return NextResponse.json({ success: false })
  }
}






