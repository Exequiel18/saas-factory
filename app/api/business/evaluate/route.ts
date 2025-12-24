import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { globalBusinessEvaluator } from "@/lib/business-evaluator"
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
      return NextResponse.json(
        { error: "organizationId is required" },
        { status: 400 }
      )
    }

    // Verificar que el usuario tiene acceso a esta organización
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

    // Evaluar negocio
    const evaluation = await globalBusinessEvaluator.evaluate(organizationId)

    return NextResponse.json(evaluation)
  } catch (error: unknown) {
    console.error("Business evaluation error:", error)
    return NextResponse.json(
      { error: getErrorMessage(error) || "Internal server error" },
      { status: 500 }
    )
  }
}






