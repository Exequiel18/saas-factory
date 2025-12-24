import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const nicheId = searchParams.get('nicheId') || 'default';

        const pm2Home = process.env.PM2_HOME || path.join(os.homedir(), '.pm2');

        // Dynamic log paths
        const governorId = 'hub-governor';
        const prospectorName = nicheId === 'default' ? 'hub-prospector' : `prospector-${nicheId}`;
        const evaluatorName = nicheId === 'default' ? 'hub-evaluator' : `evaluator-${nicheId}`;

        const readLog = (p: string) => fs.existsSync(p) ? fs.readFileSync(p, 'utf8').split('\n').slice(-30).join('\n') : '';

        // Spawned Niches
        const spawnedPath = path.join(process.cwd(), 'spawned-niches.json');
        const spawnedNiches = fs.existsSync(spawnedPath) ? JSON.parse(fs.readFileSync(spawnedPath, 'utf8')) : [];

        // RPC Metrics from Ledger
        const ledgerPath = path.join(process.cwd(), 'empire-ledger.json');
        let ledgerStats = { revenue: 0, leads: 0, conversions: 0, expenses: 0 };
        let totalRevenue = 0;

        if (fs.existsSync(ledgerPath)) {
            try {
                const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
                totalRevenue = ledger.totalRevenue || 0;
                if (ledger.niches && ledger.niches[nicheId]) {
                    ledgerStats = ledger.niches[nicheId];
                }
            } catch (e) {
                console.error("Error reading ledger:", e);
            }
        }

        // Transactions (Prisma)
        let transactions: any[] = [];
        try {
            const txs = await prisma.payment.findMany({
                where: nicheId !== 'default' ? { subscription: { organization: { name: nicheId } } } : {},
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: { subscription: { include: { organization: true } } }
            });

            transactions = txs.map((t: any) => ({
                niche: t.subscription?.organization?.name || 'Empire Fund',
                amount: t.amount,
                type: 'REVENUE',
                timestamp: t.createdAt
            }));
        } catch (e) {
            console.error("DB error:", e);
        }

        const thoughts = [
            `Nicho [${nicheId}] detectado. Momentum positivo del mercado.`,
            `Gobernanza activada para ${nicheId}. Optimizando flujo de revenue.`,
            `Buscando nuevas señales de intención en ${nicheId}.`,
            `ROI del imperio escalando.`,
            `Auto-sanación activa en el nodo ${nicheId}.`
        ];

        return NextResponse.json({
            governor: readLog(path.join(pm2Home, 'logs', `${governorId}-out.log`)),
            prospector: readLog(path.join(pm2Home, 'logs', `${prospectorName}-out.log`)),
            evaluator: readLog(path.join(pm2Home, 'logs', `${evaluatorName}-out.log`)),
            metrics: {
                ...ledgerStats,
                totalRevenue,
                conversionRate: ledgerStats.leads > 0 ? ((ledgerStats.conversions / ledgerStats.leads) * 100).toFixed(1) : 0
            },
            transactions,
            thought: thoughts[Math.floor(Math.random() * thoughts.length)],
            spawnedNiches,
            nicheId
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
