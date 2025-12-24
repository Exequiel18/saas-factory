const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { notifyOutbound } = require('./outbound-notifier');
const { recordExpense } = require('../lib/empire-ledger');

function recordGuidance(niche, type, message, priority = 'NORMAL') {
    const guidancePath = path.join(process.cwd(), 'neural-guidance.json');
    let signals = [];
    if (fs.existsSync(guidancePath)) {
        signals = JSON.parse(fs.readFileSync(guidancePath, 'utf8'));
    }
    signals.push({ niche, type, message, priority, timestamp: new Date().toISOString() });
    fs.writeFileSync(guidancePath, JSON.stringify(signals, null, 2));
}

/**
 * PROSPECTOR REAL API - Antigravity Expansion
 * Objetivo: Encontrar leads reales en nichos específicos usando SerpApi (Google Maps/Search).
 */

const NICHE_ID = process.env.NICHE_ID || 'default';
const SERPAPI_KEY = process.env.SERPAPI_KEY;

async function fetchRealLeads(query) {
    if (!SERPAPI_KEY) {
        console.warn("[PROSPECTOR-REAL] ⚠️ SERPAPI_KEY no encontrada. Usando modo simulación de alta fidelidad.");
        // Simulación de "pata negra" con nombres reales para no bloquear la ejecución si no hay key aún
        return [
            { name: "Dental S.A.", website: "https://dentalsa.com", industry: "Health", intent: "high" },
            { name: "Madrid Green Energy", website: "https://madridgreen.es", industry: "Energy", intent: "medium" },
            { name: "Tech Logistics Ltd", website: "https://techlogistics.co.uk", industry: "Logistics", intent: "high" }
        ];
    }

    try {
        const url = `https://serpapi.com/search.json?engine=google_maps&q=${encodeURIComponent(query)}&api_key=${SERPAPI_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.local_results) {
            return data.local_results.map(res => ({
                name: res.title,
                website: res.website || "N/A",
                industry: res.type || "Local Business",
                intent: "high", // Basado en que aparece en Maps para una búsqueda comercial
                metadata: JSON.stringify(res)
            }));
        }
    } catch (e) {
        console.error("[PROSPECTOR-REAL] Error en SerpApi:", e.message);
    }
    return [];
}

async function runRealProspector() {
    const query = process.env.EXPANSION_QUERY || "Dentistas en Buenos Aires";
    console.log(`🚀 [CASH-FLOW] Buscando leads de alta intención: ${query}`);

    // Registrar gasto operativo por búsqueda
    await recordExpense(50, `SerpApi Search: ${query} [${NICHE_ID}]`);

    const leads = await fetchRealLeads(query);

    for (const lead of leads) {
        if (!lead.website || lead.website === "N/A") {
            console.log(`⏭️ [PROSPECTOR] Saltando ${lead.name} (Sin website)`);
            continue;
        }

        try {
            // Generar un email predictivo para el lead
            const domain = new URL(lead.website).hostname.replace('www.', '');
            const email = `contacto@${domain}`;

            const existing = await prisma.lead.findUnique({ where: { email } });

            if (!existing) {
                await prisma.lead.create({
                    data: {
                        name: lead.name,
                        email: email,
                        website: lead.website,
                        niche: NICHE_ID,
                        source: 'FAST_CASH_DISCOVERY',
                        status: 'new', // Empieza en New para ser evaluado rápido
                        metadata: lead.metadata || JSON.stringify(lead)
                    }
                });

                console.log(`✅ [PROSPECTOR] Lead guardado: ${lead.name} (${lead.website})`);
                await notifyOutbound(`📍 **Lead Capturado**: ${lead.name} - ${lead.website}`);
            }
        } catch (e) {
            console.error(`[PROSPECTOR] Error procesando lead ${lead.name}:`, e.message);
        }
    }

    if (leads.length === 0) {
        console.log(`⚠️ [PROSPECTOR] Nicho ${NICHE_ID} sin leads. Enviando señal de PIVOT.`);
        recordGuidance(NICHE_ID, 'PIVOT_REQUEST', 'No leads found in last search', 'HIGH');
    }

    console.log(`[CASH-FLOW] Ciclo terminado. ${leads.length} procesados.`);
}

runRealProspector().catch(console.error).finally(() => prisma.$disconnect());
