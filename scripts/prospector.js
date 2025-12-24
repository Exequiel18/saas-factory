const fs = require('fs');
const path = require('path');
const { discoverLeads } = require('../lib/discovery-engine');
const { sendOutbound } = require('../lib/real-world-bridge');

/**
 * AGENTE CASTING INTELIGENTE - Antigravity Commerce Hub
 * Objetivo: Detectar fundadores de e-commerce con potencial y seleccionarlos.
 */

const NICHE_ID = process.env.NICHE_ID || 'default';
const configPath = path.join(process.cwd(), `config-${NICHE_ID}.json`);
let nicheConfig = null;

if (fs.existsSync(configPath)) {
    try {
        nicheConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (e) {
        console.error("Error al leer configuración de nicho:", e.message);
    }
}

const PAIN_PREFIX = nicheConfig ? nicheConfig.painPrefix : "potencial de escalamiento real, pero parece estar llegando a un techo";

const { notifyOutbound } = require('./outbound-notifier');

// ... existing code ...

async function dispatchRealMessage(target, niche, message) {
    try {
        await sendOutbound(niche, target, message);
        // VOICE ACTIVATE
        const voiceMsg = `🚀 **Prospector ${niche.toUpperCase()}** reporta: Encontrado lead con intención real: **${target.name}**\n"${message}"`;
        await notifyOutbound(voiceMsg);
    } catch (e) {
        console.error(`[FATAL] El puente real colapsó: ${e.message}`);
    }

    const logEntry = `${new Date().toISOString()} - Casting message SENT via REAL-WORLD-BRIDGE to ${target.name}\n`;
    fs.appendFileSync(path.join(process.cwd(), `prospector-${NICHE_ID}.log`), logEntry);
}

async function runCasting() {
    console.log(`=== CASTING INTELIGENTE [${NICHE_ID.toUpperCase()}] INICIADO ===\n`);

    while (true) {
        // DESCUBRIMIENTO DINÁMICO
        const targets = await discoverLeads(NICHE_ID, nicheConfig?.target || "E-commerce Brands");

        for (const target of targets) {
            console.log(`[${new Date().toISOString()}] [Casting Agent - ${NICHE_ID}]: Procesando hallazgo: ${target.name}`);

            const message = `Hola ${target.name}, detectamos un ${PAIN_PREFIX} en tu operación. Podemos resolverlo con Antigravity.`;

            await dispatchRealMessage(target, NICHE_ID, message);
        }

        const waitTime = Math.floor(Math.random() * (60000 - 15000) + 15000); // Ciclos cada 15-60 segundos
        await new Promise(r => setTimeout(r, waitTime));
    }
}

runCasting().catch(console.error);
