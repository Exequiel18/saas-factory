import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { globalPredictiveAnalytics } from "@/lib/predictive-analytics"

/**
 * 🔮 Get Predictive Analytics
 */

export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type') || 'full'

        let result

        switch (type) {
            case 'forecast':
                const period = (searchParams.get('period') || 'monthly') as 'daily' | 'weekly' | 'monthly'
                result = await globalPredictiveAnalytics.forecastRevenue(period)
                break

            case 'churn':
                result = await globalPredictiveAnalytics.predictChurn()
                break

            case 'conversions':
                result = await globalPredictiveAnalytics.predictConversions()
                break

            case 'full':
            default:
                result = await globalPredictiveAnalytics.runFullAnalysis()
                break
        }

        return NextResponse.json({
            success: true,
            type,
            data: result,
            timestamp: new Date().toISOString()
        })
    } catch (error: unknown) {
        console.error("Predictive analytics error:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Analysis failed" },
            { status: 500 }
        )
    }
}
