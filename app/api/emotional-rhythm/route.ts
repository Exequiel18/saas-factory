import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { globalEmotionalRhythmController } from "@/lib/emotional-rhythm"
import { getErrorMessage } from "@/lib/utils"

/**
 * 🎭 Endpoint para controlar ritmo emocional
 * 
 * Regla: Nunca más de 1 estímulo fuerte por sesión
 */

export const dynamic = 'force-dynamic'
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { score, previousScore, status, hasSeenUpsellThisSession } = await request.json()

    // Crear evaluación temporal para el controlador
    const evaluation = {
      score,
      status,
      alert: "",
      action: "",
      trend: "estable" as const,
      comparison: "",
      lastEvaluated: new Date()
    }

    // Controlar ritmo emocional
    const state = globalEmotionalRhythmController.controlRhythm(
      evaluation,
      previousScore,
      hasSeenUpsellThisSession
    )

    return NextResponse.json({
      success: true,
      state
    })
  } catch (error: unknown) {
    console.error("Emotional rhythm error:", error)
    return NextResponse.json(
      { error: getErrorMessage(error) || "Internal server error" },
      { status: 500 }
    )
  }
}






