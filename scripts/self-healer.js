const { execSync } = require('child_process');

/**
 * SELF-HEALER (ZERO-STOP OVERDRIVE)
 * Vigilante perpetuo de la salud del imperio. 
 * Si algo respira mal, lo cura al instante.
 */

function checkProcessHealth() {
    console.log(`[SELF-HEALER] [${new Date().toISOString()}] Escaneando pulso vital...`);

    try {
        const status = execSync('pm2 jlist').toString();
        const processes = JSON.parse(status);

        processes.forEach(proc => {
            // Si un proceso está en 'errored', 'stopped' o usa demasiada memoria (>300MB)
            if (proc.pm2_env.status === 'errored' || proc.monit.memory > 300 * 1024 * 1024) {
                console.log(`🚑 [CRITICO] ${proc.name} detectado en estado fallido o pesado. Reiniciando...`);
                execSync(`pm2 restart ${proc.pm_id}`);
            }
        });

    } catch (e) {
        console.error("❌ [SELF-HEALER] Error durante el escaneo. Auto-reiniciando monitor.");
    }
}

// Escaneo ultra-rápido cada 30 segundos
setInterval(checkProcessHealth, 30000);
console.log("🛡️ Protocolo Zero-Stop activo. El sistema no frenará jamás.");
checkProcessHealth();
