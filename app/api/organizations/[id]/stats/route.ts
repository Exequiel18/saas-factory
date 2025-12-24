import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"


export const dynamic = 'force-dynamic'
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params;

    // Verificar que el usuario es miembro
    const member = await prisma.organizationMember.findFirst({
      where: {
        organizationId: id,
        userId: session.user.id,
      },
    })

    if (!member) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    // Obtener estadísticas de la organización
    const [subscription, payments, members] = await Promise.all([
      prisma.subscription.findUnique({
        where: { organizationId: id },
      }),
      prisma.payment.findMany({
        where: {
          subscription: { organizationId: id },
          status: "approved",
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.organizationMember.count({
        where: { organizationId: id },
      }),
    ])

    const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0)

    return NextResponse.json({
      subscription: {
        plan: subscription?.plan || "free",
        status: subscription?.status || "inactive",
        amount: subscription?.amount || 0,
      },
      members: {
        total: members,
      },
      payments: {
        total: payments.length,
        totalSpent,
        recent: payments,
      },
    })
  } catch (error) {
    console.error("Organization stats error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}






