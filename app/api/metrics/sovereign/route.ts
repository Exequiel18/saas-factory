import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import fs from "fs"
import path from "path"

/**
 * Sovereign Metrics API
 * Aggregates data from ALL niches in the "Forest".
 */
export async function GET() {
    try {
        // 1. Total Revenue across all niches
        const totalRevenue = await prisma.payment.aggregate({
            _sum: { amount: true },
            where: { status: 'approved' }
        });

        // 2. Revenue per Niche
        const payments = await prisma.payment.findMany({
            where: { status: 'approved' },
            select: {
                amount: true,
                metadata: true
            }
        });

        const revenueByNiche: Record<string, number> = {};
        payments.forEach(p => {
            const metadata = JSON.parse(p.metadata || '{}');
            const niche = metadata.niche_id || 'general';
            revenueByNiche[niche] = (revenueByNiche[niche] || 0) + p.amount;
        });

        // 3. Leads health across all niches
        const leadsByNiche = await prisma.lead.groupBy({
            by: ['niche', 'status'],
            _count: { _all: true }
        });

        // 4. Growth Velocity (Payments in last 24h)
        const dailyRevenue = await prisma.payment.aggregate({
            _sum: { amount: true },
            where: {
                status: 'approved',
                createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            }
        });

        // 5. Neural Guidance Intelligence
        const guidancePath = path.join(process.cwd(), 'neural-guidance.json');
        let intelligence = [];
        if (fs.existsSync(guidancePath)) {
            intelligence = JSON.parse(fs.readFileSync(guidancePath, 'utf8'));
        }

        return NextResponse.json({
            forestStatus: 'HEALTHY',
            intelligence: intelligence.length > 0 ? intelligence : [{ type: 'STABLE', message: 'Neural network optimized' }],
            totalEmpireRevenue: totalRevenue._sum.amount || 0,
            dailyVelocity: dailyRevenue._sum.amount || 0,
            revenueByNiche,
            leadsByNiche,
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error("Sovereign Metrics Error:", error);
        return NextResponse.json({ error: "Failed to fetch forest metrics" }, { status: 500 });
    }
}
