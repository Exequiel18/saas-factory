import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { globalGrowthHacker } from "@/lib/growth-hacking"

/**
 * 🚀 Growth Hacking Control Center
 */
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { action, targetRevenue } = body

        let result

        switch (action) {
            case 'start_campaign':
                result = await globalGrowthHacker.executeRapidCampaign(targetRevenue || 100000)
                break

            case 'auto_execute':
                result = await globalGrowthHacker.autoExecuteTactics()
                break

            case 'generate_plan':
                result = await globalGrowthHacker.generateRapidGrowthPlan()
                break

            default:
                return NextResponse.json({ error: "Invalid action" }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            action,
            result,
            timestamp: new Date().toISOString()
        })
    } catch (error: unknown) {
        console.error("Growth hacking error:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Growth hacking failed" },
            { status: 500 }
        )
    }
}

/**
 * 📊 Get Growth Campaign Status
 */
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const plan = await globalGrowthHacker.generateRapidGrowthPlan()
        const viralLoops = await globalGrowthHacker.createViralLoop()
        const quickMoney = await globalGrowthHacker.executeQuickMonetization()

        return NextResponse.json({
            success: true,
            plan,
            viralLoops,
            quickMoney,
            timestamp: new Date().toISOString()
        })
    } catch (error: unknown) {
        console.error("Growth status error:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to get status" },
            { status: 500 }
        )
    }
}
