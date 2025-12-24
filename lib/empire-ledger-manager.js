const fs = require('fs');
const path = require('path');

/**
 * EMPIRE LEDGER MANAGER - Antigravity Financial Governance
 * Maneja el registro de revenue y métricas con soporte multi-nicho.
 */

const LEDGER_PATH = path.join(process.cwd(), 'empire-ledger.json');

class EmpireLedgerManager {
    static getLedger() {
        if (!fs.existsSync(LEDGER_PATH)) {
            return { totalRevenue: 0, niches: {} };
        }
        try {
            return JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8'));
        } catch (e) {
            return { totalRevenue: 0, niches: {} };
        }
    }

    static saveLedger(ledger) {
        ledger.timestamp = new Date().toISOString();
        fs.writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2));
    }

    static registerTransaction(nicheId, amount, type = 'revenue') {
        const ledger = this.getLedger();

        if (!ledger.niches) ledger.niches = {};
        if (!ledger.niches[nicheId]) {
            ledger.niches[nicheId] = { revenue: 0, leads: 0, conversions: 0, expenses: 0 };
        }

        if (type === 'revenue') {
            ledger.totalRevenue += amount;
            ledger.niches[nicheId].revenue += amount;
            ledger.niches[nicheId].conversions += 1;
        } else if (type === 'expense') {
            ledger.niches[nicheId].expenses += amount;
        }

        this.saveLedger(ledger);
        console.log(`[LEDGER] Registrado ${type} de $${amount} para nicho ${nicheId}`);
    }

    static recordLead(nicheId) {
        const ledger = this.getLedger();
        if (!ledger.niches) ledger.niches = {};
        if (!ledger.niches[nicheId]) {
            ledger.niches[nicheId] = { revenue: 0, leads: 0, conversions: 0, expenses: 0 };
        }

        ledger.niches[nicheId].leads += 1;
        this.saveLedger(ledger);
    }

    static getNicheStats(nicheId) {
        const ledger = this.getLedger();
        return ledger.niches?.[nicheId] || { revenue: 0, leads: 0, conversions: 0, expenses: 0 };
    }
}

module.exports = EmpireLedgerManager;
