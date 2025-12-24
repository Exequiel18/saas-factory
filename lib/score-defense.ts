/**
 * 🛡️ SISTEMA DE DEFENSA DEL SCORE
 * 
 * Evita:
 * - Score plano (abandono silencioso)
 * - Inflación del score (usuario "gana el juego")
 * - Manipulación del sistema
 * 
 * Reglas:
 * - Score no puede quedar estable más de 7 días
 * - Aumento máximo mensual del score limitado
 * - Micro-variaciones basadas en comportamiento
 */

import { prisma } from "./prisma"
import { BusinessEvaluation } from "./business-evaluator"

export interface ScoreVariation {
  baseScore: number
  adjustedScore: number
  variation: number
  reason: string
  behaviorFactors: {
    daysSinceLastAction: number
    actionsCompletedThisMonth: number
    daysInactive: number
    lastEvaluationDate: Date | null
  }
}

export class ScoreDefenseSystem {
  /**
   * Aplicar defensas al score para evitar abuso y aburrimiento
   */
  async applyScoreDefenses(
    organizationId: string,
    baseEvaluation: BusinessEvaluation
  ): Promise<ScoreVariation> {
    // Obtener comportamiento del usuario
    const behavior = await this.getUserBehavior(organizationId)

    // Calcular variación basada en comportamiento
    let variation = 0
    let reason = ""

    // 1. Evitar score plano (máximo 7 días estable)
    const daysSinceLastChange = this.getDaysSinceLastScoreChange(organizationId, baseEvaluation.score)
    if (daysSinceLastChange >= 7) {
      // Introducir micro-variación basada en comportamiento
      if (behavior.daysInactive > 3) {
        variation = -2 // Baja si está inactivo
        reason = "Inactividad detectada. Score ajustado para reflejar uso real."
      } else if (behavior.actionsCompletedThisMonth > 0) {
        variation = +1 // Sube ligeramente si completó acciones
        reason = "Acciones completadas. Score ajustado positivamente."
      } else {
        variation = -1 // Baja ligeramente si no hay actividad
        reason = "Sin actividad reciente. Score ajustado para mantener engagement."
      }
    }

    // 2. Controlar inflación del score (máximo +10 puntos por mes)
    const monthlyIncrease = await this.getMonthlyScoreIncrease(organizationId, baseEvaluation.score)
    if (monthlyIncrease >= 10 && variation > 0) {
      variation = 0 // Bloquear aumento si ya subió mucho este mes
      reason = "Aumento mensual máximo alcanzado. El score debe costar mantenerlo alto."
    }

    // 3. Penalizar inactividad prolongada
    if (behavior.daysInactive > 14) {
      variation = Math.min(variation - 3, -5) // Máximo -5 por inactividad
      reason = "Inactividad prolongada detectada. Score ajustado para reflejar uso real."
    }

    // 4. Premiar uso consistente (pero con límite)
    if (behavior.actionsCompletedThisMonth >= 5 && behavior.daysInactive === 0) {
      // Ya se aplicó en el aumento mensual, no duplicar
      if (monthlyIncrease < 5) {
        variation = Math.min(variation + 1, +2) // Máximo +2 por uso consistente
        reason = "Uso consistente detectado. Score ajustado positivamente."
      }
    }

    // Aplicar variación
    const adjustedScore = Math.max(0, Math.min(100, baseEvaluation.score + variation))

    return {
      baseScore: baseEvaluation.score,
      adjustedScore,
      variation,
      reason,
      behaviorFactors: behavior
    }
  }

  /**
   * Obtener comportamiento del usuario
   */
  private async getUserBehavior(organizationId: string): Promise<{
    daysSinceLastAction: number
    actionsCompletedThisMonth: number
    daysInactive: number
    lastEvaluationDate: Date | null
  }> {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Obtener acciones completadas este mes
    const completedActions = await prisma.systemLog.findMany({
      where: {
        source: "action_tracker",
        metadata: {
          contains: organizationId
        },
        level: "success",
        createdAt: {
          gte: startOfMonth
        }
      }
    })

    // Obtener última evaluación
    const lastEvaluation = await prisma.systemLog.findFirst({
      where: {
        source: "business_evaluator",
        metadata: {
          contains: organizationId
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    // Calcular días desde última acción
    const lastAction = completedActions[completedActions.length - 1]
    const daysSinceLastAction = lastAction
      ? Math.floor((now.getTime() - lastAction.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      : 999

    // Calcular días inactivo (sin ninguna interacción)
    const lastInteraction = await prisma.systemLog.findFirst({
      where: {
        metadata: {
          contains: organizationId
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    const daysInactive = lastInteraction
      ? Math.floor((now.getTime() - lastInteraction.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      : 999

    return {
      daysSinceLastAction,
      actionsCompletedThisMonth: completedActions.length,
      daysInactive,
      lastEvaluationDate: lastEvaluation?.createdAt || null
    }
  }

  /**
   * Obtener días desde último cambio de score
   */
  private getDaysSinceLastScoreChange(organizationId: string, currentScore: number): number {
    // Por ahora, usar última evaluación como proxy
    // En producción, guardar historial de scores
    return 0 // Placeholder - necesita historial de scores
  }

  /**
   * Obtener aumento mensual del score
   */
  private async getMonthlyScoreIncrease(organizationId: string, currentScore: number): Promise<number> {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Obtener evaluaciones del mes
    const evaluations = await prisma.systemLog.findMany({
      where: {
        source: "business_evaluator",
        metadata: {
          contains: organizationId
        },
        createdAt: {
          gte: startOfMonth
        }
      },
      orderBy: {
        createdAt: "asc"
      }
    })

    if (evaluations.length === 0) {
      return 0
    }

    // Extraer scores del metadata
    const scores = evaluations
      .map(e => {
        try {
          const metadata = JSON.parse(e.metadata || "{}")
          return metadata.score || currentScore
        } catch {
          return currentScore
        }
      })
      .filter((s): s is number => typeof s === "number")

    if (scores.length === 0) {
      return 0
    }

    const firstScore = scores[0]
    const increase = currentScore - firstScore

    return Math.max(0, increase) // Solo aumentos positivos
  }
}

/**
 * 🌍 Instancia global
 */
export const globalScoreDefenseSystem = new ScoreDefenseSystem()






