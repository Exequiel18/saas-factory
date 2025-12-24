// lib/billing/email.ts

import sgMail from "@sendgrid/mail";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

/**
 * Send an invoice email with PDF attachment.
 * Uses SendGrid if SENDGRID_API_KEY env var is present, otherwise falls back to nodemailer.
 */
export async function sendInvoiceEmail(to: string, invoice: { number: string; pdfUrl: string; totalAmount: number; currency: string }) {
    const from = process.env.EMAIL_FROM || "no-reply@antigravity.com";
    const subject = `Factura ${invoice.number} - Antigravity`;
    const text = `Hola,\n\nAdjuntamos tu factura ${invoice.number} por ${invoice.totalAmount.toFixed(2)} ${invoice.currency}.\n\nGracias por confiar en Antigravity.`;

    // Resolve absolute path of the PDF file (public/invoices/...)
    const pdfPath = path.resolve(process.cwd(), "public", invoice.pdfUrl.replace(/^\/+/g, ""));
    const pdfExists = fs.existsSync(pdfPath);

    // Prepare attachment if file exists
    const attachments = pdfExists
        ? [{ content: fs.readFileSync(pdfPath).toString("base64"), filename: path.basename(pdfPath), type: "application/pdf", disposition: "attachment" }]
        : [];

    // Try SendGrid first
    const sendgridKey = process.env.SENDGRID_API_KEY;
    if (sendgridKey) {
        sgMail.setApiKey(sendgridKey);
        const msg: any = {
            to,
            from,
            subject,
            text,
            attachments,
        };
        await sgMail.send(msg);
        return;
    }

    // Fallback to nodemailer (SMTP config via env vars)
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    await transporter.sendMail({
        from,
        to,
        subject,
        text,
        attachments,
    });
}
