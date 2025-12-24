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

    // Verificar si Mercado Pago está configurado
    const hasAccessToken = !!process.env.MERCADOPAGO_ACCESS_TOKEN
    const hasPublicKey = !!process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
    const alias = process.env.MERCADOPAGO_ALIAS || "aliascomun.mp"

    // Obtener estadísticas de pagos con Mercado Pago
    const mercadoPagoPayments = await prisma.payment.count({
      where: {
        paymentMethod: "mercado_pago",
        status: "approved",
      },
    })

    const totalMercadoPagoRevenue = await prisma.payment.aggregate({
      where: {
        paymentMethod: "mercado_pago",
        status: "approved",
      },
      _sum: {
        amount: true,
      },
    })

    return NextResponse.json({
      configured: hasAccessToken && hasPublicKey,
      alias,
      hasAccessToken,
      hasPublicKey,
      stats: {
        totalPayments: mercadoPagoPayments,
        totalRevenue: totalMercadoPagoRevenue._sum.amount || 0,
      },
      message: hasAccessToken && hasPublicKey
        ? "Mercado Pago está configurado correctamente"
        : "Configura MERCADOPAGO_ACCESS_TOKEN y NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY en .env",
    })
  } catch (error: any) {
    console.error("Mercado Pago status error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}






