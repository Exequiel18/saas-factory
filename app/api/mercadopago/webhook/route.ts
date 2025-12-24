// app/api/mercadopago/webhook/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMercadoPagoSignature } from "@/lib/mercadopago/webhook";
import { generateInvoice } from "@/lib/billing/invoice";
import { sendInvoiceEmail } from "@/lib/billing/email";

/**
 * Mercado Pago webhook handler.
 * It expects the raw request body to verify the HMAC signature.
 * Supported events: payment.created, payment.refunded, subscription.created, subscription.updated, etc.
 */
export async function POST(request: Request) {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  if (!secret) {
    console.error("Mercado Pago webhook secret not configured");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  // Read raw body as text for signature verification
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!verifyMercadoPagoSignature(rawBody, signature, secret)) {
    console.warn("Invalid Mercado Pago webhook signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Parse JSON after verification
  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch (e) {
    console.error("Failed to parse webhook payload", e);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { type, data } = payload;

  // Handle only payment events for now
  if (type === "payment.created" || type === "payment.refunded") {
    const payment = data?.id ? data : null;
    if (!payment) {
      return NextResponse.json({ error: "Missing payment data" }, { status: 400 });
    }

    // Find the related subscription via the stored providerPaymentId
    const dbPayment = await prisma.payment.findFirst({
      where: { paymentProviderId: payment.id },
      include: { subscription: true },
    });

    if (!dbPayment || !dbPayment.subscription) {
      console.warn("Payment without linked subscription", payment.id);
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    // Update payment status
    await prisma.payment.update({
      where: { id: dbPayment.id },
      data: {
        status: type === "payment.created" ? "approved" : "refunded",
        metadata: JSON.stringify(payment),
      },
    });

    // Update subscription status accordingly
    const newStatus = type === "payment.created" ? "active" : "canceled";
    await prisma.subscription.update({
      where: { id: dbPayment.subscription.id },
      data: { status: newStatus },
    });

    // Registrar evento en Command Center
    if (type === "payment.created") {
      try {
        await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/central-command/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system: 'pagos',
            type: 'conversion',
            message: `Pago recibido: ${dbPayment.currency} ${dbPayment.amount}`,
            data: { 
              amount: dbPayment.amount, 
              currency: dbPayment.currency,
              paymentId: dbPayment.id,
              subscriptionId: dbPayment.subscription.id
            }
          })
        })
      } catch (error) {
        console.error("Error recording payment event:", error)
      }
    }

    // Generate invoice for successful payment
    if (type === "payment.created") {
      const invoice = await generateInvoice(dbPayment.subscription.id);
      // Store invoice record
      await prisma.invoice.create({
        data: {
          subscriptionId: dbPayment.subscription.id,
          number: invoice.number,
          issuedAt: new Date(),
          totalAmount: invoice.totalAmount,
          taxAmount: invoice.taxAmount,
          currency: invoice.currency,
          pdfUrl: invoice.pdfUrl,
        },
      });

      // Send email to the user (email stored in subscription's organization or user)
      const org = await prisma.organization.findUnique({
        where: { id: dbPayment.subscription.organizationId },
        include: { members: true },
      });
      const userEmail = org?.members[0]?.user?.email; // simplistic: first member's email
      if (userEmail) {
        await sendInvoiceEmail(userEmail, invoice);
      }
    }

    return NextResponse.json({ received: true });
  }

  // For other event types, simply acknowledge
  return NextResponse.json({ received: true });
}
