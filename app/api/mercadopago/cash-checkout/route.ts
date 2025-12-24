import { NextResponse } from "next/server"
import { createMercadoPagoPreference } from "@/lib/mercadopago"
import { prisma } from "@/lib/prisma"

/**
 * Universal Cash Checkout - $3.000 ARS
 * No login required. Tied to Lead ID.
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const leadId = searchParams.get("leadId")
        const nicheId = searchParams.get("nicheId") || "general"

        if (!leadId) {
            return NextResponse.json({ error: "Lead ID is required" }, { status: 400 })
        }

        // Verificar que el lead existe
        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
        })

        if (!lead) {
            return NextResponse.json({ error: "Lead not found" }, { status: 404 })
        }

        // Crear preferencia de pago único de $3.000 ARS
        const preference = await createMercadoPagoPreference({
            items: [
                {
                    title: `Antigravity Empire Access - ${nicheId}`,
                    unit_price: 3000,
                    quantity: 1,
                    currency_id: "ARS"
                }
            ],
            external_reference: leadId,
            metadata: {
                leadId: leadId,
                niche_id: nicheId,
                type: 'fast-cash'
            },
            back_urls: {
                success: `${process.env.NEXTAUTH_URL}/dashboard?checkout=success`,
                failure: `${process.env.NEXTAUTH_URL}/dashboard?checkout=failure`,
                pending: `${process.env.NEXTAUTH_URL}/dashboard?checkout=pending`
            },
            auto_return: "approved"
        });

        return NextResponse.redirect(preference.init_point)

    } catch (error: any) {
        console.error("Cash checkout error:", error)
        return NextResponse.json(
            { error: "Failed to create checkout" },
            { status: 500 }
        )
    }
}
