import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getBusinessMetrics } from "@/lib/metrics"
import { prisma } from "@/lib/prisma"
import { getErrorMessage } from "@/lib/utils"

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const organizationId = searchParams.get("organizationId")

        if (!organizationId) {
            // Intentar obtener la primera organización del usuario
            const member = await prisma.organizationMember.findFirst({
                where: { userId: session.user.id },
                select: { organizationId: true }
            })

            if (!member) {
                return NextResponse.json({ error: "No organization found" }, { status: 404 })
            }

            // Recursion simple o redirect no es ideal en API json, mejor devolver data de esa org
            return getDataForOrg(member.organizationId)
        }

        return getDataForOrg(organizationId)

    } catch (error: unknown) {
        console.error("Metrics API Error:", error)
        return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
    }
}

async function getDataForOrg(organizationId: string) {
    const metrics = await getBusinessMetrics(organizationId)
    return NextResponse.json({ metrics })
}
