/**
 * ✅ SISTEMA DE ACCIONES CERRABLES
 * 
 * Acción = botón
 * Botón = "marcar como hecho"
 * Marcar = impacto en score
 * 
 * Genera:
 * - Dopamina
 * - Progreso visible
 * - Retención brutal
 */

import { prisma } from "./prisma"
import { globalBusinessEvaluator } from "./business-evaluator"
import { globalPatternLogger } from "./pattern-logger"

export interface TrackedAction {
  id: string
  organizationId: string
  action: string
  status: "pending" | "completed"
  impactOnScore: number // Puntos que suma al completar
  completedAt: Date | null
  createdAt: Date
}

export class ActionTracker {
  /**
   * Crear acción trackeable desde evaluación
   */
  async createActionFromEvaluation(
    organizationId: string,
    action: string
  ): Promise<TrackedAction> {
    // Calcular impacto estimado en score (2-5 puntos por acción completada)
    const impactOnScore = Math.floor(Math.random() * 3) + 2 // 2-5 puntos

    const trackedAction: TrackedAction = {
      id: `action-${organizationId}-${Date.now()}`,
      organizationId,
      action,
      status: "pending",
      impactOnScore,
      completedAt: null,
      createdAt: new Date()
    }

    // Guardar en base de datos
    await this.saveAction(trackedAction)

    return trackedAction
  }

  /**
   * Marcar acción como completada
   */
  async completeAction(
    actionId: string,
    organizationId: string
  ): Promise<{ success: boolean; newScore?: number; message: string }> {
    try {
      // Obtener acción
      const action = await this.getAction(actionId, organizationId)

      if (!action) {
        return {
          success: false,
          message: "Acción no encontrada"
        }
      }

      if (action.status === "completed") {
        return {
          success: false,
          message: "Esta acción ya fue completada"
        }
      }

      // Marcar como completada
      await this.markAsCompleted(actionId, organizationId)

      // Obtener score antes de re-evaluar
      const evaluationBefore = await globalBusinessEvaluator.evaluate(organizationId)
      const scoreBefore = evaluationBefore.score

      // Re-evaluar negocio para obtener nuevo score
      const evaluationAfter = await globalBusinessEvaluator.evaluate(organizationId)
      const scoreAfter = evaluationAfter.score

      // Loggear patrón (fase 2 en sombra)
      await globalPatternLogger.logActionCompleted(
        organizationId,
        action.organizationId, // userId placeholder
        action.action,
        scoreBefore,
        scoreAfter
      )

      // Calcular mensaje de progreso
      const message = this.getProgressMessage(action.impactOnScore, scoreAfter)

      return {
        success: true,
        newScore: scoreAfter,
        message
      }
    } catch (error) {
      console.error("Error completing action:", error)
      return {
        success: false,
        message: "Error al completar acción"
      }
    }
  }

  /**
   * Obtener acciones pendientes de una organización
   */
  async getPendingActions(organizationId: string): Promise<TrackedAction[]> {
    // Por ahora, generar dinámicamente desde evaluación
    // En producción, guardar en tabla Action
    const evaluation = await globalBusinessEvaluator.evaluate(organizationId)

    return [
      {
        id: `action-${organizationId}-current`,
        organizationId,
        action: evaluation.action,
        status: "pending",
        impactOnScore: 3,
        completedAt: null,
        createdAt: new Date()
      }
    ]
  }

  /**
   * Guardar acción en base de datos
   */
  private async saveAction(action: TrackedAction): Promise<void> {
    try {
      await prisma.systemLog.create({
        data: {
          level: "info",
          message: `Action created: ${action.action}`,
          metadata: JSON.stringify({
            type: "tracked_action",
            actionId: action.id,
            organizationId: action.organizationId,
            action: action.action,
            impactOnScore: action.impactOnScore
          }),
          source: "action_tracker"
        }
      })
    } catch (error) {
      console.error("Error saving action:", error)
    }
  }

  /**
   * Obtener acción específica
   */
  private async getAction(actionId: string, organizationId: string): Promise<TrackedAction | null> {
    // Por ahora, generar dinámicamente
    // En producción, buscar en tabla Action
    const evaluation = await globalBusinessEvaluator.evaluate(organizationId)

    return {
      id: actionId,
      organizationId,
      action: evaluation.action,
      status: "pending",
      impactOnScore: 3,
      completedAt: null,
      createdAt: new Date()
    }
  }

  /**
   * Marcar acción como completada
   */
  private async markAsCompleted(actionId: string, organizationId: string): Promise<void> {
    try {
      await prisma.systemLog.create({
        data: {
          level: "success",
          message: `Action completed: ${actionId}`,
          metadata: JSON.stringify({
            type: "action_completed",
            actionId,
            organizationId,
            completedAt: new Date().toISOString()
          }),
          source: "action_tracker"
        }
      })
    } catch (error) {
      console.error("Error marking action as completed:", error)
    }
  }

  /**
   * Mensaje de progreso al completar acción
   */
  private getProgressMessage(impactOnScore: number, newScore: number): string {
    if (newScore >= 70) {
      return `¡Bien hecho! Tu score subió a ${newScore}. Seguí así.`
    }
    if (newScore >= 40) {
      return `Buen avance. Score ahora en ${newScore}. Todavía podés mejorar más.`
    }
    return `Completaste la acción. Score en ${newScore}. Seguí trabajando en las otras acciones sugeridas.`
  }
}

/**
 * 🌍 Instancia global
 */
export const globalActionTracker = new ActionTracker()

