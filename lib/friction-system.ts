/**
 * 🎯 SISTEMA DE FRICCIÓN INTELIGENTE
 * 
 * Cuando score < 30:
 * - Reducir visibilidad de métricas avanzadas
 * - No bloquear, pero "opacar"
 * - Aumenta conversión sin castigar
 */

import { BusinessEvaluation } from "./business-evaluator"

export interface FrictionConfig {
  showAdvancedMetrics: boolean
  opacity: number // 0-1, donde 1 = completamente visible
  message: string
  cta: string
}

export class FrictionSystem {
  /**
   * Aplicar fricción inteligente según score
   */
  applyFriction(evaluation: BusinessEvaluation): FrictionConfig {
    if (evaluation.score < 30) {
      // Score crítico: Opacar métricas avanzadas
      return {
        showAdvancedMetrics: true, // No bloquear, solo opacar
        opacity: 0.4, // 40% de opacidad
        message: "Desbloqueá métricas avanzadas para ver el análisis completo",
        cta: "Ver análisis completo"
      }
    }

    if (evaluation.score < 40) {
      // Score bajo: Reducir visibilidad
      return {
        showAdvancedMetrics: true,
        opacity: 0.6, // 60% de opacidad
        message: "Mejorá tu score para acceder a todas las métricas",
        cta: "Mejorar score"
      }
    }

    // Score normal: Todo visible
    return {
      showAdvancedMetrics: true,
      opacity: 1.0, // 100% visible
      message: "",
      cta: ""
    }
  }
}

/**
 * 🌍 Instancia global
 */
export const globalFrictionSystem = new FrictionSystem()






