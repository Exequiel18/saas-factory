import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Estadísticas generales del sistema
    const [
      totalUsers,
      totalOrganizations,
      totalSubscriptions,
      activeSubscriptions,
      totalPayments,
      totalRevenue,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.organization.count(),
      prisma.subscription.count(),
      prisma.subscription.count({ where: { status: "active" } }),
      prisma.payment.count({ where: { status: "approved" } }),
      prisma.payment.aggregate({
        where: { status: "approved" },
        _sum: { amount: true },
      }),
    ])

    return NextResponse.json({
      users: totalUsers,
      organizations: totalOrganizations,
      subscriptions: {
        total: totalSubscriptions,
        active: activeSubscriptions,
      },
      payments: {
        total: totalPayments,
        revenue: totalRevenue._sum.amount || 0,
      },
      goal: {
        target: 20000,
        current: totalRevenue._sum.amount || 0,
        percentage: ((totalRevenue._sum.amount || 0) / 20000) * 100,
      },
    })
  } catch (error: any) {
    console.error("Stats error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}






