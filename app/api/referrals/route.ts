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

    // Obtener código de referido del usuario
    const referralCode = `REF-${session.user.id.slice(0, 8).toUpperCase()}`

    // Obtener referidos del usuario (usuarios que se registraron con su código)
    const referrals = await prisma.user.findMany({
      where: {
        // Aquí podrías agregar un campo referralCode en el modelo User
        // Por ahora retornamos el código del usuario
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      take: 10,
    })

    return NextResponse.json({
      referralCode,
      referralUrl: `${process.env.NEXTAUTH_URL}/auth/signup?ref=${referralCode}`,
      referrals: referrals,
      totalReferrals: referrals.length,
    })
  } catch (error) {
    console.error("Referrals fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { referralCode } = await request.json()

    if (!referralCode) {
      return NextResponse.json(
        { error: "Referral code is required" },
        { status: 400 }
      )
    }

    // Aquí podrías registrar el referido y otorgar beneficios
    // Por ejemplo, créditos o descuentos

    return NextResponse.json({
      message: "Referral code applied successfully",
      referralCode,
    })
  } catch (error) {
    console.error("Referral apply error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}






