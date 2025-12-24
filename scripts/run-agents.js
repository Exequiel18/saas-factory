const { exec } = require('child_process');
const path = require('path');

// Configuración de los agentes a correr
const AGENTS = ['B2B_Hunter', 'Growth_Hacker'];
const INTERVAL = 10 * 60 * 1000; // Cada 10 minutos (en ms)

async function runAgent(name) {
    console.log(`[${new Date().toISOString()}] 🤖 Lanzando ejecución del agente: ${name}`);

    // Llamamos al API de agentes usando curl o fetch (vía node)
    // Usamos el secret configurado en .env.local
    const secret = "factory-secret-123"; // Debe coincidir con el fallback en la route.ts

    try {
        const response = await fetch('http://localhost:3000/api/agents/run', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-autonomous-key': secret
            },
            body: JSON.stringify({ agentName: name })
        });

        const data = await response.json();
        console.log(`[${new Date().toISOString()}] ✅ Resultado ${name}:`, data.message || data);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] ❌ Error ejecutando ${name}:`, error.message);
    }
}

async function startLoop() {
    console.log('🚀 Iniciando Loop de Agentes Autónomos (PM2 Managed)');

    while (true) {
        for (const agent of AGENTS) {
            await runAgent(agent);
            // Dar un pequeño respiro entre agentes
            await new Promise(r => setTimeout(r, 5000));
        }

        console.log(`😴 Durmiendo por ${INTERVAL / 1000 / 60} minutos...`);
        await new Promise(r => setTimeout(r, INTERVAL));
    }
}

startLoop();
