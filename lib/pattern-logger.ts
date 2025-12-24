/**
 * 📊 SISTEMA DE LOGGING DE PATRONES (FASE 2 EN SOMBRA)
 * 
 * Sin exponer al usuario:
 * - Loguea patrones de comportamiento
 * - Detecta qué alertas convierten
 * - Mide qué acciones suben score y retienen más
 * 
 * Esto define el siguiente producto, no opiniones.
 */

import { prisma } from "./prisma"
import { BusinessEvaluation } from "./business-evaluator"

export interface PatternLog {
  type: "alert_view" | "action_completed" | "upsell_shown" | "upsell_converted" | "score_change"
  organizationId: string
  userId: string
  metadata: {
    score?: number
    status?: string
    alert?: string
    action?: string
    upsellAngle?: string
    daysSinceLastVisit?: number
    actionsCompletedThisMonth?: number
    [key: string]: unknown
  }
  timestamp: Date
}

export class PatternLogger {
  /**
   * Loggear patrón de comportamiento
   */
  async logPattern(pattern: PatternLog): Promise<void> {
    try {
      await prisma.systemLog.create({
        data: {
          level: "info",
          message: `Pattern logged: ${pattern.type}`,
          metadata: JSON.stringify({
            type: pattern.type,
            organizationId: pattern.organizationId,
            userId: pattern.userId,
            ...pattern.metadata,
            timestamp: pattern.timestamp.toISOString()
          }),
          source: "pattern_logger"
        }
      })
    } catch (error) {
      console.error("Error logging pattern:", error)
    }
  }

  /**
   * Loggear visualización de alerta
   */
  async logAlertView(
    organizationId: string,
    userId: string,
    evaluation: BusinessEvaluation
  ): Promise<void> {
    await this.logPattern({
      type: "alert_view",
      organizationId,
      userId,
      metadata: {
        score: evaluation.score,
        status: evaluation.status,
        alert: evaluation.alert,
        action: evaluation.action
      },
      timestamp: new Date()
    })
  }

  /**
   * Loggear acción completada
   */
  async logActionCompleted(
    organizationId: string,
    userId: string,
    action: string,
    scoreBefore: number,
    scoreAfter: number
  ): Promise<void> {
    await this.logPattern({
      type: "action_completed",
      organizationId,
      userId,
      metadata: {
        action,
        scoreBefore,
        scoreAfter,
        scoreIncrease: scoreAfter - scoreBefore
      },
      timestamp: new Date()
    })
  }

  /**
   * Loggear upsell mostrado
   */
  async logUpsellShown(
    organizationId: string,
    userId: string,
    score: number,
    angle: string
  ): Promise<void> {
    await this.logPattern({
      type: "upsell_shown",
      organizationId,
      userId,
      metadata: {
        score,
        upsellAngle: angle
      },
      timestamp: new Date()
    })
  }

  /**
   * Loggear conversión de upsell
   */
  async logUpsellConverted(
    organizationId: string,
    userId: string,
    score: number,
    fromPlan: string,
    toPlan: string
  ): Promise<void> {
    await this.logPattern({
      type: "upsell_converted",
      organizationId,
      userId,
      metadata: {
        score,
        fromPlan,
        toPlan
      },
      timestamp: new Date()
    })
  }

  /**
   * Loggear cambio de score
   */
  async logScoreChange(
    organizationId: string,
    userId: string,
    scoreBefore: number,
    scoreAfter: number,
    reason: string
  ): Promise<void> {
    await this.logPattern({
      type: "score_change",
      organizationId,
      userId,
      metadata: {
        scoreBefore,
        scoreAfter,
        scoreChange: scoreAfter - scoreBefore,
        reason
      },
      timestamp: new Date()
    })
  }

  /**
   * Analizar patrones (para fase 2)
   */
  async analyzePatterns(): Promise<{
    topConvertingAlerts: Array<{ alert: string; conversionRate: number }>
    topRetainingActions: Array<{ action: string; retentionRate: number }>
    upsellConversionByAngle: Record<string, number>
  }> {
    // Por ahora retornar estructura vacía
    // En fase 2, analizar logs reales
    return {
      topConvertingAlerts: [],
      topRetainingActions: [],
      upsellConversionByAngle: {}
    }
  }
}

/**
 * 🌍 Instancia global
 */
export const globalPatternLogger = new PatternLogger()






