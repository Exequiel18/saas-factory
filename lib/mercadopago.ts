export interface MercadoPagoPreference {
    items: Array<{
        title: string
        quantity: number
        unit_price: number
        currency_id: string
        description?: string
    }>
    back_urls?: {
        success: string
        failure: string
        pending: string
    }
    auto_return?: "approved" | "all"
}

export async function createMercadoPagoPreference(data: MercadoPagoPreference) {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

    if (!accessToken) {
        throw new Error("MERCADOPAGO_ACCESS_TOKEN is not defined. Cannot create real preference.");
    }

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(JSON.stringify(error))
    }

    return response.json()
}

export async function createMercadoPagoSubscription(
    organizationId: string,
    planId: string,
    planName: string,
    amount: number,
    email: string,
    orgName: string
) {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

    if (!accessToken) {
        throw new Error("MERCADOPAGO_ACCESS_TOKEN is not defined. Subscription impossible.");
    }

    const protocol = process.env.NEXT_PUBLIC_VERCEL_URL ? "https" : "http"
    const host = process.env.NEXT_PUBLIC_VERCEL_URL || "localhost:3000"
    const baseUrl = host.startsWith("http") ? host : `${protocol}://${host}`

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            items: [
                {
                    title: `Plan ${planName} - ${orgName}`,
                    quantity: 1,
                    unit_price: amount,
                    currency_id: "ARS",
                },
            ],
            back_urls: {
                success: `${baseUrl}/dashboard?status=success`,
                failure: `${baseUrl}/dashboard?status=failure`,
                pending: `${baseUrl}/dashboard?status=pending`,
            },
            auto_return: "approved",
            external_reference: organizationId,
            metadata: {
                organizationId,
                planId,
            },
        }),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(JSON.stringify(error))
    }

    return response.json()
}

export async function getMercadoPagoPayment(paymentId: string) {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

    if (!accessToken) {
        throw new Error("MERCADOPAGO_ACCESS_TOKEN is not defined.");
    }

    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(JSON.stringify(error))
    }

    return response.json()
}
