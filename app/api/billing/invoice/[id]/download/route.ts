import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import fs from "fs"
import path from "path"

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

        // Fetch invoice and verify access through organization membership
        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: {
                subscription: {
                    include: {
                        organization: {
                            include: {
                                members: true,
                            },
                        },
                    },
                },
            },
        })

        if (!invoice || !invoice.subscription) {
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
        }

        const isMember = invoice.subscription.organization.members.some(
            (m) => m.userId === session.user.id
        )

        if (!isMember) {
            return NextResponse.json(
                { error: "Unauthorized to access this invoice" },
                { status: 403 }
            )
        }

        if (!invoice.pdfUrl) {
            return NextResponse.json(
                { error: "Invoice PDF not available" },
                { status: 404 }
            )
        }

        // Resolve absolute path
        const pdfPath = path.resolve(process.cwd(), "public", invoice.pdfUrl.replace(/^\/+/g, ""))

        if (!fs.existsSync(pdfPath)) {
            return NextResponse.json(
                { error: "Invoice file not found on server" },
                { status: 404 }
            )
        }

        const fileBuffer = fs.readFileSync(pdfPath)

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${invoice.number}.pdf"`,
            },
        })
    } catch (error: any) {
        console.error("Invoice download error:", error)
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        )
    }
}
