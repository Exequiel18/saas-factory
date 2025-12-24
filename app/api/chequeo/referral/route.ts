import { NextResponse } from "next/server"

/**
 * Sistema de referidos para el chequeo
 * Funciona sin registro - solo con email o link único
 */

export async function POST(request: Request) {
  try {
    const { email, referralCode, diagnosticId } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Generar link único de referido
    const referralLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/chequeo-real?ref=${referralCode || 'direct'}`

    // En producción, guardarías esto en la base de datos
    // Por ahora solo retornamos el link

    return NextResponse.json({
      referralLink,
      message: "Link de referido generado",
      credit: 500, // $500 de crédito cuando el referido pague
    })
  } catch (error) {
    console.error("Referral generation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

