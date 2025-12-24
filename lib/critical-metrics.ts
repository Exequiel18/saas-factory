/**
 * 📊 MÉTRICAS CRÍTICAS PARA MEDIR
 * 
 * Antes de cualquier decisión futura, el sistema debe medir:
 * - % de usuarios que vuelven sin email
 * - % de score < 40 que ve upsell
 * - % de score < 40 que convierte
 * - Tiempo promedio para subir de RIESGO a ATENCIÓN
 * - Cuántos abandonan con score alto (riesgo oculto)
 * 
 * Sin estos datos, no se mueve nada.
 */

import { prisma } from "./prisma"

export interface CriticalMetrics {
  usersReturningWithoutEmail: {
    percentage: number
    totalUsers: number
    usersReturned: number
  }
  lowScoreUpsellVisibility: {
    percentage: number
    totalLowScore: number
    upsellShown: number
  }
  lowScoreUpsellConversion: {
    percentage: number
    totalUpsellShown: number
    upsellConverted: number
  }
  riskToAttentionTime: {
    averageDays: number
    totalTransitions: number
  }
  highScoreAbandonment: {
    percentage: number
    totalHighScore: number
    abandoned: number
  }
}

export class CriticalMetricsCollector {
  /**
   * Recolectar todas las métricas críticas
   */
  async collectMetrics(): Promise<CriticalMetrics> {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // 1. % de usuarios que vuelven sin email
    const usersReturningWithoutEmail = await this.calculateUsersReturningWithoutEmail(thirtyDaysAgo)

    // 2. % de score < 40 que ve upsell
    const lowScoreUpsellVisibility = await this.calculateLowScoreUpsellVisibility(thirtyDaysAgo)

    // 3. % de score < 40 que convierte
    const lowScoreUpsellConversion = await this.calculateLowScoreUpsellConversion(thirtyDaysAgo)

    // 4. Tiempo promedio para subir de RIESGO a ATENCIÓN
    const riskToAttentionTime = await this.calculateRiskToAttentionTime(thirtyDaysAgo)

    // 5. Cuántos abandonan con score alto
    const highScoreAbandonment = await this.calculateHighScoreAbandonment(thirtyDaysAgo)

    return {
      usersReturningWithoutEmail,
      lowScoreUpsellVisibility,
      lowScoreUpsellConversion,
      riskToAttentionTime,
      highScoreAbandonment
    }
  }

  /**
   * Calcular % de usuarios que vuelven sin email
   */
  private async calculateUsersReturningWithoutEmail(since: Date) {
    // Usuarios que recibieron email crítico
    const emailSent = await prisma.systemLog.count({
      where: {
        source: "email_notifications",
        createdAt: { gte: since }
      }
    })

    // Usuarios que volvieron después de email
    const returnedAfterEmail = await prisma.systemLog.count({
      where: {
        source: "pattern_logger",
        metadata: {
          contains: `"type":"alert_view"`
        },
        createdAt: { gte: since }
      }
    })

    // Usuarios que volvieron sin email (simplificado: todos los que volvieron menos los que recibieron email)
    const totalUsers = await prisma.user.count()
    const usersReturned = Math.max(0, returnedAfterEmail - emailSent)

    return {
      percentage: totalUsers > 0 ? (usersReturned / totalUsers) * 100 : 0,
      totalUsers,
      usersReturned
    }
  }

  /**
   * Calcular % de score < 40 que ve upsell
   */
  private async calculateLowScoreUpsellVisibility(since: Date) {
    // Evaluaciones con score < 40
    const lowScoreEvaluations = await prisma.systemLog.findMany({
      where: {
        source: "business_evaluator",
        metadata: {
          contains: `"score"`
        },
        createdAt: { gte: since }
      }
    })

    const lowScoreCount = lowScoreEvaluations.filter(e => {
      try {
        const metadata = JSON.parse(e.metadata || "{}")
        return metadata.score < 40
      } catch {
        return false
      }
    }).length

    // Upsells mostrados
    const upsellShown = await prisma.systemLog.count({
      where: {
        source: "upsell_engine",
        createdAt: { gte: since }
      }
    })

    return {
      percentage: lowScoreCount > 0 ? (upsellShown / lowScoreCount) * 100 : 0,
      totalLowScore: lowScoreCount,
      upsellShown
    }
  }

  /**
   * Calcular % de score < 40 que convierte
   */
  private async calculateLowScoreUpsellConversion(since: Date) {
    // Upsells mostrados
    const upsellShown = await prisma.systemLog.count({
      where: {
        source: "upsell_engine",
        createdAt: { gte: since }
      }
    })

    // Upsells convertidos
    const upsellConverted = await prisma.systemLog.count({
      where: {
        source: "upsell_engine",
        level: "success",
        metadata: {
          contains: `"type":"upsell_converted"`
        },
        createdAt: { gte: since }
      }
    })

    return {
      percentage: upsellShown > 0 ? (upsellConverted / upsellShown) * 100 : 0,
      totalUpsellShown: upsellShown,
      upsellConverted
    }
  }

  /**
   * Calcular tiempo promedio para subir de RIESGO a ATENCIÓN
   */
  private async calculateRiskToAttentionTime(since: Date) {
    // Evaluaciones con estado RIESGO
    const riskEvaluations = await prisma.systemLog.findMany({
      where: {
        source: "business_evaluator",
        metadata: {
          contains: `"status":"RIESGO"`
        },
        createdAt: { gte: since }
      },
      orderBy: {
        createdAt: "asc"
      }
    })

    // Buscar transiciones RIESGO → ATENCIÓN
    let totalDays = 0
    let transitions = 0

    for (let i = 0; i < riskEvaluations.length - 1; i++) {
      const riskEval = riskEvaluations[i]
      const nextEval = riskEvaluations[i + 1]

      try {
        const riskMetadata = JSON.parse(riskEval.metadata || "{}")
        const nextMetadata = JSON.parse(nextEval.metadata || "{}")

        if (riskMetadata.status === "RIESGO" && nextMetadata.status === "ATENCIÓN") {
          const daysDiff = Math.floor(
            (nextEval.createdAt.getTime() - riskEval.createdAt.getTime()) / (1000 * 60 * 60 * 24)
          )
          totalDays += daysDiff
          transitions++
        }
      } catch {
        // Ignorar errores de parsing
      }
    }

    return {
      averageDays: transitions > 0 ? totalDays / transitions : 0,
      totalTransitions: transitions
    }
  }

  /**
   * Calcular cuántos abandonan con score alto
   */
  private async calculateHighScoreAbandonment(since: Date) {
    // Usuarios con score alto (>= 70) que no volvieron en 14 días
    const fourteenDaysAgo = new Date()
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

    const highScoreEvaluations = await prisma.systemLog.findMany({
      where: {
        source: "business_evaluator",
        metadata: {
          contains: `"score"`
        },
        createdAt: { gte: since, lt: fourteenDaysAgo }
      }
    })

    const highScoreUsers = highScoreEvaluations.filter(e => {
      try {
        const metadata = JSON.parse(e.metadata || "{}")
        return metadata.score >= 70
      } catch {
        return false
      }
    })

    // Verificar si volvieron después
    let abandoned = 0
    for (const evaluation of highScoreUsers) {
      const hasReturned = await prisma.systemLog.findFirst({
        where: {
          source: "pattern_logger",
          metadata: {
            contains: evaluation.metadata
          },
          createdAt: { gte: fourteenDaysAgo }
        }
      })

      if (!hasReturned) {
        abandoned++
      }
    }

    return {
      percentage: highScoreUsers.length > 0 ? (abandoned / highScoreUsers.length) * 100 : 0,
      totalHighScore: highScoreUsers.length,
      abandoned
    }
  }
}

/**
 * 🌍 Instancia global
 */
export const globalCriticalMetricsCollector = new CriticalMetricsCollector()






