const fs = require('fs');
const path = require('path');
const { sendOutbound } = require('./real-world-bridge');

/**
 * CUSTOMER ENGINE - Antigravity Hub
 * Gestiona el onboarding y la entrega de valor a clientes pagadores.
 */

async function activateOnboarding(customerId, niche) {
    console.log(`[CUSTOMER-ENGINE] Activando onboarding para cliente ${customerId} en nicho ${niche}`);

    const message = `¡Bienvenido al Apex Circle de Antigravity! Tu pago ha sido confirmado. 🚀 

Aquí tienes tu acceso inicial y los pasos para la integración de Revenue Share. Nuestro equipo técnico está preparando tu instancia dedicada.`;

    try {
        await sendOutbound(niche, { name: "Nuevo Cliente", id: customerId }, message);
        console.log(`[CUSTOMER-ENGINE] Onboarding enviado con éxito.`);
    } catch (e) {
        console.error(`[CUSTOMER-ENGINE] Error enviando onboarding: ${e.message}`);
    }
}

module.exports = { activateOnboarding };
