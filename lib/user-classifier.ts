/**
 * 👥 CLASIFICADOR DE USUARIOS (EN SOMBRA)
 * 
 * Clasifica usuarios sin exponer al usuario:
 * - Reactivos (actúan rápido)
 * - Lentos (leen pero no hacen)
 * - Evasivos (ignoran alertas)
 * - Optimizadores (suben score constantemente)
 * 
 * No mostrar esto. Solo loguear.
 * Define qué producto viene después, no ahora.
 */

import { prisma } from "./prisma"

export type UserType = "reactive" | "slow" | "evasive" | "optimizer" | "unknown"

export interface UserClassification {
  userId: string
  organizationId: string
  type: UserType
  confidence: number
  metadata: {
    avgTimeToAction: number // minutos desde alerta hasta acción
    alertViewToActionRate: number // % de alertas que resultan en acción
    scoreImprovementRate: number // % de veces que score sube después de acción
    daysSinceLastAction: number
    totalActionsCompleted: number
    alertsIgnored: number
  }
}

export class UserClassifier {
  /**
   * Clasificar usuario en sombra
   */
  async classifyUser(userId: string, organizationId: string): Promise<UserClassification> {
    // Obtener comportamiento histórico
    const behavior = await this.getUserBehavior(userId, organizationId)

    // Clasificar según comportamiento
    const classification = this.determineUserType(behavior)

    // Loggear clasificación (sin exponer al usuario)
    await this.logClassification(userId, organizationId, classification)

    return classification
  }

  /**
   * Obtener comportamiento del usuario
   */
  private async getUserBehavior(userId: string, organizationId: string) {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Alertas vistas
    const alertsViewed = await prisma.systemLog.findMany({
      where: {
        source: "pattern_logger",
        metadata: {
          contains: `"type":"alert_view"`
        },
        createdAt: { gte: thirtyDaysAgo }
      }
    })

    // Acciones completadas
    const actionsCompleted = await prisma.systemLog.findMany({
      where: {
        source: "action_tracker",
        level: "success",
        metadata: {
          contains: organizationId
        },
        createdAt: { gte: thirtyDaysAgo }
      }
    })

    // Calcular métricas
    const avgTimeToAction = this.calculateAvgTimeToAction(alertsViewed, actionsCompleted)
    const alertViewToActionRate = alertsViewed.length > 0
      ? (actionsCompleted.length / alertsViewed.length) * 100
      : 0
    const scoreImprovementRate = this.calculateScoreImprovementRate(actionsCompleted)
    const daysSinceLastAction = actionsCompleted.length > 0
      ? Math.floor((now.getTime() - actionsCompleted[actionsCompleted.length - 1].createdAt.getTime()) / (1000 * 60 * 60 * 24))
      : 999

    return {
      avgTimeToAction,
      alertViewToActionRate,
      scoreImprovementRate,
      daysSinceLastAction,
      totalActionsCompleted: actionsCompleted.length,
      alertsIgnored: Math.max(0, alertsViewed.length - actionsCompleted.length)
    }
  }

  /**
   * Determinar tipo de usuario según comportamiento
   */
  private determineUserType(behavior: ReturnType<typeof this.getUserBehavior> extends Promise<infer T> ? T : never): {
    type: UserType
    confidence: number
  } {
    // Reactivo: Actúa rápido (< 24h), alta tasa de acción (> 50%)
    if (behavior.avgTimeToAction < 24 * 60 && behavior.alertViewToActionRate > 50) {
      return { type: "reactive", confidence: 0.9 }
    }

    // Optimizador: Muchas acciones completadas, score mejora constantemente
    if (behavior.totalActionsCompleted >= 5 && behavior.scoreImprovementRate > 60) {
      return { type: "optimizer", confidence: 0.85 }
    }

    // Evasivo: Ve alertas pero no actúa (> 70% ignoradas)
    if (behavior.alertsIgnored > behavior.totalActionsCompleted * 2) {
      return { type: "evasive", confidence: 0.8 }
    }

    // Lento: Lee pero tarda en actuar (> 48h promedio)
    if (behavior.avgTimeToAction > 48 * 60 && behavior.alertViewToActionRate > 20) {
      return { type: "slow", confidence: 0.75 }
    }

    // Desconocido: No hay suficiente data
    return { type: "unknown", confidence: 0.5 }
  }

  /**
   * Calcular tiempo promedio hasta acción
   */
  private calculateAvgTimeToAction(alerts: any[], actions: any[]): number {
    if (alerts.length === 0 || actions.length === 0) {
      return 999 // Sin datos
    }

    // Simplificado: tiempo entre primera alerta y primera acción
    // En producción, hacer matching más sofisticado
    const firstAlert = alerts[0]?.createdAt
    const firstAction = actions[0]?.createdAt

    if (!firstAlert || !firstAction) {
      return 999
    }

    return Math.floor((firstAction.getTime() - firstAlert.getTime()) / (1000 * 60)) // minutos
  }

  /**
   * Calcular tasa de mejora de score después de acciones
   */
  private calculateScoreImprovementRate(actions: any[]): number {
    if (actions.length === 0) {
      return 0
    }

    let improvements = 0
    for (const action of actions) {
      try {
        const metadata = JSON.parse(action.metadata || "{}")
        if (metadata.scoreIncrease && metadata.scoreIncrease > 0) {
          improvements++
        }
      } catch {
        // Ignorar errores de parsing
      }
    }

    return (improvements / actions.length) * 100
  }

  /**
   * Loggear clasificación (sin exponer al usuario)
   */
  private async logClassification(
    userId: string,
    organizationId: string,
    classification: { type: UserType; confidence: number }
  ): Promise<void> {
    try {
      await prisma.systemLog.create({
        data: {
          level: "info",
          message: `User classified: ${classification.type} (confidence: ${classification.confidence})`,
          metadata: JSON.stringify({
            type: "user_classification",
            userId,
            organizationId,
            userType: classification.type,
            confidence: classification.confidence,
            timestamp: new Date().toISOString()
          }),
          source: "user_classifier"
        }
      })
    } catch (error) {
      console.error("Error logging user classification:", error)
    }
  }
}

/**
 * 🌍 Instancia global
 */
export const globalUserClassifier = new UserClassifier()






