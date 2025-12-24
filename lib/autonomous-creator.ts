/**
 * 🧠 CREADOR AUTÓNOMO
 * 
 * El sistema actúa como Founder Autónomo Junior:
 * Crea, prueba, mide, aprende.
 * Pero respeta al Founder Senior (el core que factura).
 * 
 * Frase guía: "Podés jugar en los bordes, pero no toques el motor mientras esté andando."
 */

import { globalExperimentalSystem } from "./experimental-system"
import { globalCoreProtection } from "./core-protection"
import { prisma } from "./prisma"

export type CreationType = "feature" | "metric" | "alert" | "automation" | "flow" | "product_idea"

export interface AutonomousCreation {
  id: string
  type: CreationType
  name: string
  description: string
  intuition: string // Por qué el sistema lo creó
  experimental: boolean
  createdAt: Date
  status: "active" | "paused" | "archived"
}

export class AutonomousCreator {
  /**
   * Crear nueva idea/producto/feature de forma autónoma
   * 
   * INTUICIÓN DIRIGIDA: Priorizar ideas que:
   * - Reduzcan fricción del upsell
   * - Aceleren RIESGO → ATENCIÓN
   * - Aumenten retorno sin email
   */
  async createAutonomously(
    type: CreationType,
    intuition: string
  ): Promise<AutonomousCreation | null> {
    // Verificar que no afecte el core
    const coreCheck = await globalCoreProtection.checkCoreImpact({
      affects: [],
      modifies: [type === "metric" ? "metric" : type === "alert" ? "rhythm" : "score"]
    })

    if (!coreCheck.safe) {
      // No crear si afecta core
      await this.logCreation({
        type,
        intuition,
        status: "rejected",
        reason: "Would affect protected core components"
      })
      return null
    }

    // Verificar protección del ritmo emocional
    // Ningún experimento puede:
    // - Aumentar estímulos por sesión
    // - Duplicar alertas
    // - Competir con upsell del core
    if (type === "alert" || intuition.toLowerCase().includes("alerta") || intuition.toLowerCase().includes("estímulo")) {
      await this.logCreation({
        type,
        intuition,
        status: "rejected",
        reason: "Would interfere with emotional rhythm (max 1 stimulus per session)"
      })
      return null
    }

    if (intuition.toLowerCase().includes("upsell") && !intuition.toLowerCase().includes("reducir fricción")) {
      await this.logCreation({
        type,
        intuition,
        status: "rejected",
        reason: "Would compete with core upsell system"
      })
      return null
    }

    // Crear como experimental
    const experiment = await globalExperimentalSystem.createExperiment(
      `Autonomous ${type}`,
      intuition,
      type,
      {
        autonomous: true,
        createdAt: new Date().toISOString()
      }
    )

    const creation: AutonomousCreation = {
      id: experiment.id,
      type,
      name: experiment.name,
      description: experiment.description,
      intuition,
      experimental: true,
      createdAt: new Date(),
      status: "active"
    }

    // Loggear creación
    await this.logCreation({
      type,
      intuition,
      status: "created",
      experimentId: experiment.id
    })

    return creation
  }

  /**
   * Evaluar creaciones autónomas periódicamente
   */
  async evaluateCreations(): Promise<{
    promoted: number
    archived: number
    paused: number
    active: number
  }> {
    const experiments = await globalExperimentalSystem.listActiveExperiments()
    
    let promoted = 0
    let archived = 0
    let paused = 0
    let active = 0

    for (const experiment of experiments) {
      const evaluation = await globalExperimentalSystem.evaluateExperiment(experiment.id)

      if (evaluation.shouldPromote) {
        await globalExperimentalSystem.promoteToCore(experiment.id)
        promoted++
      } else if (evaluation.shouldArchive) {
        // Archivar experimento
        await prisma.systemLog.create({
          data: {
            level: "info",
            message: `Experiment archived: ${experiment.name}`,
            metadata: JSON.stringify({
              type: "experiment_archived",
              experimentId: experiment.id,
              reason: evaluation.reason
            }),
            source: "autonomous_creator"
          }
        })
        archived++
      } else if (evaluation.shouldPause) {
        // Pausar experimento
        await prisma.systemLog.create({
          data: {
            level: "warn",
            message: `Experiment paused: ${experiment.name}`,
            metadata: JSON.stringify({
              type: "experiment_paused",
              experimentId: experiment.id,
              reason: evaluation.reason
            }),
            source: "autonomous_creator"
          }
        })
        paused++
      } else {
        active++
      }
    }

    return {
      promoted,
      archived,
      paused,
      active
    }
  }

  /**
   * Loggear creación autónoma
   */
  private async logCreation(data: {
    type: CreationType
    intuition: string
    status: "created" | "rejected"
    reason?: string
    experimentId?: string
  }): Promise<void> {
    await prisma.systemLog.create({
      data: {
        level: data.status === "created" ? "info" : "warn",
        message: `Autonomous creation ${data.status}: ${data.type}`,
        metadata: JSON.stringify({
          type: "autonomous_creation",
          creationType: data.type,
          intuition: data.intuition,
          status: data.status,
          reason: data.reason,
          experimentId: data.experimentId,
          timestamp: new Date().toISOString()
        }),
        source: "autonomous_creator"
      }
    })
  }
}

/**
 * 🌍 Instancia global
 */
export const globalAutonomousCreator = new AutonomousCreator()


