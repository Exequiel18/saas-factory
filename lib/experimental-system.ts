/**
 * 🧪 SISTEMA DE EXPERIMENTACIÓN AUTÓNOMA
 * 
 * El sistema puede crear, probar y mutar,
 * pero nunca puede romper el núcleo que hoy decide, alerta, vende y retiene.
 * 
 * Todo lo nuevo debe rodear, no reemplazar, al core.
 */

import { prisma } from "./prisma"

export type ExperimentStatus = "active" | "paused" | "archived" | "promoted"

export interface Experiment {
  id: string
  name: string
  description: string
  type: "feature" | "metric" | "alert" | "automation" | "flow" | "product_idea"
  status: ExperimentStatus
  experimental: boolean // Siempre true al inicio
  impactMetrics: {
    revenue?: number
    retention?: number
    engagement?: number
    conversion?: number
  }
  createdAt: Date
  lastEvaluated: Date
  evaluationCount: number
  metadata: Record<string, unknown>
}

export class ExperimentalSystem {
  /**
   * Crear nuevo experimento
   * Todo lo nuevo nace como experimental = true
   * 
   * CADENCIA: Máximo 1 experimento nuevo por semana
   * MÁXIMO ACTIVOS: 3 experimentos activos simultáneos
   */
  async createExperiment(
    name: string,
    description: string,
    type: Experiment["type"],
    metadata: Record<string, unknown> = {}
  ): Promise<Experiment | null> {
    // Verificar cadencia: máximo 1 por semana
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const recentExperiments = await prisma.systemLog.count({
      where: {
        source: "experimental_system",
        metadata: {
          contains: `"action":"created"`
        },
        createdAt: { gte: oneWeekAgo }
      }
    })

    if (recentExperiments >= 1) {
      // Ya se creó 1 esta semana
      await this.logExperiment({
        id: "cadence-check",
        name,
        type,
        description,
        status: "active",
        experimental: true,
        impactMetrics: {},
        createdAt: new Date(),
        lastEvaluated: new Date(),
        evaluationCount: 0,
        metadata: {}
      }, "rejected_cadence")
      return null
    }

    // Verificar máximo activos: máximo 3 simultáneos
    const activeExperiments = await this.listActiveExperiments()
    if (activeExperiments.length >= 3) {
      // Ya hay 3 activos, no crear hasta promover o archivar
      await this.logExperiment({
        id: "max-active-check",
        name,
        type,
        description,
        status: "active",
        experimental: true,
        impactMetrics: {},
        createdAt: new Date(),
        lastEvaluated: new Date(),
        evaluationCount: 0,
        metadata: {}
      }, "rejected_max_active")
      return null
    }
    const experiment: Experiment = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      type,
      status: "active",
      experimental: true, // Siempre true al inicio
      impactMetrics: {},
      createdAt: new Date(),
      lastEvaluated: new Date(),
      evaluationCount: 0,
      metadata
    }

    // Loggear creación
    await this.logExperiment(experiment, "created")

    return experiment
  }

  /**
   * Evaluar experimento basado en datos
   */
  async evaluateExperiment(experimentId: string): Promise<{
    shouldPromote: boolean
    shouldArchive: boolean
    shouldPause: boolean
    reason: string
  }> {
    const experiment = await this.getExperiment(experimentId)
    if (!experiment) {
      return {
        shouldPromote: false,
        shouldArchive: true,
        shouldPause: false,
        reason: "Experiment not found"
      }
    }

    // Obtener métricas críticas
    const { globalCriticalMetricsCollector } = await import("./critical-metrics")
    const criticalMetrics = await globalCriticalMetricsCollector.collectMetrics()

    // Evaluar impacto
    const impact = this.calculateImpact(experiment, criticalMetrics)

    // Verificar kill-switch primero
    const killed = await this.checkKillSwitch(experimentId)
    if (killed) {
      return {
        shouldPromote: false,
        shouldArchive: false,
        shouldPause: true,
        reason: "Kill-switch activado: empeoró 2+ métricas críticas en 7 días"
      }
    }

    // Decidir acción
    let shouldPromote = false
    let shouldArchive = false
    let shouldPause = false
    let reason = ""

    // UMBRALES DE PROMOCIÓN (CLAROS Y DUROS):
    // - ↑ Ingresos o ↑ Retención ≥ +5% sostenido
    // - 0 impactos negativos en el loop de dinero
    // - Completa ≥ 5 evaluaciones con datos reales
    const revenueImprovement = impact.revenue >= 5 // +5% mínimo
    const retentionImprovement = impact.retention >= 5 // +5% mínimo
    const hasPositiveImpact = revenueImprovement || retentionImprovement
    const noNegativeImpact = impact.negativeMetricsCount === 0
    const enoughEvaluations = experiment.evaluationCount >= 5

    // Criterios para promover a core
    if (
      hasPositiveImpact &&
      noNegativeImpact &&
      !impact.increasesComplexity &&
      !impact.breaksCoreLoop &&
      enoughEvaluations
    ) {
      shouldPromote = true
      reason = `Mejora ${revenueImprovement ? 'ingresos' : 'retención'} +${Math.max(impact.revenue, impact.retention)}% sin romper core`
    }
    // Criterios para archivar (no iterar infinito)
    else if (
      impact.revenue === 0 &&
      impact.retention === 0 &&
      experiment.evaluationCount >= 10 // Dar tiempo suficiente
    ) {
      shouldArchive = true
      reason = "Sin impacto después de 10 evaluaciones. Archivar, no iterar infinito."
    }
    // Criterios para pausar
    else if (impact.breaksCoreLoop || impact.increasesComplexity) {
      shouldPause = true
      reason = "Interfiere con core loop o aumenta complejidad"
    }
    // Continuar observando
    else {
      reason = "Continuar observando, impacto aún no claro"
    }

    // Actualizar experimento
    await this.updateExperiment(experimentId, {
      impactMetrics: {
        revenue: impact.revenue,
        retention: impact.retention,
        engagement: impact.engagement,
        conversion: impact.conversion
      },
      lastEvaluated: new Date(),
      evaluationCount: experiment.evaluationCount + 1
    })

    return {
      shouldPromote,
      shouldArchive,
      shouldPause,
      reason
    }
  }

  /**
   * Calcular impacto del experimento
   * 
   * UMBRALES DE PROMOCIÓN:
   * - ↑ Ingresos o ↑ Retención ≥ +5% sostenido
   * - 0 impactos negativos en el loop de dinero
   * - Completa ≥ 5 evaluaciones con datos reales
   */
  private calculateImpact(
    experiment: Experiment,
    criticalMetrics: any
  ): {
    revenue: number // % cambio en ingresos
    retention: number // % cambio en retención
    engagement: number
    conversion: number
    increasesComplexity: boolean
    breaksCoreLoop: boolean
    negativeMetricsCount: number // Cuántas métricas críticas empeoraron
  } {
    // Por ahora, retornar impacto neutral
    // En producción, comparar métricas antes/después del experimento
    // Comparar con baseline de 7 días antes del experimento
    
    return {
      revenue: 0,
      retention: 0,
      engagement: 0,
      conversion: 0,
      increasesComplexity: false,
      breaksCoreLoop: false,
      negativeMetricsCount: 0
    }
  }

  /**
   * KILL-SWITCH AUTOMÁTICO
   * Si un experimento empeora 2 métricas críticas en 7 días → desactivar automático
   */
  async checkKillSwitch(experimentId: string): Promise<boolean> {
    const experiment = await this.getExperiment(experimentId)
    if (!experiment) {
      return false
    }

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Obtener métricas críticas antes y después
    const { globalCriticalMetricsCollector } = await import("./critical-metrics")
    const currentMetrics = await globalCriticalMetricsCollector.collectMetrics()

    // Comparar con baseline (simplificado: buscar en logs)
    // En producción, guardar snapshot de métricas al crear experimento
    
    // Por ahora, verificar si hay 2+ métricas empeorando
    let negativeCount = 0
    
    // Si revenue bajó significativamente
    if (currentMetrics.lowScoreUpsellConversion.percentage < 10) {
      negativeCount++
    }
    
    // Si retención bajó
    if (currentMetrics.usersReturningWithoutEmail.percentage < 30) {
      negativeCount++
    }

    // Si tiempo de recuperación aumentó
    if (currentMetrics.riskToAttentionTime.averageDays > 20) {
      negativeCount++
    }

    // Si abandono aumentó
    if (currentMetrics.highScoreAbandonment.percentage > 20) {
      negativeCount++
    }

    // KILL-SWITCH: Si empeora 2+ métricas críticas → desactivar
    if (negativeCount >= 2) {
      await this.updateExperiment(experimentId, {
        status: "paused"
      })
      
      await this.logExperiment(experiment, "killed_auto")
      
      return true // Kill switch activado
    }

    return false
  }

  /**
   * Promover experimento a core (solo si cumple criterios)
   * 
   * PRESUPUESTO DE COMPLEJIDAD: Cada promoción obliga a archivar 1 experimento antiguo
   * Objetivo: complejidad neta cero
   */
  async promoteToCore(experimentId: string): Promise<boolean> {
    const evaluation = await this.evaluateExperiment(experimentId)
    
    if (!evaluation.shouldPromote) {
      return false
    }

    const experiment = await this.getExperiment(experimentId)
    if (!experiment) {
      return false
    }

    // PRESUPUESTO DE COMPLEJIDAD: Archivar 1 experimento antiguo antes de promover
    const activeExperiments = await this.listActiveExperiments()
    if (activeExperiments.length > 0) {
      // Archivar el más antiguo que no sea el que estamos promoviendo
      const oldestExperiment = activeExperiments
        .filter(e => e.id !== experimentId)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0]

      if (oldestExperiment) {
        await this.updateExperiment(oldestExperiment.id, {
          status: "archived"
        })
        
        await this.logExperiment(oldestExperiment, "archived_for_complexity_budget")
      }
    }

    // Marcar como promovido (ya no experimental)
    await this.updateExperiment(experimentId, {
      experimental: false,
      status: "promoted"
    })

    // Loggear promoción
    await this.logExperiment(experiment, "promoted_to_core")

    return true
  }

  /**
   * Obtener experimento
   */
  private async getExperiment(experimentId: string): Promise<Experiment | null> {
    // Por ahora, retornar null (en producción, buscar en DB)
    // Los experimentos se loggean en systemLog
    return null
  }

  /**
   * Actualizar experimento
   */
  private async updateExperiment(
    experimentId: string,
    updates: Partial<Experiment>
  ): Promise<void> {
    // Loggear actualización
    await prisma.systemLog.create({
      data: {
        level: "info",
        message: `Experiment updated: ${experimentId}`,
        metadata: JSON.stringify({
          type: "experiment_update",
          experimentId,
          updates
        }),
        source: "experimental_system"
      }
    })
  }

  /**
   * Loggear experimento
   */
  private async logExperiment(
    experiment: Experiment,
    action: "created" | "promoted_to_core" | "archived" | "paused"
  ): Promise<void> {
    await prisma.systemLog.create({
      data: {
        level: action === "promoted_to_core" ? "success" : "info",
        message: `Experiment ${action}: ${experiment.name}`,
        metadata: JSON.stringify({
          type: "experiment",
          action,
          experiment: {
            id: experiment.id,
            name: experiment.name,
            type: experiment.type,
            experimental: experiment.experimental,
            status: experiment.status
          }
        }),
        source: "experimental_system"
      }
    })
  }

  /**
   * Listar experimentos activos
   */
  async listActiveExperiments(): Promise<Experiment[]> {
    const logs = await prisma.systemLog.findMany({
      where: {
        source: "experimental_system",
        metadata: {
          contains: `"status":"active"`
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 10
    })

    // Parsear experimentos desde logs
    const experiments: Experiment[] = []
    for (const log of logs) {
      try {
        const metadata = JSON.parse(log.metadata || "{}")
        if (metadata.experiment) {
          experiments.push({
            id: metadata.experiment.id,
            name: metadata.experiment.name,
            description: "",
            type: metadata.experiment.type,
            status: metadata.experiment.status,
            experimental: metadata.experiment.experimental,
            impactMetrics: {},
            createdAt: log.createdAt,
            lastEvaluated: log.createdAt,
            evaluationCount: 0,
            metadata: {}
          })
        }
      } catch {
        // Ignorar errores de parsing
      }
    }

    return experiments
  }
}

/**
 * 🌍 Instancia global
 */
export const globalExperimentalSystem = new ExperimentalSystem()


