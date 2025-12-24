const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuración de rutas
const LEDGER_PATH = path.join(process.cwd(), 'empire-ledger.json');
const STRATEGY_PATH = path.join(process.cwd(), 'strategy.json');
const LOGS_DIR = path.join(process.cwd(), 'logs');

function log(msg) {
    const timestamp = new Date().toISOString();
    console.log(`[STRATEGIST][${timestamp}] ${msg}`);
}

function getStrategy() {
    if (!fs.existsSync(STRATEGY_PATH)) {
        return {
            profitThreshold: -5000,
            pivotOnFatigue: true,
            pauseOnError: true,
            maxMemory: 300
        };
    }
    return JSON.parse(fs.readFileSync(STRATEGY_PATH, 'utf8'));
}

function calcularProfit() {
    if (!fs.existsSync(LEDGER_PATH)) return 0;
    const data = JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8'));
    // En tu ledger actual: totalRevenue y totalExpenses (o operationalCosts)
    const revenue = data.totalRevenue || 0;
    const costs = data.totalExpenses || data.operationalCosts || 0;
    return revenue - costs;
}

function getNichos() {
    // Escaneamos archivos de config para saber qué nichos están activos
    const files = fs.readdirSync(process.cwd());
    const niches = files
        .filter(f => f.startsWith('config-') && f.endsWith('.json'))
        .map(f => f.replace('config-', '').replace('.json', ''));

    // Si no hay archivos, usamos los por defecto
    return niches.length > 0 ? niches : ['suplementos-dtc', 'real-estate-lux', 'infoproductos-ht'];
}

function estaFatigado(nicho) {
    const filePath = path.join(LOGS_DIR, `${nicho}-activity.json`);
    if (!fs.existsSync(filePath)) return false;
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return data.noLeadsFor > 3; // Condición de fatiga
    } catch (e) {
        return false;
    }
}

function ejecutarGobernanza() {
    log('--- Iniciando Ciclo de Gobernanza ---');
    const strategy = getStrategy();
    const profit = calcularProfit();

    log(`Profit Actual: ${profit} | Threshold: ${strategy.profitThreshold}`);

    if (profit < strategy.profitThreshold) {
        log('🛑 Profit Guard: ACTIVADO. El imperio está en riesgo financiero.');
        // Lógica para frenar agentes si es necesario o alertar
    }

    if (strategy.pivotOnFatigue) {
        const nichos = getNichos();
        nichos.forEach(n => {
            if (estaFatigado(n)) {
                log(`⚠️ PIVOT_REQUEST para ${n}: Detectada fatiga de leads.`);
                try {
                    // Usar pm2 si está disponible en el path o via npx
                    log(`Ejecutando: pm2 stop prospector-${n} y evaluator-${n}`);
                    execSync(`pm2 stop prospector-${n}`, { stdio: 'inherit' });
                    execSync(`pm2 stop evaluator-${n}`, { stdio: 'inherit' });
                } catch (e) {
                    log(`Error al detener procesos para ${n}: ${e.message}`);
                }
            }
        });
    }

    log('--- Ciclo de Gobernanza Completado ---');
}

// Loop infinito cada 5 minutos (configurable)
const INTERVAL = 5 * 60 * 1000;
log(`Strategist iniciado. Frecuencia: ${INTERVAL / 1000 / 60} minutos.`);

// Ejecutar inmediatamente al iniciar
ejecutarGobernanza();

setInterval(ejecutarGobernanza, INTERVAL);
