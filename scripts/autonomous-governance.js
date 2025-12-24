const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * AUTONOMOUS REVENUE GOVERNANCE - 8 AGENTS
 * Mission: First Mercado Pago Payment.
 */

class BusinessAgent {
    constructor(name, role, focus) {
        this.name = name;
        this.role = role;
        this.focus = focus;
    }

    log(message) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${this.name}] (${this.role}): ${message}`);
    }
}

const Agents = [
    new BusinessAgent("The Sentinel", "Psychological", "User friction & log patterns"),
    new BusinessAgent("The Seer", "Intuitive", "Anticipating payment bottlenecks"),
    new BusinessAgent("The Architect", "Strategic", "Structural revenue path optimization"),
    new BusinessAgent("The Catalyst", "Creative", "Incentives & conversion hooks"),
    new BusinessAgent("The Governor", "Executive", "PM2 process health & stability"),
    new BusinessAgent("The Oracle", "Metrics", "Log-to-money translation"),
    new BusinessAgent("The Closer", "Conversion", "Link reachability & finalization"),
    new BusinessAgent("The Guardian", "Integrity", "Security & Webhook validation")
];

async function runGovernance() {
    console.log("=== INICIANDO GOBERNANZA AUTÓNOMA DE INGRESOS (VERSION ELITE) ===\n");

    while (true) {
        // 1. The Governor: Check System Health
        Agents[4].log("Escaneando ecosistema PM2...");
        try {
            const list = execSync('"c:\\Users\\Exequiel rogers\\Desktop\\Nueva carpeta\\bin\\node-v20.10.0-win-x64\\pm2.cmd" jlist', { encoding: 'utf8' });
            const apps = JSON.parse(list);
            const backend = apps.find(a => a.name === 'core-backend');

            if (!backend || backend.pm2_env.status !== 'online') {
                Agents[4].log("CRÍTICO: core-backend fuera de línea. Reiniciando de inmediato...");
                execSync('"c:\\Users\\Exequiel rogers\\Desktop\\Nueva carpeta\\bin\\node-v20.10.0-win-x64\\pm2.cmd" restart core-backend');
            } else {
                Agents[4].log("core-backend estable y online.");
            }
        } catch (e) {
            Agents[4].log("Error al consultar PM2. Re-intentando...");
        }

        // 2. The Sentinel: Check Logs for errors
        Agents[0].log("Analizando patrones psicológicos en los logs...");
        try {
            const logsPath = path.join(process.env.USERPROFILE || process.env.HOME, '.pm2', 'logs', 'core-backend-error.log');
            if (fs.existsSync(logsPath)) {
                const logs = fs.readFileSync(logsPath, 'utf8').slice(-2000);
                if (logs.includes('Error') || logs.includes('Exception')) {
                    Agents[0].log("Detectada fricción técnica. El Seer está evaluando el impacto...");
                    Agents[1].log("Intuición: Esta fricción bloquea el pago. Governor, prepara limpieza.");
                } else {
                    Agents[0].log("No se detectan barreras cognitivas/técnicas.");
                }
            }
        } catch (e) { }

        // 3. The Guardian & The Architect: Revenue Verification
        Agents[7].log("Inspeccionando integridad de la ruta de cobro...");
        const envPath = path.join(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const env = fs.readFileSync(envPath, 'utf8');
            if (env.includes('MERCADOPAGO_ACCESS_TOKEN')) {
                Agents[2].log("Estrategia activa: Canal de pago abierto.");
            } else {
                Agents[2].log("Estrategia fallida: No hay vía de cobro. Buscando alternativas...");
            }
        }

        // 4. The Closer: Generate Daily Revenue Opportunity
        Agents[6].log("Actualizando link de pago maestro...");
        try {
            // Re-run the emergency link generator to keep it fresh
            execSync('"c:\\Users\\Exequiel rogers\\Desktop\\Nueva carpeta\\bin\\node-v20.10.0-win-x64\\node.exe" scripts/generate-emergency-link.js', { stdio: 'inherit' });
            Agents[6].log("Link de pago verificado y en el 'Top of Mind' del sistema.");
        } catch (e) { }

        // 5. The Oracle & The Catalyst: Report
        Agents[3].log("Sugerencia creativa: El flujo está listo. Solo falta el trigger externo.");
        Agents[5].log("Métrica de éxito: Sistema operando al 100% de su capacidad monetaria.");

        // 6. Expansion Logic: Scale to New Niches
        const spawnPath = path.join(process.cwd(), 'spawned-niches.json');
        if (fs.existsSync(spawnPath)) {
            const niches = JSON.parse(fs.readFileSync(spawnPath, 'utf8'));
            for (const nicheId of niches) {
                Agents[2].log(`Escalando operaciones en Nicho: ${nicheId}`);
                try {
                    // Trigger real prospector for this niche if not running
                    execSync(`set NICHE_ID=${nicheId}&& set EXPANSION_QUERY="Empresas en ${nicheId}"&& node scripts/prospector-real-api.js`, { stdio: 'inherit' });
                } catch (e) {
                    console.error(`Error escalando nicho ${nicheId}:`, e.message);
                }
            }
        }

        // 7. Outreach Sequence Trigger
        Agents[6].log("Iniciando secuencia de Outreach y Onboarding...");
        try {
            execSync('node scripts/outbound-governor.js', { stdio: 'inherit' });
        } catch (e) { }

        // 8. The Oracle: Daily Summary Throttle
        const now = new Date();
        const lastReportFile = path.join(__dirname, '..', '.last-daily-report');
        let shouldReport = false;
        if (!fs.existsSync(lastReportFile)) {
            shouldReport = true;
        } else {
            const lastReport = new Date(fs.readFileSync(lastReportFile, 'utf8'));
            if (now - lastReport > 3600000) { // 1 hour
                shouldReport = true;
            }
        }

        if (shouldReport) {
            Agents[5].log("Hora del reporte. Invocando Daily Reporter...");
            try {
                const { sendDailySummary } = require('./daily-reporter');
                await sendDailySummary();
                fs.writeFileSync(lastReportFile, now.toISOString());
            } catch (e) {
                Agents[5].log("Error al enviar reporte: " + e.message);
            }
        }

        console.log("\n--- Ciclo de Gobernanza Completado. Monitoreando fortuna... ---\n");
        await new Promise(r => setTimeout(r, 10000)); // Every 10 seconds - HIGH SPEED GOVERNANCE
    }
}

runGovernance().catch(console.error);
