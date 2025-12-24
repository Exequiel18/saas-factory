const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { recordTransaction } = require('../lib/empire-ledger');
const { notifyOutbound } = require('./outbound-notifier');

/**
 * AGENTE EVALUADOR AUTÓNOMO - Antigravity Commerce Hub
 * Objetivo: Filtrar aplicantes con Lógica de Negocio Real (Deterministic Scoring).
 */

class BusinessScorer {
    static evaluate(applicant) {
        let score = 0;
        let reasons = [];

        // 1. Revenue Check (Real Money Focus)
        // Parse "$1.5M" or "$50k" to numbers
        const revStr = applicant.rev.replace(/[^0-9.]/g, '');
        let revenue = parseFloat(revStr);
        if (applicant.rev.includes('M')) revenue *= 1000000;
        if (applicant.rev.includes('k')) revenue *= 1000;

        if (revenue > 100000) {
            score += 50;
            reasons.push("High Revenue (>100k)");
        } else if (revenue > 10000) {
            score += 20;
            reasons.push("Valid Revenue (>10k)");
        } else {
            reasons.push("Low Revenue");
        }

        // 2. Niche Validation
        if (['Ecommerce', 'SaaS', 'High Ticket'].some(n => applicant.niche.includes(n))) {
            score += 30;
            reasons.push("Preferred Niche");
        }

        // 3. Tech Stack Intent
        if (applicant.stack === 'Shopify' || applicant.stack === 'Next.js') {
            score += 20;
            reasons.push("Modern Stack");
        }

        return { score, approved: score >= 70, reasons, revenueVal: revenue };
    }
}

class EvaluationAgent {
    constructor() {
        this.nicheId = process.env.NICHE_ID || 'default';
        this.logPath = path.join(process.cwd(), `evaluations-${this.nicheId}.log`);
    }

    log(message) {
        const timestamp = new Date().toISOString();
        const entry = `[${timestamp}] [Evaluator - ${this.nicheId}]: ${message}\n`;
        console.log(entry.trim());
        fs.appendFileSync(this.logPath, entry);
    }

    async run() {
        console.log("=== EVALUADOR SIMPLE: CASH-FOCUS ENABLED ===\n");

        while (true) {
            try {
                // Fetch next 5 new leads
                const leads = await prisma.lead.findMany({
                    where: { status: 'new' },
                    take: 5
                });

                for (const lead of leads) {
                    this.log(`Evaluando lead: ${lead.name} (${lead.website})`);

                    if (lead.website && lead.website !== "N/A") {
                        this.log(`✅ AUTO-APROBADO: Tiene website.`);

                        await prisma.lead.update({
                            where: { id: lead.id },
                            data: {
                                status: 'READY_FOR_OUTREACH',
                                score: 80
                            }
                        });

                        await notifyOutbound(`⚡ **Lead Calificado**: ${lead.name} listo para contacto.`);
                    } else {
                        this.log(`❌ RECHAZADO: Falta website.`);
                        await prisma.lead.update({
                            where: { id: lead.id },
                            data: { status: 'rejected' }
                        });
                    }
                }
            } catch (e) {
                this.log(`Error en ciclo: ${e.message}`);
            }

            await new Promise(r => setTimeout(r, 10000)); // Every 10 seconds
        }
    }
}

new EvaluationAgent().run().catch(console.error);
