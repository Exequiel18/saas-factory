import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"


export const dynamic = 'force-dynamic'
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, memberId } = await context.params;

    const { role } = await request.json()

    if (!role || !["owner", "admin", "member"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      )
    }

    // Check if user is owner or admin
    const currentMember = await prisma.organizationMember.findFirst({
      where: {
        organizationId: id,
        userId: session.user?.id,
        role: { in: ["owner", "admin"] },
      },
    })

    if (!currentMember) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    // Prevent changing owner role unless current user is owner
    if (role === "owner" && currentMember.role !== "owner") {
      return NextResponse.json(
        { error: "Only owners can assign owner role" },
        { status: 403 }
      )
    }

    const updatedMember = await prisma.organizationMember.update({
      where: { id: memberId },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(updatedMember)
  } catch (error) {
    console.error("Member update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, memberId } = await context.params;

    // Check if user is owner or admin
    const currentMember = await prisma.organizationMember.findFirst({
      where: {
        organizationId: id,
        userId: session.user?.id,
        role: { in: ["owner", "admin"] },
      },
    })

    if (!currentMember) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    // Prevent deleting yourself
    const memberToDelete = await prisma.organizationMember.findUnique({
      where: { id: memberId },
    })

    if (memberToDelete?.userId === session.user?.id) {
      return NextResponse.json(
        { error: "Cannot remove yourself" },
        { status: 400 }
      )
    }

    await prisma.organizationMember.delete({
      where: { id: memberId },
    })

    return NextResponse.json({ message: "Member removed" })
  } catch (error) {
    console.error("Member delete error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}






