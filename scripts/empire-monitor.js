const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * EMPIRE MONITOR - Antigravity Hub
 * Objetivo: Monitorear la salud de todos los nichos y optimizar parámetros.
 */

const NICHES = ['suplementos-dtc', 'real-estate-lux', 'infoproductos-ht'];

function log(msg) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [EmpireMonitor]: ${msg}`);
}

function checkNicheHealth() {
    log("Iniciando escaneo de salud del imperio...");

    try {
        const status = execSync('pm2 jlist').toString();
        const processes = JSON.parse(status);

        NICHES.forEach(niche => {
            const prospector = processes.find(p => p.name === `prospector-${niche}`);
            const evaluator = processes.find(p => p.name === `evaluator-${niche}`);

            if (!prospector || prospector.pm2_env.status !== 'online') {
                log(`⚠️ ALERTA: Prospector para ${niche} está OFFLINE. Reiniciando...`);
                execSync(`pm2 restart prospector-${niche}`);
            }

            if (!evaluator || evaluator.pm2_env.status !== 'online') {
                log(`⚠️ ALERTA: Evaluador para ${niche} está OFFLINE. Reiniciando...`);
                execSync(`pm2 restart evaluator-${niche}`);
            }
        });

        log("✅ Escaneo completado. Todos los nodos del imperio están operando.");
    } catch (e) {
        log(`❌ Error durante el chequeo de salud: ${e.message}`);
    }
}

async function aggregateCriticalMetrics() {
    log("Consulting the Oracle for Critical Metrics...");

    try {
        const response = await fetch('http://localhost:3000/api/metrics/critical', {
            headers: {
                'x-empire-secret': process.env.EMPIRE_SECRET || 'antigravity-visual-link'
            }
        });

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();

        // Save raw metrics for the ledger
        const report = {
            ...data.metrics,
            timestamp: new Date().toISOString()
        };

        fs.writeFileSync(path.join(process.cwd(), 'empire-ledger.json'), JSON.stringify(report, null, 2));

        log(`\n📊 CRITICAL METRICS REPORT:`);
        log(`1. Retention (No Email): ${data.metrics.returningNoEmail.toFixed(1)}%`);
        log(`2. Upsell Visibility (<40): ${data.metrics.lowScoreUpsellView.toFixed(1)}%`);
        log(`3. Upsell Conversion: ${data.metrics.upsellConversion.toFixed(1)}%`);
        log(`4. Recovery Time: ${data.metrics.avgRecoveryTimeHours.toFixed(1)}h`);
        log(`5. High Score Abandon: ${data.metrics.highScoreAbandonRate.toFixed(1)}%`);
        log(`\n✅ Empire Ledger updated.`);

    } catch (e) {
        log(`❌ Error fetching critical metrics: ${e.message}`);
    }
}

async function runMonitor() {
    while (true) {
        checkNicheHealth();
        await aggregateCriticalMetrics();

        // Esperar 5 minutos entre ciclos de monitoreo
        await new Promise(r => setTimeout(r, 300000));
    }
}

runMonitor().catch(console.error);
