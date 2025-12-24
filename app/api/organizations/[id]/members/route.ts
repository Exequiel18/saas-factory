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

    // Check if user is a member
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

    const members = await prisma.organizationMember.findMany({
      where: { organizationId: id },
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
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(members)
  } catch (error) {
    console.error("Members fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params;

    const { email, role = "member" } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Check if user is owner or admin
    const currentMember = await prisma.organizationMember.findFirst({
      where: {
        organizationId: id,
        userId: session.user.id,
        role: { in: ["owner", "admin"] },
      },
    })

    if (!currentMember) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check if user is already a member
    const existingMember = await prisma.organizationMember.findFirst({
      where: {
        organizationId: id,
        userId: user.id,
      },
    })

    if (existingMember) {
      return NextResponse.json(
        { error: "User is already a member" },
        { status: 400 }
      )
    }

    const newMember = await prisma.organizationMember.create({
      data: {
        organizationId: id,
        userId: user.id,
        role: role === "owner" ? "member" : role, // Prevent creating owners via API
      },
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

    return NextResponse.json(newMember, { status: 201 })
  } catch (error) {
    console.error("Member add error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}






