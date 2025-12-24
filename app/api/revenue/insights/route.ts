import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { globalRevenueOptimizer } from "@/lib/revenue-optimizer"

/**
 * 🤖 Autonomous Revenue Insights API
 * Returns real-time revenue optimization data
 */

export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Run optimization cycle and get insights
        const result = await globalRevenueOptimizer.runOptimizationCycle()

        return NextResponse.json({
            success: true,
            ...result.insights,
            upsellOpportunities: result.upsellOpportunities,
            timestamp: new Date().toISOString(),
            autonomous: true
        })
    } catch (error: unknown) {
        console.error("Revenue insights error:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to get revenue insights" },
            { status: 500 }
        )
    }
}

/**
 * 🎯 Manual trigger for revenue optimization
 */
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const result = await globalRevenueOptimizer.runOptimizationCycle()

        return NextResponse.json({
            success: true,
            message: "Revenue optimization cycle completed",
            ...result,
            timestamp: new Date().toISOString()
        })
    } catch (error: unknown) {
        console.error("Revenue optimization error:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Optimization failed" },
            { status: 500 }
        )
    }
}
