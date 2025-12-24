const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const { getLedger } = require('../lib/empire-ledger');
const { notifyOutbound } = require('./outbound-notifier');

const SPAWNED_NICHES_PATH = path.join(process.cwd(), 'spawned-niches.json');

function getActiveNiches() {
    if (fs.existsSync(SPAWNED_NICHES_PATH)) {
        try {
            return JSON.parse(fs.readFileSync(SPAWNED_NICHES_PATH, 'utf8'));
        } catch (e) {
            return ['dentistas'];
        }
    }
    return ['dentistas'];
}

const NODE_PATH = path.join(process.cwd(), 'bin', 'node-v20.10.0-win-x64', 'node.exe');

const AGENTS = [
    { name: 'PROSPECTOR', script: 'scripts/prospector-real-api.js', interval: 60000 * 10 },
    { name: 'EVALUATOR', script: 'scripts/evaluator.js', interval: 60000 * 5 },
    { name: 'GOVERNOR', script: 'scripts/outbound-governor.js', interval: 60000 * 7 }
];

function log(agent, niche, msg) {
    const timestamp = new Date().toISOString();
    console.log(`[CNS][${timestamp}][${niche.toUpperCase()}][${agent}] ${msg}`);
}

async function runAgent(agent, niche) {
    // PROFIT GUARD CHECK
    const ledger = await getLedger();
    if (!ledger.isLucrative) {
        log('SYSTEM', niche, `🛑 PROFIT GUARD ACTIVE: Net Profit ${ledger.netProfit} ARS is below threshold. Synaptic impulses paused.`);
        await notifyOutbound(`⚠️ **Empire Hibernation**: El sistema ha entrado en modo ahorro por falta de rentabilidad operativa.`);
        return;
    }

    log(agent.name, niche, '⚡ INITIATING NEURAL IMPULSE');

    const child = exec(`"${NODE_PATH}" ${agent.script}`, {
        env: { ...process.env, NICHE_ID: niche },
        windowsHide: true
    }, (error, stdout, stderr) => {
        if (error) {
            log(agent.name, niche, `❌ SYNAPTIC FAILURE: ${error.message}`);
            return;
        }
        log(agent.name, niche, '✅ CYCLE SUCCESSFUL');
    });
}

async function startCNS() {
    console.log('\n==========================================');
    console.log('🚀 ANTIGRAVITY IMPERIAL CNS ONLINE');
    console.log('==========================================\n');

    const niches = getActiveNiches();
    console.log(`📡 MONITORING ${niches.length} NODES: ${niches.join(', ')}\n`);

    niches.forEach(niche => {
        AGENTS.forEach(agent => {
            runAgent(agent, niche);
            setInterval(() => runAgent(agent, niche), agent.interval);
        });
    });

    console.log('🔗 ALL NEURAL CABLES SECURED. TOTAL SOVEREIGNTY ACTIVE.\n');
}

if (process.argv.includes('--test')) {
    const niches = getActiveNiches();
    niches.forEach(niche => AGENTS.forEach(agent => runAgent(agent, niche)));
} else {
    startCNS().catch(console.error);
}
