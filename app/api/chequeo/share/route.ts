import { NextResponse } from "next/server"

/**
 * Endpoint para trackear shares del chequeo
 * No requiere autenticación - funciona con email o session ID
 */

export async function POST(request: Request) {
  try {
    const { email, diagnosticId, shareMethod } = await request.json()

    // En producción, guardarías esto en la base de datos para tracking
    // Por ahora solo logueamos

    console.log(`Chequeo compartido: ${email || 'anonymous'}, método: ${shareMethod || 'unknown'}`)

    return NextResponse.json({
      success: true,
      message: "Share registrado",
    })
  } catch (error) {
    console.error("Share tracking error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

