/**
 * 💰 MOTOR DE UPSELL AUTOMÁTICO POR SCORE
 * 
 * Regla simple y efectiva:
 * - Score ≥ 70 → OK → tranquilidad
 * - Score 40-69 → ATENCIÓN → "estás sobreviviendo"
 * - Score < 40 → RIESGO → activa upsell automático
 * 
 * No como castigo. Como seguro.
 */

import { prisma } from "./prisma"
import { BusinessEvaluation, BusinessStatus } from "./business-evaluator"

export interface UpsellOpportunity {
  organizationId: string
  userId: string
  currentScore: number
  currentPlan: string
  suggestedPlan: string
  reason: string
  urgency: "critical" | "high" | "medium"
  message: string // Mensaje humano con calle
  cta: string // Call to action corto
}

export class UpsellEngine {
  /**
   * Detectar oportunidad de upsell basada en score
   * Aplica rotación de mensajes para evitar habituación
   */
  async detectUpsellOpportunity(
    organizationId: string,
    evaluation: BusinessEvaluation
  ): Promise<UpsellOpportunity | null> {
    // Solo activar upsell si score < 40 (RIESGO crítico)
    if (evaluation.score >= 40) {
      return null
    }

    // Obtener suscripción actual
    const subscription = await prisma.subscription.findFirst({
      where: { organizationId },
      include: {
        organization: {
          include: {
            members: {
              where: { role: { in: ["owner", "admin"] } },
              take: 1
            }
          }
        }
      }
    })

    if (!subscription) {
      return null
    }

    const currentPlan = subscription.plan
    const userId = subscription.organization.members[0]?.userId

    if (!userId) {
      return null
    }

    // Determinar plan sugerido según score
    let suggestedPlan: string
    let urgency: "critical" | "high" | "medium"
    let reason: string
    let message: string
    let cta: string

    if (evaluation.score < 30) {
      // Score crítico: Premium necesario
      suggestedPlan = "premium"
      urgency = "critical"
      reason = "Tu negocio está en riesgo crítico. Necesitás ayuda profesional urgente."
      message = this.getCriticalMessage(evaluation)
      cta = "Corregir esto ahora"
    } else if (evaluation.score < 40) {
      // Score bajo: Membresía mensual necesaria
      suggestedPlan = currentPlan === "free" ? "membership" : "premium"
      urgency = "high"
      reason = "Tu negocio necesita atención constante para evitar pérdidas mayores."
      message = this.getHighUrgencyMessage(evaluation)
      cta = "Activar protección mensual"
    } else {
      return null
    }

    const baseOpportunity: UpsellOpportunity = {
      organizationId,
      userId,
      currentScore: evaluation.score,
      currentPlan,
      suggestedPlan,
      reason,
      urgency,
      message,
      cta
    }

    // Aplicar rotación de mensajes para evitar habituación
    const { globalUpsellRotationSystem } = await import("./upsell-rotation")
    const rotatedUpsell = await globalUpsellRotationSystem.rotateUpsellMessage(
      organizationId,
      baseOpportunity
    )

    // Registrar que se mostró
    await globalUpsellRotationSystem.logUpsellShown(rotatedUpsell)

    return {
      organizationId: rotatedUpsell.organizationId,
      userId: rotatedUpsell.userId,
      currentScore: rotatedUpsell.currentScore,
      currentPlan: rotatedUpsell.currentPlan,
      suggestedPlan: rotatedUpsell.suggestedPlan,
      reason: rotatedUpsell.reason,
      urgency: rotatedUpsell.urgency,
      message: rotatedUpsell.message,
      cta: rotatedUpsell.cta
    }
  }

  /**
   * Mensaje crítico (score < 30) - Con calle argentina
   */
  private getCriticalMessage(evaluation: BusinessEvaluation): string {
    if (evaluation.status === "RIESGO") {
      return `Así no llegás cómodo a fin de mes. Tu score está en ${evaluation.score} y tu negocio está perdiendo plata. Te ayudamos a corregir esto antes de que empeore.`
    }
    return `Tu negocio necesita atención urgente. Score ${evaluation.score} significa que estás en riesgo. No esperes a que sea tarde.`
  }

  /**
   * Mensaje alta urgencia (score 30-39) - Con calle argentina
   */
  private getHighUrgencyMessage(evaluation: BusinessEvaluation): string {
    if (evaluation.status === "RIESGO") {
      return `Esto hoy no te mata, pero te va a cansar. Score ${evaluation.score} significa que estás sobreviviendo, no creciendo. Te ayudamos a corregir esto antes de que se convierta en pérdida real.`
    }
    return `Tu negocio está en zona de riesgo. Score ${evaluation.score} significa que necesitás monitoreo constante. Activa protección mensual y evitá problemas mayores.`
  }

  /**
   * Obtener todas las oportunidades de upsell activas
   */
  async getAllUpsellOpportunities(): Promise<UpsellOpportunity[]> {
    const opportunities: UpsellOpportunity[] = []

    // Obtener todas las organizaciones con suscripciones activas
    const subscriptions = await prisma.subscription.findMany({
      where: {
        status: { in: ["active", "pending"] }
      },
      include: {
        organization: {
          include: {
            members: {
              where: { role: { in: ["owner", "admin"] } },
              take: 1
            }
          }
        }
      }
    })

    const { globalBusinessEvaluator } = await import("./business-evaluator")

    for (const subscription of subscriptions) {
      try {
        const evaluation = await globalBusinessEvaluator.evaluate(subscription.organizationId)
        const opportunity = await this.detectUpsellOpportunity(
          subscription.organizationId,
          evaluation
        )

        if (opportunity) {
          opportunities.push(opportunity)
        }
      } catch (error) {
        console.error(`Error detecting upsell for org ${subscription.organizationId}:`, error)
      }
    }

    return opportunities
  }

  /**
   * Registrar oportunidad de upsell en base de datos
   */
  async logUpsellOpportunity(opportunity: UpsellOpportunity): Promise<void> {
    try {
      await prisma.systemLog.create({
        data: {
          level: opportunity.urgency === "critical" ? "error" : "warn",
          message: `Upsell opportunity: ${opportunity.message}`,
          metadata: JSON.stringify({
            type: "upsell_opportunity",
            organizationId: opportunity.organizationId,
            userId: opportunity.userId,
            currentScore: opportunity.currentScore,
            currentPlan: opportunity.currentPlan,
            suggestedPlan: opportunity.suggestedPlan,
            urgency: opportunity.urgency
          }),
          source: "upsell_engine"
        }
      })
    } catch (error) {
      console.error("Error logging upsell opportunity:", error)
    }
  }
}

/**
 * 🌍 Instancia global
 */
export const globalUpsellEngine = new UpsellEngine()

