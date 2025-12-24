/**
 * 📧 SISTEMA DE EMAIL NOTIFICATIONS
 * 
 * Reglas estrictas:
 * - Solo score < 40 (RIESGO crítico)
 * - Máximo 1 por semana por usuario
 * - No molesta, avisa
 */

import { prisma } from "./prisma"
import { globalBusinessEvaluator } from "./business-evaluator"
import { globalUpsellEngine } from "./upsell-engine"

export class EmailNotificationSystem {
  /**
   * Enviar email solo si score < 40 y no se envió esta semana
   */
  async sendCriticalAlertIfNeeded(organizationId: string, userId: string): Promise<boolean> {
    try {
      // Evaluar negocio
      const evaluation = await globalBusinessEvaluator.evaluate(organizationId)

      // Solo enviar si score < 40
      if (evaluation.score >= 40) {
        return false
      }

      // Verificar si ya se envió esta semana
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

      const recentEmail = await prisma.systemLog.findFirst({
        where: {
          source: "email_notifications",
          metadata: {
            contains: organizationId
          },
          createdAt: {
            gte: oneWeekAgo
          }
        }
      })

      if (recentEmail) {
        // Ya se envió esta semana
        return false
      }

      // Obtener oportunidad de upsell
      const upsellOpportunity = await globalUpsellEngine.detectUpsellOpportunity(
        organizationId,
        evaluation
      )

      // Obtener usuario
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user?.email) {
        return false
      }

      // Preparar email (por ahora solo log, en producción usar servicio de email)
      const emailContent = this.prepareEmailContent(evaluation, upsellOpportunity)

      // Log email (en producción, enviar realmente)
      await prisma.systemLog.create({
        data: {
          level: "warn",
          message: `Email notification sent to ${user.email}: ${emailContent.subject}`,
          metadata: JSON.stringify({
            type: "email_notification",
            organizationId,
            userId,
            score: evaluation.score,
            status: evaluation.status,
            email: user.email,
            subject: emailContent.subject,
            body: emailContent.body
          }),
          source: "email_notifications"
        }
      })

      // En producción, aquí iría el envío real:
      // await sendEmail(user.email, emailContent.subject, emailContent.body)

      return true
    } catch (error) {
      console.error("Error sending email notification:", error)
      return false
    }
  }

  /**
   * Preparar contenido del email
   */
  private prepareEmailContent(evaluation: any, upsellOpportunity: any | null) {
    const subject = `⚠️ Tu negocio necesita atención (Score: ${evaluation.score})`

    let body = `
Hola,

Tu negocio tiene un score de ${evaluation.score}, lo que significa que está en ${evaluation.status === "RIESGO" ? "riesgo crítico" : "zona de atención"}.

${evaluation.alert}

${evaluation.action}

${upsellOpportunity ? `\n${upsellOpportunity.message}\n\n${upsellOpportunity.cta}: [Link al upgrade]` : ""}

Revisá tu dashboard para más detalles y acciones concretas.

Saludos,
SaaS Factory
    `.trim()

    return { subject, body }
  }

  /**
   * Procesar todas las organizaciones activas y enviar emails críticos
   */
  async processAllCriticalAlerts(): Promise<{ sent: number; skipped: number }> {
    let sent = 0
    let skipped = 0

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

    for (const subscription of subscriptions) {
      const userId = subscription.organization.members[0]?.userId
      if (!userId) {
        skipped++
        continue
      }

      const wasSent = await this.sendCriticalAlertIfNeeded(
        subscription.organizationId,
        userId
      )

      if (wasSent) {
        sent++
      } else {
        skipped++
      }
    }

    return { sent, skipped }
  }
}

/**
 * 🌍 Instancia global
 */
export const globalEmailNotificationSystem = new EmailNotificationSystem()






