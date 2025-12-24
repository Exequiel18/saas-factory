/**
 * 🔔 SISTEMA DE ALERTAS AUTOMÁTICAS
 * 
 * Justifica la suscripción mensual enviando alertas cuando:
 * - Detecta riesgo silencioso
 * - Encuentra oportunidades
 * - Compara con referencia social
 * 
 * El usuario paga para que "alguien mire su negocio por él"
 */

import { prisma } from "./prisma"
import { globalBusinessEvaluator, BusinessEvaluation } from "./business-evaluator"

export interface Alert {
  id: string
  organizationId: string
  userId: string
  type: "risk" | "opportunity" | "update"
  priority: "high" | "medium" | "low"
  title: string
  message: string
  action: string
  evaluation: BusinessEvaluation
  createdAt: Date
  read: boolean
}

export class AlertSystem {
  /**
   * Generar alertas para todas las organizaciones activas
   */
  async generateAlertsForActiveOrganizations(): Promise<Alert[]> {
    const alerts: Alert[] = []

    // Obtener todas las organizaciones con suscripciones activas
    const activeSubscriptions = await prisma.subscription.findMany({
      where: {
        status: "active"
      },
      include: {
        organization: {
          include: {
            members: {
              include: {
                user: true
              }
            }
          }
        }
      }
    })

    for (const subscription of activeSubscriptions) {
      try {
        // Evaluar negocio
        const evaluation = await globalBusinessEvaluator.evaluate(subscription.organizationId)

        // Generar alerta según estado
        const alert = this.createAlertFromEvaluation(
          subscription.organizationId,
          subscription.organization.members[0]?.userId || "",
          evaluation
        )

        if (alert) {
          alerts.push(alert)
          // Guardar alerta en base de datos
          await this.saveAlert(alert)
        }
      } catch (error) {
        console.error(`Error generating alert for org ${subscription.organizationId}:`, error)
      }
    }

    return alerts
  }

  /**
   * Crear alerta desde evaluación
   */
  private createAlertFromEvaluation(
    organizationId: string,
    userId: string,
    evaluation: BusinessEvaluation
  ): Alert | null {
    // Solo generar alertas si hay algo importante que comunicar
    if (evaluation.status === "OK" && evaluation.score > 80) {
      // No generar alertas para negocios muy saludables (solo updates periódicos)
      return null
    }

    let type: "risk" | "opportunity" | "update"
    let priority: "high" | "medium" | "low"
    let title: string

    if (evaluation.status === "RIESGO") {
      type = "risk"
      priority = "high"
      title = "⚠️ Atención Requerida: Tu Negocio Necesita Acción"
    } else if (evaluation.status === "ATENCIÓN") {
      type = "opportunity"
      priority = "medium"
      title = "💡 Oportunidad Detectada: Puedes Mejorar Tu Negocio"
    } else {
      type = "update"
      priority = "low"
      title = "📊 Actualización: Estado de Tu Negocio"
    }

    return {
      id: `alert-${organizationId}-${Date.now()}`,
      organizationId,
      userId,
      type,
      priority,
      title,
      message: evaluation.alert,
      action: evaluation.action,
      evaluation,
      createdAt: new Date(),
      read: false
    }
  }

  /**
   * Guardar alerta en base de datos
   */
  private async saveAlert(alert: Alert): Promise<void> {
    try {
      // Usar SystemLog para almacenar alertas (o crear tabla Alert si es necesario)
      await prisma.systemLog.create({
        data: {
          level: alert.priority === "high" ? "error" : alert.priority === "medium" ? "warn" : "info",
          message: `${alert.title}: ${alert.message}`,
          metadata: JSON.stringify({
            type: alert.type,
            priority: alert.priority,
            organizationId: alert.organizationId,
            userId: alert.userId,
            action: alert.action,
            score: alert.evaluation.score,
            status: alert.evaluation.status
          }),
          source: "alert_system"
        }
      })
    } catch (error) {
      console.error("Error saving alert:", error)
    }
  }

  /**
   * Obtener alertas no leídas para un usuario
   */
  async getUnreadAlerts(userId: string): Promise<Alert[]> {
    // Obtener organizaciones del usuario
    const userOrganizations = await prisma.organizationMember.findMany({
      where: { userId },
      include: {
        organization: {
          include: {
            subscriptions: true
          }
        }
      }
    })

    const alerts: Alert[] = []

    for (const member of userOrganizations) {
      // Solo evaluar si tiene suscripción activa
      const subscription = member.organization.subscriptions[0]
      if (subscription?.status === "active") {
        try {
          const evaluation = await globalBusinessEvaluator.evaluate(member.organizationId)
          const alert = this.createAlertFromEvaluation(
            member.organizationId,
            userId,
            evaluation
          )

          if (alert) {
            alerts.push(alert)
          }
        } catch (error) {
          console.error(`Error getting alerts for org ${member.organizationId}:`, error)
        }
      }
    }

    // Ordenar por prioridad
    return alerts.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  /**
   * Marcar alerta como leída
   */
  async markAsRead(alertId: string): Promise<void> {
    // Implementar si se crea tabla Alert
    // Por ahora, las alertas se generan dinámicamente
  }
}

/**
 * 🌍 Instancia global
 */
export const globalAlertSystem = new AlertSystem()






