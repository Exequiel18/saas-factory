const { notifyOutbound } = require('./outbound-notifier');
const fs = require('fs');
const path = require('path');

async function sendDailySummary() {
    const ledgerPath = path.join(__dirname, '..', 'empire-ledger.json');
    let stats = {
        leads: 0,
        apps: 0,
        payments: 0,
        netRevenue: 0,
        failures: 0
    };

    if (fs.existsSync(ledgerPath)) {
        try {
            const data = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
            // In a real scenario, we'd filter for "today" or use the latest metrics.
            // For now, we take the most recent known values from the ledger.
            stats.leads = data.totalLeads || 0;
            stats.apps = data.totalApplications || 0;
            stats.payments = data.totalPayments || 0;
            stats.netRevenue = data.totalRevenue || 0;
            stats.failures = data.systemRestarts || 0;
        } catch (e) {
            console.error("Error reading ledger for daily report:", e);
        }
    }

    const message =
        `📊 **Resumen Diario del Imperio**\n` +
        `--------------------------------\n` +
        `🧲 **Leads Calificados:** ${stats.leads}\n` +
        `📄 **Aplicaciones:** ${stats.apps}\n` +
        `💰 **Pagos Recibidos:** ${stats.payments}\n` +
        `💵 **Ingreso Neto:** $${stats.netRevenue}\n` +
        `🔁 **Fallos auto-correctos:** ${stats.failures}\n` +
        `--------------------------------\n` +
        `👉 *Fase de Observación Activa (30-60 días)*`;

    console.log("Sending Daily Summary to Webhook...");
    await notifyOutbound(message);
}

if (require.main === module) {
    sendDailySummary();
}

module.exports = { sendDailySummary };
