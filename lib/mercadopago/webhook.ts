// lib/mercadopago/webhook.ts

import crypto from "crypto";

/**
 * Verify Mercado Pago webhook signature.
 * Mercado Pago sends a `x-signature` header that is an HMAC SHA256 of the raw request body
 * using the webhook secret configured in Mercado Pago dashboard.
 *
 * @param rawBody - The raw request body as a string (not parsed JSON).
 * @param signatureHeader - The value of the `x-signature` header.
 * @param secret - Your webhook secret (store in env variable `MERCADO_PAGO_WEBHOOK_SECRET`).
 * @returns boolean indicating whether the signature is valid.
 */
export function verifyMercadoPagoSignature(
    rawBody: string,
    signatureHeader: string | undefined,
    secret: string
): boolean {
    if (!signatureHeader) return false;
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(rawBody, "utf8");
    const expectedSignature = hmac.digest("hex");
    return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "hex"),
        Buffer.from(signatureHeader, "hex")
    );
}
