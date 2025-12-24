const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * AGENTE 9: THE NICHE CLONER
 * Misión: Clonar el ecosistema Hub para dominar múltiples industrias.
 */

const NICHES = {
    'suplementos-dtc': {
        name: 'Suplementos DTC',
        targets: [
            { name: "FitFuel", niche: "Suplementos", revenue: "$400k/mo" },
            { name: "MusclePro", niche: "Nutrición", revenue: "$1.2M/mo" }
        ],
        painPrefix: "baja LTV y retención de clientes"
    },
    'real-estate-lux': {
        name: 'Real Estate de Lujo',
        targets: [
            { name: "Elite Properties", niche: "Inmobiliaria", revenue: "$2M/mo" },
            { name: "Luxury Loft", niche: "Real Estate", revenue: "$800k/mo" }
        ],
        painPrefix: "falta de leads ultra-calificados para propiedades premium"
    },
    'infoproductos-ht': {
        name: 'Infoproductos High-Ticket',
        targets: [
            { name: "Mastermind Group", niche: "Educación", revenue: "$300k/mo" },
            { name: "Expert Course", niche: "Mentoria", revenue: "$150k/mo" }
        ],
        painPrefix: "embudos de venta manuales que no escalan sin el experto"
    }
};

const PM2 = "c:\\Users\\Exequiel rogers\\Desktop\\Nueva carpeta\\bin\\node-v20.10.0-win-x64\\pm2.cmd";

function cloneNiche(id, customName = null) {
    let niche = NICHES[id];

    // Si no existe en el pre-set, creamos uno dinámico
    if (!niche && customName) {
        niche = {
            name: customName,
            targets: [{ name: "Target A", niche: "General", revenue: "Unknown" }],
            painPrefix: "necesidad de optimización"
        };
    } else if (!niche) {
        return console.error(`Nicho ${id} no encontrado y no se proveyó nombre.`);
    }

    console.log(`\n🚀 CLONANDO ECOSISTEMA PARA: ${niche.name.toUpperCase()}...`);

    // Guardar configuración específica
    const nicheConfigPath = path.join(process.cwd(), `config-${id}.json`);
    fs.writeFileSync(nicheConfigPath, JSON.stringify(niche, null, 2));

    try {
        console.log(`[CLONER] Ejecutando PM2 para ${id}...`);
        // Quotes around PM2 path are crucial
        execSync(`"${PM2}" start scripts/prospector.js --name "prospector-${id}" --env NICHE_ID="${id}"`, { stdio: 'inherit' });
        execSync(`"${PM2}" start scripts/evaluator.js --name "evaluator-${id}" --env NICHE_ID="${id}"`, { stdio: 'inherit' });

        console.log(`✅ Nicho '${id}' desplegado y online.`);
    } catch (e) {
        console.error(`Error al desplegar nicho ${id}:`, e.message);
    }
}

// Lógica de Argumentos CLI vs Batch
const args = process.argv.slice(2);
if (args.length >= 2) {
    // Modo Single: node niche-cloner.js bio-saas "Bio SaaS Elite"
    cloneNiche(args[0], args[1]);
    execSync(`"${PM2}" save`, { stdio: 'inherit' });
} else {
    // Modo Batch (Hardcoded)
    console.log("=== THE NICHE CLONER (AGENT 9) INICIALIZADO ===\n");
    Object.keys(NICHES).forEach(id => cloneNiche(id));
    console.log("\n--- Clonación masiva completada. El imperio se expande. ---\n");
    execSync(`"${PM2}" save`, { stdio: 'inherit' });
}
