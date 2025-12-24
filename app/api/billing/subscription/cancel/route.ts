import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"


export const dynamic = 'force-dynamic'
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { organizationId } = await request.json()

        if (!organizationId) {
            return NextResponse.json(
                { error: "Organization ID is required" },
                { status: 400 }
            )
        }

        // Verify user is owner/admin
        const member = await prisma.organizationMember.findFirst({
            where: {
                organizationId,
                userId: session.user.id,
                role: { in: ["owner", "admin"] },
            },
        })

        if (!member) {
            return NextResponse.json(
                { error: "Unauthorized to manage this organization" },
                { status: 403 }
            )
        }

        // Update subscription status to canceled
        const subscription = await prisma.subscription.update({
            where: { organizationId },
            data: {
                status: "canceled",
            },
        })

        return NextResponse.json({
            message: "Subscription canceled successfully",
            status: subscription.status,
        })
    } catch (error: any) {
        console.error("Subscription cancellation error:", error)
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        )
    }
}
