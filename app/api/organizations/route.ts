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

    const { name } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: "Organization name is required" },
        { status: 400 }
      )
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const existingOrg = await prisma.organization.findUnique({
      where: { slug },
    })

    if (existingOrg) {
      return NextResponse.json(
        { error: "Organization with this name already exists" },
        { status: 400 }
      )
    }

    const organization = await prisma.organization.create({
      data: {
        name,
        slug,
        members: {
          create: {
            userId: session.user.id,
            role: "owner",
          },
        },
        subscriptions: {
          create: {
            plan: "free",
            status: "active",
          },
        },
      },
      include: {
        members: true,
      },
    })

    return NextResponse.json(organization, { status: 201 })
  } catch (error) {
    console.error("Organization creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const organizations = await prisma.organizationMember.findMany({
      where: { userId: session.user.id },
      include: {
        organization: {
          include: {
            subscriptions: true,
          },
        },
      },
    })

    return NextResponse.json(organizations)
  } catch (error) {
    console.error("Organizations fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

