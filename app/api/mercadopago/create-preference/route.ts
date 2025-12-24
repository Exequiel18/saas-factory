import { NextResponse } from "next/server"
import { createMercadoPagoPreference } from "@/lib/mercadopago"
import { getErrorMessage } from "@/lib/utils"


export const dynamic = 'force-dynamic'
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { product, price, title, amount, description } = body

        // Soporta ambos formatos: el nuevo (title, amount) y el viejo (product, price)
        const finalTitle = title || product || "Chequeo Real de Negocio - Diagnóstico Completo"
        const finalAmount = amount || price || 3000
        const finalDescription = description || "Diagnóstico completo con análisis detallado y plan de acción"

        const protocol = request.headers.get("x-forwarded-proto") || "http"
        const host = request.headers.get("host")
        const baseUrl = `${protocol}://${host}`

        const preference = await createMercadoPagoPreference({
            items: [
                {
                    title: finalTitle,
                    description: finalDescription,
                    quantity: 1,
                    unit_price: finalAmount,
                    currency_id: "ARS",
                },
            ],
            back_urls: {
                success: `${baseUrl}/chequeo-real?status=success`,
                failure: `${baseUrl}/chequeo-real?status=failure`,
                pending: `${baseUrl}/chequeo-real?status=pending`,
            },
            auto_return: "approved",
        })

        return NextResponse.json({
            url: preference.init_point,
            preferenceId: preference.id,
        })
    } catch (error: unknown) {
        console.error("Mercado Pago preference error:", error)
        return NextResponse.json(
            { error: getErrorMessage(error) || "Internal server error" },
            { status: 500 }
        )
    }
}
