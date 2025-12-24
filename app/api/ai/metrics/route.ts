import { NextRequest, NextResponse } from "next/server"
import { globalCriticalMetricsCollector } from "@/lib/critical-metrics"
import { getBusinessMetrics } from "@/lib/metrics"
import { prisma } from "@/lib/prisma"

/**
 * 🤖 API para Motor de Decisiones de IA (n8n)
 * 
 * Este endpoint proporciona métricas críticas y de negocio
 * para que el motor de IA en n8n tome decisiones autónomas.
 */


export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
    try {
        // Obtener organización (simplificado: primera organización o crear una demo)
        let organization = await prisma.organization.findFirst()

        if (!organization) {
            // Crear organización demo para métricas
            organization = await prisma.organization.create({
                data: {
                    name: "SaaS Factory",
                    slug: "saas-factory"
                }
            })
        }

        // 1. Recolectar métricas críticas
        const criticalMetrics = await globalCriticalMetricsCollector.collectMetrics()

        // 2. Recolectar métricas de negocio
        const businessMetrics = await getBusinessMetrics(organization.id)

        // 3. Calcular estado general del sistema
        const systemHealth = calculateSystemHealth(criticalMetrics, businessMetrics)

        // 4. Generar recomendaciones autónomas
        const recommendations = generateRecommendations(criticalMetrics, businessMetrics, systemHealth)

        // 5. Preparar respuesta optimizada para n8n
        const response = {
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV === "production" ? "production" : "simulation",

            // Estado general
            systemHealth: {
                status: systemHealth.status,
                score: systemHealth.score,
                level: systemHealth.level
            },

            // Métricas críticas
            criticalMetrics: {
                usersReturningWithoutEmail: criticalMetrics.usersReturningWithoutEmail.percentage,
                lowScoreUpsellVisibility: criticalMetrics.lowScoreUpsellVisibility.percentage,
                lowScoreUpsellConversion: criticalMetrics.lowScoreUpsellConversion.percentage,
                riskToAttentionTime: criticalMetrics.riskToAttentionTime.averageDays,
                highScoreAbandonment: criticalMetrics.highScoreAbandonment.percentage
            },

            // Métricas de negocio
            businessMetrics: businessMetrics.reduce((acc, metric) => {
                acc[metric.name.replace(/\s+/g, '_').toLowerCase()] = {
                    value: metric.value,
                    unit: metric.unit,
                    status: metric.status
                }
                return acc
            }, {} as Record<string, any>),

            // Recomendaciones para IA
            recommendations: recommendations,

            // Acciones sugeridas
            suggestedActions: generateActions(systemHealth, recommendations),

            // Metadata para debugging
            metadata: {
                totalUsers: await prisma.user.count(),
                activeSubscriptions: await prisma.subscription.count({ where: { status: "active" } }),
                totalRevenue: await getTotalRevenue(organization.id),
                lastPayment: await getLastPaymentDate(organization.id)
            }
        }

        return NextResponse.json(response, { status: 200 })

    } catch (error) {
        console.error("[AI Metrics API] Error:", error)
        return NextResponse.json(
            {
                error: "Failed to collect metrics",
                message: error instanceof Error ? error.message : "Unknown error",
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        )
    }
}

/**
 * Calcular salud general del sistema
 */
function calculateSystemHealth(criticalMetrics: any, businessMetrics: any[]) {
    let score = 100

    // Penalizar por métricas críticas malas
    if (criticalMetrics.usersReturningWithoutEmail.percentage > 50) score -= 20
    if (criticalMetrics.lowScoreUpsellConversion.percentage < 5) score -= 15
    if (criticalMetrics.highScoreAbandonment.percentage > 30) score -= 25
    if (criticalMetrics.riskToAttentionTime.averageDays > 7) score -= 10

    // Penalizar por métricas de negocio malas
    const badMetrics = businessMetrics.filter(m => m.status === "bad").length
    score -= badMetrics * 5

    // Determinar nivel
    let level: "CRITICAL" | "WARNING" | "ATTENTION" | "HEALTHY" | "OPTIMAL"
    if (score >= 90) level = "OPTIMAL"
    else if (score >= 70) level = "HEALTHY"
    else if (score >= 50) level = "ATTENTION"
    else if (score >= 30) level = "WARNING"
    else level = "CRITICAL"

    return {
        score: Math.max(0, score),
        status: score >= 70 ? "good" : score >= 50 ? "neutral" : "bad",
        level
    }
}

/**
 * Generar recomendaciones autónomas
 */
function generateRecommendations(criticalMetrics: any, businessMetrics: any[], systemHealth: any) {
    const recommendations = []

    // Recomendaciones basadas en métricas críticas
    if (criticalMetrics.usersReturningWithoutEmail.percentage > 50) {
        recommendations.push({
            priority: "HIGH",
            category: "retention",
            action: "Implementar sistema de notificaciones push o SMS",
            reason: `${criticalMetrics.usersReturningWithoutEmail.percentage.toFixed(1)}% de usuarios vuelven sin recibir email`,
            impact: "Aumentar retención en 20-30%"
        })
    }

    if (criticalMetrics.lowScoreUpsellConversion.percentage < 5) {
        recommendations.push({
            priority: "HIGH",
            category: "monetization",
            action: "Optimizar copy y diseño del upsell",
            reason: `Solo ${criticalMetrics.lowScoreUpsellConversion.percentage.toFixed(1)}% de conversión en upsells`,
            impact: "Aumentar ingresos en 15-25%"
        })
    }

    if (criticalMetrics.highScoreAbandonment.percentage > 30) {
        recommendations.push({
            priority: "CRITICAL",
            category: "retention",
            action: "Activar campaña de re-engagement para usuarios de alto score",
            reason: `${criticalMetrics.highScoreAbandonment.percentage.toFixed(1)}% de usuarios con score alto abandonan`,
            impact: "Recuperar 40-50% de usuarios perdidos"
        })
    }

    // Recomendaciones basadas en métricas de negocio
    const netMargin = businessMetrics.find(m => m.name === "Margen de Beneficio Neto")
    if (netMargin && netMargin.status === "bad") {
        recommendations.push({
            priority: "HIGH",
            category: "profitability",
            action: "Revisar estructura de costos y pricing",
            reason: `Margen neto en ${netMargin.value.toFixed(1)}%`,
            impact: "Mejorar rentabilidad en 10-15%"
        })
    }

    const retention = businessMetrics.find(m => m.name === "Tasa de Retención")
    if (retention && retention.value < 80) {
        recommendations.push({
            priority: "MEDIUM",
            category: "retention",
            action: "Implementar programa de fidelización",
            reason: `Retención en ${retention.value.toFixed(1)}%`,
            impact: "Aumentar LTV en 20-30%"
        })
    }

    return recommendations
}

/**
 * Generar acciones ejecutables
 */
function generateActions(systemHealth: any, recommendations: any[]) {
    const actions = []

    // Acciones basadas en salud del sistema
    if (systemHealth.level === "CRITICAL") {
        actions.push({
            type: "alert",
            target: "owner",
            message: "Sistema en estado CRÍTICO - Requiere atención inmediata",
            channel: "whatsapp"
        })
    }

    // Acciones basadas en recomendaciones de alta prioridad
    const highPriorityRecs = recommendations.filter(r => r.priority === "HIGH" || r.priority === "CRITICAL")

    if (highPriorityRecs.length > 0) {
        actions.push({
            type: "notification",
            target: "admin",
            message: `${highPriorityRecs.length} acciones de alta prioridad requieren atención`,
            channel: "email"
        })
    }

    // Acción autónoma: activar campaña de re-engagement
    const reengagementRec = recommendations.find(r => r.action.includes("re-engagement"))
    if (reengagementRec) {
        actions.push({
            type: "automation",
            target: "marketing",
            action: "trigger_reengagement_campaign",
            parameters: {
                segment: "high_score_abandoned",
                channel: "email_whatsapp"
            }
        })
    }

    return actions
}

/**
 * Obtener revenue total
 */
async function getTotalRevenue(organizationId: string) {
    const result = await prisma.payment.aggregate({
        where: {
            subscription: { organizationId },
            status: "approved"
        },
        _sum: { amount: true }
    })
    return result._sum.amount || 0
}

/**
 * Obtener fecha del último pago
 */
async function getLastPaymentDate(organizationId: string) {
    const lastPayment = await prisma.payment.findFirst({
        where: {
            subscription: { organizationId },
            status: "approved"
        },
        orderBy: { createdAt: "desc" }
    })
    return lastPayment?.createdAt.toISOString() || null
}
