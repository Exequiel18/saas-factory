/**
 * 🔄 SISTEMA DE ROTACIÓN DE UPSELL
 * 
 * Previene habituación al upsell:
 * - Degrada mensaje si no convierte
 * - Cambia ángulo (riesgo → oportunidad → comparación)
 * - Nunca repite el mismo copy más de 2 veces seguidas
 */

import { prisma } from "./prisma"
import { UpsellOpportunity } from "./upsell-engine"

export type UpsellAngle = "risk" | "opportunity" | "comparison" | "social_proof"

export interface RotatedUpsell extends UpsellOpportunity {
  angle: UpsellAngle
  showCount: number
  lastShown: Date | null
  converted: boolean
}

export class UpsellRotationSystem {
  /**
   * Rotar mensaje de upsell para evitar habituación
   */
  async rotateUpsellMessage(
    organizationId: string,
    baseOpportunity: UpsellOpportunity
  ): Promise<RotatedUpsell> {
    // Obtener historial de upsells mostrados
    const history = await this.getUpsellHistory(organizationId)

    // Determinar ángulo según historial
    const angle = this.determineNextAngle(history)

    // Generar mensaje rotado según ángulo
    const rotatedMessage = this.generateRotatedMessage(baseOpportunity, angle, history.length)

    return {
      ...baseOpportunity,
      angle,
      message: rotatedMessage.message,
      cta: rotatedMessage.cta,
      showCount: history.length + 1,
      lastShown: new Date(),
      converted: false
    }
  }

  /**
   * Determinar siguiente ángulo según historial
   */
  private determineNextAngle(history: RotatedUpsell[]): UpsellAngle {
    if (history.length === 0) {
      return "risk" // Primera vez: riesgo
    }

    const lastAngle = history[history.length - 1]?.angle || "risk"
    const lastTwoAngles = history.slice(-2).map(h => h.angle)

    // Si los últimos 2 fueron iguales, cambiar
    if (lastTwoAngles.length === 2 && lastTwoAngles[0] === lastTwoAngles[1]) {
      return this.getNextAngle(lastAngle)
    }

    // Si no convirtió en las últimas 2 veces, degradar
    const lastTwoConverted = history.slice(-2).some(h => h.converted)
    if (!lastTwoConverted && history.length >= 2) {
      return this.degradeAngle(lastAngle)
    }

    // Rotar normalmente
    return this.getNextAngle(lastAngle)
  }

  /**
   * Obtener siguiente ángulo en rotación
   */
  private getNextAngle(current: UpsellAngle): UpsellAngle {
    const rotation: UpsellAngle[] = ["risk", "opportunity", "comparison", "social_proof"]
    const currentIndex = rotation.indexOf(current)
    const nextIndex = (currentIndex + 1) % rotation.length
    return rotation[nextIndex]
  }

  /**
   * Degradar ángulo si no convierte
   */
  private degradeAngle(current: UpsellAngle): UpsellAngle {
    // Degradar: risk → opportunity → comparison → social_proof
    const degradation: Record<UpsellAngle, UpsellAngle> = {
      risk: "opportunity",
      opportunity: "comparison",
      comparison: "social_proof",
      social_proof: "comparison" // Mantener en el más suave
    }
    return degradation[current] || "comparison"
  }

  /**
   * Generar mensaje rotado según ángulo
   */
  private generateRotatedMessage(
    baseOpportunity: UpsellOpportunity,
    angle: UpsellAngle,
    showCount: number
  ): { message: string; cta: string } {
    const score = baseOpportunity.currentScore

    switch (angle) {
      case "risk":
        return {
          message: `Así no llegás cómodo a fin de mes. Score ${score} significa riesgo real. Te ayudamos a corregir esto antes de que empeore.`,
          cta: "Corregir esto ahora"
        }

      case "opportunity":
        return {
          message: `Esto hoy no te mata, pero te va a cansar. Score ${score} significa que estás sobreviviendo, no creciendo. Podés mejorar esto.`,
          cta: "Activar protección mensual"
        }

      case "comparison":
        return {
          message: `La mayoría de negocios como el tuyo ya corrigieron esto antes de generar pérdidas. Score ${score} es señal de alerta temprana.`,
          cta: "Ver cómo otros lo solucionaron"
        }

      case "social_proof":
        return {
          message: `Otros negocios con score similar mejoraron ${showCount > 3 ? "rápidamente" : "en promedio 15 días"} con nuestro plan. No esperes a que sea tarde.`,
          cta: "Unirme a los que mejoraron"
        }

      default:
        return {
          message: baseOpportunity.message,
          cta: baseOpportunity.cta
        }
    }
  }

  /**
   * Obtener historial de upsells mostrados
   */
  private async getUpsellHistory(organizationId: string): Promise<RotatedUpsell[]> {
    const logs = await prisma.systemLog.findMany({
      where: {
        source: "upsell_engine",
        metadata: {
          contains: organizationId
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 10
    })

    return logs.map(log => {
      try {
        const metadata = JSON.parse(log.metadata || "{}")
        return {
          organizationId: metadata.organizationId || organizationId,
          userId: metadata.userId || "",
          currentScore: metadata.currentScore || 0,
          currentPlan: metadata.currentPlan || "free",
          suggestedPlan: metadata.suggestedPlan || "membership",
          reason: metadata.reason || "",
          urgency: metadata.urgency || "medium",
          message: log.message || "",
          cta: "",
          angle: (metadata.angle || "risk") as UpsellAngle,
          showCount: metadata.showCount || 1,
          lastShown: log.createdAt,
          converted: metadata.converted || false
        }
      } catch {
        return {
          organizationId,
          userId: "",
          currentScore: 0,
          currentPlan: "free",
          suggestedPlan: "membership",
          reason: "",
          urgency: "medium",
          message: log.message || "",
          cta: "",
          angle: "risk" as UpsellAngle,
          showCount: 1,
          lastShown: log.createdAt,
          converted: false
        }
      }
    })
  }

  /**
   * Registrar que upsell fue mostrado
   */
  async logUpsellShown(rotatedUpsell: RotatedUpsell): Promise<void> {
    try {
      await prisma.systemLog.create({
        data: {
          level: rotatedUpsell.urgency === "critical" ? "error" : "warn",
          message: `Upsell shown (angle: ${rotatedUpsell.angle}): ${rotatedUpsell.message}`,
          metadata: JSON.stringify({
            type: "upsell_shown",
            organizationId: rotatedUpsell.organizationId,
            userId: rotatedUpsell.userId,
            angle: rotatedUpsell.angle,
            showCount: rotatedUpsell.showCount,
            currentScore: rotatedUpsell.currentScore,
            converted: false
          }),
          source: "upsell_engine"
        }
      })
    } catch (error) {
      console.error("Error logging upsell shown:", error)
    }
  }

  /**
   * Registrar conversión de upsell
   */
  async logUpsellConversion(organizationId: string): Promise<void> {
    try {
      await prisma.systemLog.create({
        data: {
          level: "success",
          message: `Upsell converted for organization ${organizationId}`,
          metadata: JSON.stringify({
            type: "upsell_converted",
            organizationId,
            convertedAt: new Date().toISOString()
          }),
          source: "upsell_engine"
        }
      })
    } catch (error) {
      console.error("Error logging upsell conversion:", error)
    }
  }
}

/**
 * 🌍 Instancia global
 */
export const globalUpsellRotationSystem = new UpsellRotationSystem()






