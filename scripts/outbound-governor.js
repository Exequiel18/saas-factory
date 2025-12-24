const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendOutbound } = require('../lib/real-world-bridge');
const { notifyOutbound } = require('./outbound-notifier');

/**
 * OUTBOUND GOVERNOR - Antigravity Autonomous Outreach
 * Maneja secuencias de contacto, seguimiento y onboarding.
 */

async function processSequences() {
    console.log("=== OUTBOUND GOVERNOR: CASH-FLOW ACTIVE ===");

    // 1. CONTACTO DIRECTO: Leads 'READY_FOR_OUTREACH'
    const readyLeads = await prisma.lead.findMany({
        where: { status: 'READY_FOR_OUTREACH' },
        take: 10
    });

    for (const lead of readyLeads) {
        console.log(`[OUTREACH] Contactando: ${lead.name}`);

        // Link dinámico a la calculadora
        const calculatorLink = `https://saas-factory-antigravity.vercel.app/calculator?leadId=${lead.id}`;
        const message = `Hola ${lead.name}, detectamos puntos de mejora en ${lead.website}. Mira la salud financiera de tu negocio aquí: ${calculatorLink}`;

        try {
            await sendOutbound(lead.niche || 'default', lead.name, message);

            await prisma.lead.update({
                where: { id: lead.id },
                data: { status: 'contacted' }
            });

            await notifyOutbound(`📧 **Outreach Enviado**: ${lead.name} (${lead.website})`);
        } catch (e) {
            console.error(`Error contactando a ${lead.name}:`, e.message);
        }
    }

    // 2. BIENVENIDA: Leads 'converted'
    const convertedLeads = await prisma.lead.findMany({
        where: { status: 'converted' },
        take: 5
    });

    for (const lead of convertedLeads) {
        console.log(`[ONBOARDING] Entregando Access Key a: ${lead.name}`);
        const accessKey = `EMP-${Math.random().toString(36).substring(7).toUpperCase()}`;
        const welcomeMsg = `¡Gracias por tu pago, ${lead.name}! Tu Empire Access Key es: ${accessKey}. Accede al Hub Completo aquí: https://saas-factory-antigravity.vercel.app/dashboard`;

        try {
            await sendOutbound(lead.niche || 'default', lead.name, welcomeMsg);
            await prisma.lead.update({
                where: { id: lead.id },
                data: {
                    status: 'onboarded',
                    metadata: JSON.stringify({ ...JSON.parse(lead.metadata || '{}'), accessKey })
                }
            });
            await notifyOutbound(`💎 **Onboarding Exitoso**: ${lead.name} recibió su Access Key.`);
        } catch (e) {
            console.error(`Error en onboarding de ${lead.name}:`, e.message);
        }
    }
}

if (require.main === module) {
    processSequences()
        .catch(console.error)
        .finally(() => prisma.$disconnect());
}

module.exports = { processSequences };
