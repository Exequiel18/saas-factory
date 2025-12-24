// lib/monitoring.ts

import { prisma } from "@/lib/prisma"

export type BillingEvent = {
    type: "payment_success" | "payment_failed" | "subscription_canceled" | "invoice_generated" | "webhook_error" | "api_error"
    amount?: number
    currency?: string
    organizationId?: string
    metadata?: any
}

/**
 * Log a billing event to the database and potentially external monitoring services.
 */
export async function logBillingEvent(event: BillingEvent) {
    try {
        // Log to SystemLog if appropriate
        await prisma.systemLog.create({
            data: {
                source: "billing_system",
                level: event.type.includes("error") ? "error" : "success",
                message: `Billing Event: ${event.type}`,
                metadata: JSON.stringify({
                    organizationId: event.organizationId,
                    amount: event.amount,
                    currency: event.currency,
                    ...event.metadata,
                }),
            },
        })

        // If it's a critical error, we could send an alert to a webhook (Slack/Discord)
        if (event.type.includes("error") || event.type === "payment_failed") {
            const webhookUrl = process.env.OUTBOUND_WEBHOOK_URL
            if (webhookUrl) {
                await fetch(webhookUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        text: `🚨 *BILLING ALERT*: ${event.type.toUpperCase()}\nOrg: ${event.organizationId || "N/A"}\nDetails: ${JSON.stringify(event.metadata)}`,
                    }),
                })
            }
        }

        // In a real production app, you might also push to Prometheus/Grafana or Sentry here.
        console.log(`[Billing Monitor] ${event.type} logged.`);
    } catch (error) {
        console.error("Failed to log billing event:", error);
    }
}
