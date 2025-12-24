/**
 * SIMULADOR DE WEBHOOK - Mercado Pago
 * Trigger manual para validar que el sistema captura ingresos reales.
 */

async function simulatePayment() {
    const WEBHOOK_URL = 'http://localhost:3000/api/webhooks/mercadopago'; // Ajustar si el puerto es distinto

    console.log("🚀 Iniciando Simulación de Venta Confirmada...");

    const payload = {
        type: 'payment',
        data: {
            id: `SIM-${Date.now()}`
        }
    };

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        console.log(`[SIMULADOR] Respuesta del sistema:`, result);
        console.log("✅ Simulación completada. Verificá el War Room y el Ledger.");
    } catch (e) {
        console.error("❌ Error en la simulación:", e.message);
    }
}

simulatePayment();
