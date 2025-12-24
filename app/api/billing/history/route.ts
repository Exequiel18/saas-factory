import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"


export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const organizationId = searchParams.get("organizationId")

        if (!organizationId) {
            return NextResponse.json(
                { error: "Organization ID is required" },
                { status: 400 }
            )
        }

        // Verify user is member
        const member = await prisma.organizationMember.findFirst({
            where: {
                organizationId,
                userId: session.user.id,
            },
        })

        if (!member) {
            return NextResponse.json(
                { error: "Unauthorized to access this organization's history" },
                { status: 403 }
            )
        }

        // Fetch payments and invoices
        const subscription = await prisma.subscription.findUnique({
            where: { organizationId },
            include: {
                payments: {
                    orderBy: { createdAt: "desc" },
                },
            },
        })

        const invoices = await prisma.invoice.findMany({
            where: { subscriptionId: subscription?.id },
            orderBy: { issuedAt: "desc" },
        })

        return NextResponse.json({
            payments: subscription?.payments || [],
            invoices: invoices || [],
        })
    } catch (error: any) {
        console.error("Payment history fetch error:", error)
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        )
    }
}
