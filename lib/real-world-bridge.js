/**
 * REAL WORLD BRIDGE - Antigravity Hub
 * Centraliza todas las comunicaciones reales con el exterior.
 * No más simulaciones.
 */

const fs = require('fs');
const path = require('path');

async function sendOutbound(niche, target, body) {
    const logPath = path.join(process.cwd(), `outbound-history.log`);
    const timestamp = new Date().toISOString();

    console.log(`[REAL-BRIDGE] [${timestamp}] [${niche}] Despachando a: ${target.name || target}`);

    // CONFIGURACIÓN DE N8N O WHATSAPP API (Aquí va la URL real del usuario)
    const WEBHOOK_URL = process.env.OUTBOUND_WEBHOOK_URL;

    if (!WEBHOOK_URL) {
        console.warn(`[REAL-BRIDGE] ADVERTENCIA: OUTBOUND_WEBHOOK_URL no definida. El mensaje se encola localmente.`);
        fs.appendFileSync(logPath, `[QUEUED-OFFLINE] [${timestamp}] [${niche}] ${JSON.stringify({ target, body })}\n`);
        return { status: 'queued', reason: 'no-webhook' };
    }

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                niche,
                target,
                message: body,
                timestamp
            })
        });

        const result = await response.json();
        fs.appendFileSync(logPath, `[SENT-REAL] [${timestamp}] [${niche}] Target: ${target.name} | Status: Success\n`);
        return { status: 'sent', result };
    } catch (e) {
        console.error(`[REAL-BRIDGE] ERROR Crítico en despacho real: ${e.message}`);
        fs.appendFileSync(logPath, `[ERROR-FATAL] [${timestamp}] [${niche}] ${e.message}\n`);
        throw e;
    }
}

module.exports = { sendOutbound };
