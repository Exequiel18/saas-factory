// lib/billing/invoice.ts

import { prisma } from "@/lib/prisma";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

/**
 * Generate a simple PDF invoice for a given subscription.
 * This is a minimal implementation – you can extend it with your branding.
 */
export async function generateInvoice(subscriptionId: string) {
    // Fetch subscription and related organization/user data
    const subscription = await prisma.subscription.findUnique({
        where: { id: subscriptionId },
        include: { organization: true },
    });

    if (!subscription) {
        throw new Error("Subscription not found");
    }

    const orgName = subscription.organization?.name ?? "Organization";
    const amount = subscription.amount ?? 0;
    const currency = subscription.currency ?? "USD";
    const taxAmount = subscription.taxAmount ?? 0;
    const totalAmount = amount + taxAmount;

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const normalFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const drawText = (text: string, x: number, y: number, size = 12, fontObj = normalFont) => {
        page.drawText(text, { x, y, size, font: fontObj, color: rgb(0, 0, 0) });
    };

    // Header
    drawText("Factura", 50, height - 50, 24, font);
    drawText(`Número: ${uuidv4().split("-")[0].toUpperCase()}`, 50, height - 80);
    drawText(`Fecha: ${new Date().toLocaleDateString()}`, 50, height - 100);

    // Recipient
    drawText(`Facturar a: ${orgName}`, 50, height - 140);

    // Amounts
    drawText(`Importe: ${amount.toFixed(2)} ${currency}`, 50, height - 180);
    drawText(`Impuestos: ${taxAmount.toFixed(2)} ${currency}`, 50, height - 200);
    drawText(`Total: ${totalAmount.toFixed(2)} ${currency}`, 50, height - 220, 14, font);

    // Footer
    drawText("Gracias por confiar en Antigravity.", 50, 50, 10);

    const pdfBytes = await pdfDoc.save();

    // Save PDF to a temporary folder (you may replace this with cloud storage)
    const invoicesDir = path.resolve(process.cwd(), "public", "invoices");
    if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
    }
    const fileName = `invoice-${subscriptionId}-${Date.now()}.pdf`;
    const filePath = path.join(invoicesDir, fileName);
    fs.writeFileSync(filePath, pdfBytes);

    // Return data that will be stored in the Invoice model
    return {
        number: fileName.replace('.pdf', ''),
        totalAmount,
        taxAmount,
        currency,
        pdfUrl: `/invoices/${fileName}`,
    };
}
