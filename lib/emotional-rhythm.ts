/**
 * 🎭 CONTROL DE RITMO EMOCIONAL
 * 
 * Regla crítica: Nunca más de 1 estímulo fuerte por sesión
 * (o baja score, o alerta, o upsell, no todo junto)
 * 
 * Si el sistema grita mucho, pierde autoridad.
 */

import { BusinessEvaluation, BusinessStatus } from "./business-evaluator"

export type StimulusType = "score_drop" | "alert" | "upsell" | "none"

export interface EmotionalState {
  hasStrongStimulus: boolean
  stimulusType: StimulusType
  shouldShowUpsell: boolean
  shouldShowAlert: boolean
  message: string
}

export class EmotionalRhythmController {
  /**
   * Controlar ritmo emocional de la sesión
   * Máximo 1 estímulo fuerte por sesión
   */
  controlRhythm(
    evaluation: BusinessEvaluation,
    previousScore: number | null,
    hasSeenUpsellThisSession: boolean
  ): EmotionalState {
    const scoreDropped = previousScore !== null && evaluation.score < previousScore - 5
    const isRisk = evaluation.status === "RIESGO"
    const needsUpsell = evaluation.score < 40 && !hasSeenUpsellThisSession

    // Determinar estímulo principal (solo 1)
    let stimulusType: StimulusType = "none"
    let shouldShowUpsell = false
    let shouldShowAlert = true // Por defecto mostrar alerta
    let message = ""

    if (scoreDropped && isRisk) {
      // Score bajó significativamente Y está en riesgo → Prioridad máxima
      stimulusType = "score_drop"
      shouldShowAlert = true
      shouldShowUpsell = false // No mostrar upsell si score acaba de bajar
      message = "Tu score bajó. Enfócate en esto primero."
    } else if (isRisk && needsUpsell) {
      // Está en riesgo pero score no bajó → Mostrar upsell
      stimulusType = "upsell"
      shouldShowUpsell = true
      shouldShowAlert = false // No mostrar alerta si ya hay upsell
      message = "Tu negocio necesita atención. Te ayudamos."
    } else if (isRisk) {
      // Solo riesgo, sin upsell → Mostrar alerta
      stimulusType = "alert"
      shouldShowAlert = true
      shouldShowUpsell = false
      message = "Tu negocio necesita atención."
    } else if (needsUpsell) {
      // Score bajo pero no riesgo → Upsell suave
      stimulusType = "upsell"
      shouldShowUpsell = true
      shouldShowAlert = false
      message = "Oportunidad de mejora."
    } else {
      // Todo normal
      stimulusType = "none"
      shouldShowAlert = true // Siempre mostrar alerta si no hay estímulo fuerte
      shouldShowUpsell = false
      message = ""
    }

    return {
      hasStrongStimulus: stimulusType !== "none",
      stimulusType,
      shouldShowUpsell,
      shouldShowAlert,
      message
    }
  }
}

/**
 * 🌍 Instancia global
 */
export const globalEmotionalRhythmController = new EmotionalRhythmController()






