import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { globalActionTracker } from "@/lib/action-tracker"
import { getErrorMessage } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { actionId, organizationId } = await request.json()

    if (!actionId || !organizationId) {
      return NextResponse.json(
        { error: "actionId and organizationId are required" },
        { status: 400 }
      )
    }

    // Verificar que el usuario tiene acceso a esta organización
    const { prisma } = await import("@/lib/prisma")
    const member = await prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId: session.user.id
      }
    })

    if (!member) {
      return NextResponse.json(
        { error: "Unauthorized to access this organization" },
        { status: 403 }
      )
    }

    // Completar acción
    const result = await globalActionTracker.completeAction(actionId, organizationId)

    return NextResponse.json(result)
  } catch (error: unknown) {
    console.error("Complete action error:", error)
    return NextResponse.json(
      { error: getErrorMessage(error) || "Internal server error" },
      { status: 500 }
    )
  }
}






