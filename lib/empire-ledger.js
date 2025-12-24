const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * EMPIRE LEDGER - El corazón financiero del imperio.
 * Real-time tracking de cada ingreso y egreso (Database Backed).
 */

const LEDGER_JSON = path.join(process.cwd(), 'empire-ledger.json');

function getLocalExpenses() {
    if (fs.existsSync(LEDGER_JSON)) {
        const data = JSON.parse(fs.readFileSync(LEDGER_JSON, 'utf8'));
        return data.totalExpenses || 0;
    }
    return 0;
}

async function getLedger() {
    try {
        const payments = await prisma.payment.aggregate({
            _sum: { amount: true },
            where: { status: 'approved' }
        });

        const totalRevenue = payments._sum.amount || 0;
        const totalExpenses = getLocalExpenses();

        return {
            totalRevenue,
            totalExpenses,
            netProfit: totalRevenue - totalExpenses,
            isLucrative: (totalRevenue - totalExpenses) > -5000, // Límite de quema: $5000 ARS
            transactions: []
        };
    } catch (e) {
        console.error("[LEDGER] Error reading DB ledger:", e.message);
        return { totalRevenue: 0, totalExpenses: 0, netProfit: 0, isLucrative: false };
    }
}

async function recordTransaction(niche, amount, type = 'REVENUE', description = "", metadata = {}) {
    console.log(`[LEDGER] Recording to DB: ${amount} (${type})`);

    // NOTA: Para escribir en 'Payment', necesitamos una Subscription válida.
    // Si es un script suelto el que llama, esto podría fallar si no pasamos subscriptionId.
    // Por simplicidad en esta fase, 'recordTransaction' desde scripts sueltos
    // solo logueará si no hay un ID, pero el Webhook es la fuente de verdad.

    if (type === 'REVENUE' && metadata.subscriptionId) {
        try {
            await prisma.payment.create({
                data: {
                    subscriptionId: metadata.subscriptionId,
                    amount: parseFloat(amount),
                    currency: 'USD',
                    status: 'approved',
                    paymentMethod: 'mercadopago',
                    description: description,
                    paymentProviderId: metadata.paymentId || 'MANUAL-' + Date.now(),
                    isTest: false // REAL REVENUE
                }
            });
            console.log(`[LEDGER] ✅ Saved to Payment table.`);
        } catch (e) {
            console.error(`[LEDGER] ❌ Failed to save payment: ${e.message}`);
        }
    } else {
        console.log(`[LEDGER] ⚠️ Transaction skipped (No Subscription Context): ${description}`);
    }
}

async function recordExpense(amount, description) {
    let data = { totalRevenue: 0, totalExpenses: 0 };
    if (fs.existsSync(LEDGER_JSON)) {
        data = JSON.parse(fs.readFileSync(LEDGER_JSON, 'utf8'));
    }

    data.totalExpenses = (data.totalExpenses || 0) + parseFloat(amount);
    data.timestamp = new Date().toISOString();

    fs.writeFileSync(LEDGER_JSON, JSON.stringify(data, null, 2));
    console.log(`[LEDGER] 💸 Expense recorded: ${amount} - ${description}`);
}

module.exports = { getLedger, recordTransaction, recordExpense };

