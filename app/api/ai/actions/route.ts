import { NextRequest, NextResponse } from "next/server"
import { sendSignalToN8n } from "@/lib/n8n"
import {
    saveAutonomousDecision,
    saveSystemLearning,
    saveActionExecution,
    saveMetricHistory
} from "@/lib/supabase"

/**
 * 🤖 API de Acciones Autónomas para n8n
 * 
 * Este endpoint permite que n8n ejecute acciones en el SaaS Factory
 * después de tomar decisiones basadas en las métricas.
 * 
 * n8n actúa como "manos y pies" de Antigravity, ejecutando acciones
 * que no puedo hacer directamente desde el código.
 */

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { action, parameters, source } = body

        // Validar que la petición viene de n8n
        if (source !== "n8n_autonomous_system") {
            return NextResponse.json(
                { error: "Unauthorized source" },
                { status: 401 }
            )
        }

        // Ejecutar acción según el tipo
        let result
        switch (action) {
            case "send_whatsapp":
                result = await executeWhatsAppAction(parameters)
                break

            case "send_email":
                result = await executeEmailAction(parameters)
                break

            case "create_campaign":
                result = await executeCreateCampaign(parameters)
                break

            case "update_pricing":
                result = await executeUpdatePricing(parameters)
                break

            case "trigger_webhook":
                result = await executeTriggerWebhook(parameters)
                break

            case "log_decision":
                result = await executeLogDecision(parameters)
                break

            case "self_improve":
                result = await executeSelfImprovement(parameters)
                break

            default:
                return NextResponse.json(
                    { error: `Unknown action: ${action}` },
                    { status: 400 }
                )
        }

        // Registrar la acción ejecutada
        await logActionExecution(action, parameters, result)

        return NextResponse.json({
            success: true,
            action,
            result,
            timestamp: new Date().toISOString()
        })

    } catch (error) {
        console.error("[AI Actions API] Error:", error)
        return NextResponse.json(
            {
                error: "Failed to execute action",
                message: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        )
    }
}

/**
 * Ejecutar acción de WhatsApp
 */
async function executeWhatsAppAction(params: any) {
    const { to, message, template } = params

    // n8n se encargará de enviar el mensaje real
    // Aquí solo preparamos la respuesta
    return {
        status: "queued",
        recipient: to,
        message: message || template,
        channel: "whatsapp"
    }
}

/**
 * Ejecutar acción de Email
 */
async function executeEmailAction(params: any) {
    const { to, subject, body, template } = params

    return {
        status: "queued",
        recipient: to,
        subject,
        channel: "email"
    }
}

/**
 * Crear campaña de marketing
 */
async function executeCreateCampaign(params: any) {
    const { type, segment, channel, content } = params

    // Guardar campaña en base de datos - simulado por ahora, pero registrado via action execution
    // En el futuro, esto podría crear un registro en una tabla 'campaigns'

    return {
        status: "created",
        campaignId: `campaign_${Date.now()}`,
        type,
        segment,
        channel
    }
}

/**
 * Actualizar pricing dinámicamente
 */
async function executeUpdatePricing(params: any) {
    const { plan, newPrice, reason } = params

    // Registrar intención de cambio de precio
    // Esto se guarda como action execution, que sirve de log de auditoría

    // También podríamos guardar una sugerencia de aprendizaje
    await saveSystemLearning({
        learningType: "pricing_optimization",
        insight: `Suggestion to change ${plan} price to ${newPrice}: ${reason}`,
        dataSource: "market_analysis",
        confidence: 0.85
    })

    return {
        status: "pending_approval",
        plan,
        currentPrice: 5000, // Placeholder
        newPrice,
        reason
    }
}

/**
 * Trigger webhook externo
 */
async function executeTriggerWebhook(params: any) {
    const { url, method, payload } = params

    try {
        const response = await fetch(url, {
            method: method || "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })

        return {
            status: response.ok ? "success" : "failed",
            statusCode: response.status
        }
    } catch (error) {
        return {
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error"
        }
    }
}

/**
 * Registrar decisión autónoma
 */
async function executeLogDecision(params: any) {
    const { decision, reasoning, metrics, confidence } = params

    // Guardar en Supabase tabla "autonomous_decisions"
    await saveAutonomousDecision({
        decisionType: decision,
        reasoning,
        metricsSnapshot: metrics,
        confidenceScore: confidence || 0.9,
        result: { status: "logged_via_api" }
    })

    return {
        status: "logged",
        decisionId: `decision_${Date.now()}`,
        decision,
        confidence
    }
}

/**
 * Auto-mejora del sistema
 */
async function executeSelfImprovement(params: any) {
    const { learningType, insight, dataSource, confidence } = params

    // Guardar en Supabase tabla "system_learnings"
    await saveSystemLearning({
        learningType,
        insight,
        dataSource,
        confidence: confidence || 0.8
    })

    return {
        status: "learning_stored",
        learningId: `learning_${Date.now()}`,
        type: learningType,
        confidence
    }
}

/**
 * Registrar ejecución de acción
 */
async function logActionExecution(action: string, params: any, result: any) {
    // Guardar en Supabase tabla "action_executions"
    try {
        await saveActionExecution({
            actionType: action,
            parameters: params,
            result,
            source: "n8n_autonomous_system",
            status: result.status === "error" ? "failed" : "success"
        })
    } catch (e) {
        console.error("Failed to log action execution to Supabase", e)
    }

    console.log(`[AI Action Executed] ${action}`, {
        params,
        result,
        timestamp: new Date().toISOString()
    })

    // Enviar señal a n8n de que la acción se ejecutó (opcional, para cerrar bucles)
    // En este caso lo comentamos para evitar bucles infinitos si n8n nos llama
    /*
    await sendSignalToN8n("action_executed", {
        action,
        result,
        timestamp: new Date().toISOString()
    })
    */
}
