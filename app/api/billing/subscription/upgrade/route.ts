// app/api/billing/subscription/upgrade/route.ts

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { organizationId, newPlanId, newAmount } = await request.json()

        if (!organizationId || !newPlanId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Verify member permissions
        const member = await prisma.organizationMember.findFirst({
            where: {
                organizationId,
                userId: session.user.id,
                role: { in: ["owner", "admin"] },
            },
        })

        if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

        // Update subscription to new plan
        const subscription = await prisma.subscription.update({
            where: { organizationId },
            data: {
                plan: newPlanId,
                amount: newAmount || 0,
                status: "active", // Reactivate if it was canceled
                updatedAt: new Date(),
            },
        })

        return NextResponse.json({
            message: "Subscription upgraded successfully",
            plan: subscription.plan,
        })
    } catch (error: any) {
        console.error("Upgrade error:", error)
        return NextResponse.json({ error: error.message || "Internal error" }, { status: 500 })
    }
}
