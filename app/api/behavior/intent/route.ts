import { NextResponse } from "next/server"
import { globalBehaviorPsychology } from "@/lib/behavior-psychology"

/**
 * 🧠 Track behavioral signals and predict purchase intent
 * This endpoint receives user behavior data and returns purchase intent prediction
 */

export const dynamic = 'force-dynamic'
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { conversions, userContext } = body

        if (!conversions || !Array.isArray(conversions)) {
            return NextResponse.json({ error: "Conversions array required" }, { status: 400 })
        }

        // Detect psychological signals
        const signals = globalBehaviorPsychology.detectPsychologicalSignals(conversions)

        // Predict purchase intent
        const intent = globalBehaviorPsychology.predictPurchaseIntent(signals, userContext)

        // Return prediction with actionable offer
        return NextResponse.json({
            success: true,
            intent,
            signals: signals.map(s => ({
                type: s.type,
                intensity: s.intensity,
                pattern: s.context.pattern
            })),
            recommendation: {
                showOffer: intent.emotionalState === 'hot' || intent.emotionalState === 'burning',
                offer: intent.optimalOffer,
                timing: intent.emotionalState === 'burning' ? 'immediate' : 'within_5_minutes'
            },
            timestamp: new Date().toISOString()
        })
    } catch (error: unknown) {
        console.error("Behavior tracking error:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Tracking failed" },
            { status: 500 }
        )
    }
}

/**
 * 📊 Get behavioral patterns and insights
 */
export async function GET(request: Request) {
    try {
        const analysis = await globalBehaviorPsychology.analyzeActiveSessions()

        return NextResponse.json({
            success: true,
            ...analysis,
            timestamp: new Date().toISOString()
        })
    } catch (error: unknown) {
        console.error("Behavior analysis error:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Analysis failed" },
            { status: 500 }
        )
    }
}
