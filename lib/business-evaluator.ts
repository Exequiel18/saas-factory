/**
 * 🎯 SISTEMA DE EVALUACIÓN CONTINUA
 * 
 * El núcleo del producto: "Mira tu negocio por ti"
 * 
 * INPUT: Métricas, historial, comportamiento, pagos
 * PROCESO: Normalizar, comparar, detectar tendencias, evaluar riesgo
 * OUTPUT: Score (0-100), Estado (OK/ATENCIÓN/RIESGO), Alerta principal, Acción concreta
 */

import { prisma } from "./prisma"
import { getBusinessMetrics, MetricResult } from "./metrics"

export type BusinessStatus = "OK" | "ATENCIÓN" | "RIESGO"

export interface BusinessEvaluation {
  score: number // 0-100
  status: BusinessStatus
  alert: string // Una sola alerta principal
  action: string // Acción concreta y corta
  trend: "mejorando" | "estable" | "empeorando"
  comparison: string // Comparación social suave
  lastEvaluated: Date
}

export interface EvaluationContext {
  organizationId: string
  metrics: MetricResult[]
  revenue: number
  expenses: number
  netMargin: number
  breakEven: number
  retentionRate: number
  daysSinceLastPayment: number
  subscriptionStatus: string
}

/**
 * 🧠 EVALUADOR PRINCIPAL
 * 
 * Lógica determinista:
 * - SI pierde plata → RIESGO
 * - SI empata pero no crece → ATENCIÓN
 * - SI crece ordenado → OK
 */
export class BusinessEvaluator {
  /**
   * Evaluar negocio completo
   * Aplica defensas del score para evitar abuso y aburrimiento
   */
  async evaluate(organizationId: string): Promise<BusinessEvaluation> {
    const context = await this.buildContext(organizationId)
    const baseScore = this.calculateScore(context)

    // Aplicar defensas del score (evitar score plano, controlar inflación)
    const { globalScoreDefenseSystem } = await import("./score-defense")
    const baseEvaluation: BusinessEvaluation = {
      score: Math.round(baseScore),
      status: this.determineStatus(context, baseScore),
      alert: "",
      action: "",
      trend: await this.detectTrend(context),
      comparison: "",
      lastEvaluated: new Date()
    }

    const scoreVariation = await globalScoreDefenseSystem.applyScoreDefenses(
      organizationId,
      baseEvaluation
    )

    const finalScore = scoreVariation.adjustedScore
    let status = this.determineStatus(context, finalScore)

    // REGLA ABSOLUTA: Si margen negativo 2 meses seguidos → Nunca OK
    const twoMonthMarginNegative = await this.checkTwoMonthMarginRule(organizationId)
    if (twoMonthMarginNegative && status === "OK") {
      status = "RIESGO" // Forzar RIESGO aunque score sea alto
    }

    const { alert, action } = this.generateAlertAndAction(context, status, finalScore)
    const trend = await this.detectTrend(context)
    const comparison = this.generateComparison(context, status)

    return {
      score: Math.round(finalScore),
      status,
      alert,
      action,
      trend,
      comparison,
      lastEvaluated: new Date()
    }
  }

  /**
   * Construir contexto de evaluación
   */
  private async buildContext(organizationId: string): Promise<EvaluationContext> {
    // Obtener métricas
    const metrics = await getBusinessMetrics(organizationId)

    // Obtener ingresos del mes actual
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const payments = await prisma.payment.aggregate({
      where: {
        subscription: { organizationId },
        status: "approved",
        createdAt: { gte: startOfMonth }
      },
      _sum: { amount: true }
    })
    const revenue = payments._sum.amount || 0

    // Obtener gastos del mes actual
    const expenses = await prisma.expense.aggregate({
      where: {
        organizationId,
        date: { gte: startOfMonth }
      },
      _sum: { amount: true }
    })
    const totalExpenses = expenses._sum.amount || 0

    // Calcular margen neto
    const netMargin = revenue > 0 ? ((revenue - totalExpenses) / revenue) * 100 : 0

    // Obtener break-even
    const breakEvenMetric = metrics.find(m => m.name === "Punto de Equilibrio")
    const breakEven = breakEvenMetric?.value || 0

    // Obtener retención
    const retentionMetric = metrics.find(m => m.name === "Tasa de Retención")
    const retentionRate = retentionMetric?.value || 100

    // Días desde último pago
    const lastPayment = await prisma.payment.findFirst({
      where: {
        subscription: { organizationId },
        status: "approved"
      },
      orderBy: { createdAt: "desc" }
    })
    const daysSinceLastPayment = lastPayment
      ? Math.floor((now.getTime() - lastPayment.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      : 999

    // Estado de suscripción
    const subscription = await prisma.subscription.findFirst({
      where: { organizationId }
    })
    const subscriptionStatus = subscription?.status || "inactive"

    return {
      organizationId,
      metrics,
      revenue,
      expenses: totalExpenses,
      netMargin,
      breakEven,
      retentionRate,
      daysSinceLastPayment,
      subscriptionStatus
    }
  }

  /**
   * Calcular score (0-100)
   * 
   * MÉTRICA REINA: Margen Neto (40% del peso total)
   * Si el margen es negativo, el score nunca puede ser alto.
   * Define el negocio: sin margen positivo, no hay negocio sostenible.
   */
  private calculateScore(context: EvaluationContext): number {
    let score = 50 // Base neutral

    // MÉTRICA REINA: Margen neto (peso: 40% - define el negocio)
    if (context.netMargin > 20) score += 25
    else if (context.netMargin > 10) score += 15
    else if (context.netMargin > 0) score += 8
    else if (context.netMargin < -10) score -= 35 // Penalización fuerte
    else if (context.netMargin < 0) score -= 20 // Penalización fuerte

    // Break-even (peso: 20%)
    if (context.revenue >= context.breakEven * 1.2) score += 12
    else if (context.revenue >= context.breakEven) score += 8
    else if (context.revenue >= context.breakEven * 0.8) score += 4
    else if (context.revenue < context.breakEven) score -= 15

    // Retención (peso: 15%)
    if (context.retentionRate > 90) score += 10
    else if (context.retentionRate > 80) score += 7
    else if (context.retentionRate > 70) score += 4
    else if (context.retentionRate < 50) score -= 12

    // Tendencias de ingresos (peso: 15%)
    if (context.daysSinceLastPayment === 0) score += 8
    else if (context.daysSinceLastPayment < 7) score += 4
    else if (context.daysSinceLastPayment < 30) score += 0
    else if (context.daysSinceLastPayment > 60) score -= 10

    // Estado de suscripción (peso: 10%)
    if (context.subscriptionStatus === "active") score += 7
    else if (context.subscriptionStatus === "pending") score += 3
    else score -= 7

    return Math.max(0, Math.min(100, score))
  }

  /**
   * Determinar estado (OK/ATENCIÓN/RIESGO)
   * 
   * REGLA ABSOLUTA: Si margen negativo 2 meses seguidos → Nunca OK
   * "Podés ordenar todo, pero si no ganás plata, no está bien"
   */
  private determineStatus(context: EvaluationContext, score: number): BusinessStatus {
    // Reglas deterministas normales
    // REGLA ABSOLUTA: Si margen negativo → Nunca OK (se verifica en buildContext)
    if (context.netMargin < 0) return "RIESGO" // Pierde plata
    if (context.revenue < context.breakEven) return "RIESGO" // No alcanza break-even
    if (score < 40) return "RIESGO"
    if (score < 70) return "ATENCIÓN"
    return "OK"
  }

  /**
   * Verificar si margen negativo 2 meses seguidos (regla absoluta)
   */
  private async checkTwoMonthMarginRule(organizationId: string): Promise<boolean> {
    const twoMonthsAgo = new Date()
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)

    const lastTwoMonthsExpenses = await prisma.expense.aggregate({
      where: {
        organizationId,
        date: { gte: twoMonthsAgo }
      },
      _sum: { amount: true }
    })

    const lastTwoMonthsPayments = await prisma.payment.aggregate({
      where: {
        subscription: { organizationId },
        status: "approved",
        createdAt: { gte: twoMonthsAgo }
      },
      _sum: { amount: true }
    })

    const totalRevenue = lastTwoMonthsPayments._sum.amount || 0
    const totalExpenses = lastTwoMonthsExpenses._sum.amount || 0
    const twoMonthMargin = totalRevenue - totalExpenses

    // REGLA ABSOLUTA: Margen negativo 2 meses seguidos → Nunca OK
    return twoMonthMargin < 0 && totalRevenue > 0
  }

  /**
   * Generar alerta principal y acción concreta
   * MENSAJES CON CALLE ARGENTINA - No agresivo, no tibio, real
   */
  private generateAlertAndAction(
    context: EvaluationContext,
    status: BusinessStatus,
    score: number
  ): { alert: string; action: string } {
    // RIESGO: Prioridad máxima - Mensajes que duelen pero ayudan
    if (status === "RIESGO") {
      if (context.netMargin < 0) {
        return {
          alert: "Así no llegás cómodo a fin de mes. Los gastos superan los ingresos y estás perdiendo plata.",
          action: "Revisá costos fijos y variables. Reducí gastos no esenciales esta semana."
        }
      }
      if (context.revenue < context.breakEven) {
        return {
          alert: "No estás alcanzando tu punto de equilibrio. Esto hoy no te mata, pero te va a cansar.",
          action: `Necesitás generar $${Math.round(context.breakEven - context.revenue)} más este mes para estar seguro.`
        }
      }
      if (context.retentionRate < 50) {
        return {
          alert: "Estás perdiendo más clientes de los que ganás. Acá estás perdiendo más por desorden que por ventas.",
          action: "Contactá a 3 clientes que dejaron de pagar esta semana. Preguntales qué pasó."
        }
      }
      return {
        alert: "Tu negocio necesita atención urgente. Score bajo significa riesgo real.",
        action: "Revisá todas las métricas y tomá acción en las 3 más críticas hoy."
      }
    }

    // ATENCIÓN: Oportunidades de mejora - Mensajes que activan sin asustar
    if (status === "ATENCIÓN") {
      if (context.netMargin < 10) {
        return {
          alert: "Tu margen neto es bajo. Hay espacio para optimizar antes de que se convierta en problema.",
          action: "Identificá 2 costos variables que puedas reducir 10% este mes."
        }
      }
      if (context.revenue < context.breakEven * 1.1) {
        return {
          alert: "Estás cerca del punto de equilibrio. Un mes malo puede ser crítico.",
          action: "Aumentá ingresos 15% o reducí costos fijos 10% este mes."
        }
      }
      if (context.daysSinceLastPayment > 30) {
        return {
          alert: "No recibiste ingresos recientes. La recurrencia es clave para sostenerse.",
          action: "Activá una campaña de reactivación para clientes inactivos esta semana."
        }
      }
      return {
        alert: "Tu negocio está estable pero puede mejorar. Score medio significa que estás sobreviviendo, no creciendo.",
        action: "Revisá una métrica por día y tomá una acción pequeña. Los cambios chicos suman."
      }
    }

    // OK: Mantener y optimizar - Mensajes que refuerzan
    return {
      alert: "Tu negocio está saludable. Seguí monitoreando para mantener el crecimiento.",
      action: "Mantené el ritmo actual y buscá oportunidades de crecimiento 10% este mes."
    }
  }

  /**
   * Detectar tendencia
   */
  private async detectTrend(context: EvaluationContext): Promise<"mejorando" | "estable" | "empeorando"> {
    // Comparar mes actual vs mes anterior
    const now = new Date()
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    // Ingresos mes actual
    const currentRevenue = context.revenue

    // Ingresos mes anterior
    const lastMonthPayments = await prisma.payment.aggregate({
      where: {
        subscription: { organizationId: context.organizationId },
        status: "approved",
        createdAt: {
          gte: startOfLastMonth,
          lt: startOfCurrentMonth
        }
      },
      _sum: { amount: true }
    })
    const lastMonthRevenue = lastMonthPayments._sum.amount || 0

    // Comparar con mes anterior
    if (currentRevenue === 0 && lastMonthRevenue === 0) return "estable"
    if (currentRevenue > lastMonthRevenue * 1.1) return "mejorando"
    if (currentRevenue < lastMonthRevenue * 0.9) return "empeorando"
    return "estable"
  }

  /**
   * Generar comparación social suave
   */
  private generateComparison(context: EvaluationContext, status: BusinessStatus): string {
    if (status === "RIESGO") {
      return "La mayoría de negocios como el tuyo ya corrigieron esto antes de generar pérdidas."
    }
    if (status === "ATENCIÓN") {
      return "Este punto suele corregirse antes de que se convierta en un problema mayor."
    }
    return "Estás en el rango superior de negocios similares. Sigue así."
  }

  /**
   * Evaluar múltiples organizaciones (para dashboard principal)
   */
  async evaluateAll(organizationIds: string[]): Promise<Map<string, BusinessEvaluation>> {
    const evaluations = new Map<string, BusinessEvaluation>()

    for (const orgId of organizationIds) {
      try {
        const evaluation = await this.evaluate(orgId)
        evaluations.set(orgId, evaluation)
      } catch (error) {
        console.error(`Error evaluating organization ${orgId}:`, error)
      }
    }

    return evaluations
  }
}

/**
 * 🌍 Instancia global
 */
export const globalBusinessEvaluator = new BusinessEvaluator()

