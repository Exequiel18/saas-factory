import { NextResponse } from "next/server"
import { supabaseAdmin, saveAutonomousDecision, saveSystemLog } from "@/lib/supabase"
import { sendSignalToN8n, sendAIMetricsToN8n } from "@/lib/n8n"

/**
 * 🛰️ Autonomous Nervous System - Loop Vital
 * 
 * Este endpoint es el "latido" del sistema. Se dispara vía cron (n8n/vercel)
 * y realiza acciones sin intervención humana:
 * 1. Monitorear salud operativa.
 * 2. Detectar cuellos de botella en el Quality Guard.
 * 3. Identificar leads con alto interés y pasar a n8n.
 * 4. Guardar aprendizajes para auto-mejora.
 */
export async function GET() {
    try {
        const logs = []
        const decisions = []

        // --- 1. HEALTH CHECK AUTÓNOMO ---
        const { count: actionCount, error: actionError } = await supabaseAdmin
            .from('action_executions')
            .select('*', { count: 'exact', head: true })

        if (actionError) throw actionError

        // Trigger AI Evaluation (Total Independence Loop)
        const metricsSent = await sendAIMetricsToN8n()
        logs.push(`System Healthy. Total executions: ${actionCount}. AI Metrics Sent: ${metricsSent}`)

        // --- 2. DETECCIÓN DE CUELLOS DE BOTELLA (Quality Guard) ---
        // Buscamos si hubo muchos rechazos en la última hora
        const oneHourAgo = new Date(Date.now() - 3600000).toISOString()
        const { count: rejectionCount } = await supabaseAdmin
            .from('system_logs')
            .select('*', { count: 'exact', head: true })
            .eq('level', 'warn')
            .eq('source', 'Quality Guard')
            .gte('created_at', oneHourAgo)

        if ((rejectionCount || 0) > 5) {
            const decision = await saveAutonomousDecision({
                decisionType: "quality_threshold_adjustment",
                reasoning: `Se detectaron ${rejectionCount} rechazos del Quality Guard en la última hora. El sistema está siendo demasiado estricto o la entrada del usuario es pobre.`,
                metricsSnapshot: { rejections: rejectionCount },
                confidenceScore: 0.9,
                industry: "all"
            })
            decisions.push(decision)

            // Alertar a n8n para que VIPER analice si hay que ajustar los prompts
            await sendSignalToN8n("quality_alert", {
                rejections: rejectionCount,
                message: "High rejection rate in Quality Guard. Analysis required."
            })
        }

        // --- 3. AUTO-VENTA (Paywall Hits detection) ---
        const { count: paywallHits } = await supabaseAdmin
            .from('system_logs')
            .select('*', { count: 'exact', head: true })
            .eq('source', 'Revenue Guard')
            .gte('created_at', oneHourAgo)

        if ((paywallHits || 0) > 0) {
            await sendSignalToN8n("sales_intent_loop", {
                hits: paywallHits,
                message: `Detected ${paywallHits} paywall blocks in the last hour. Humans are hungry for the tool.`
            })
        }

        // --- FINALIZAR LATIDO ---
        await saveSystemLog({
            level: 'info',
            source: 'Autonomous Heartbeat',
            message: `Heartbeat completed. ${decisions.length} decisions made.`,
            metadata: { logs, decisions }
        })

        return NextResponse.json({
            status: "alive",
            decisionsMade: decisions.length,
            heartbeat: new Date().toISOString()
        })

    } catch (error: any) {
        console.error("[Autonomous Heartbeat] Failed:", error)
        await saveSystemLog({
            level: 'error',
            source: 'Autonomous Heartbeat',
            message: `Heartbeat FAILED: ${error.message}`,
            metadata: { error }
        })
        return NextResponse.json({ error: "Heartbeat failed" }, { status: 500 })
    }
}
