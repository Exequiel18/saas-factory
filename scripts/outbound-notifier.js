const fs = require('fs');
const path = require('path');

// This allows using the native fetch in Node 18+
// If running on older node without fetch, this might need an polyfill or axios, 
// but user is on Node 20.

const OUTBOUND_WEBHOOK_URL = process.env.OUTBOUND_WEBHOOK_URL;

async function notifyOutbound(message) {
    if (!OUTBOUND_WEBHOOK_URL) {
        // Log locally if no webhook is verified to avoid cluttering process logs with fetch errors
        // But also log a discreet warning
        // console.warn("[VOICE] No OUTBOUND_WEBHOOK_URL defined. Message swallowed.");
        return;
    }

    try {
        const payload = {
            content: message
        };

        const response = await fetch(OUTBOUND_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error(`[VOICE] Webhook failed with status ${response.status}`);
        } else {
            console.log(`[VOICE] 📢 Broadcasted: "${message.substring(0, 50)}..."`);
        }
    } catch (e) {
        console.error(`[VOICE] Webhook connection failed: ${e.message}`);
    }
}

module.exports = { notifyOutbound };
