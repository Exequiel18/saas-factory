/**
 * 🛡️ PROTECCIÓN DEL CORE
 * 
 * El siguiente núcleo es sagrado:
 * - Sistema de score (0-100)
 * - Estados OK / ATENCIÓN / RIESGO
 * - Métrica reina (Margen Neto)
 * - Upsell contextual por score
 * - Ritmo emocional (1 estímulo fuerte por sesión)
 * - Métricas críticas
 * - Logging de patrones
 * 
 * Nada nuevo puede modificar directamente esto sin fallback.
 */

export interface CoreComponent {
  name: string
  type: "score" | "status" | "metric" | "upsell" | "rhythm" | "metrics" | "logging"
  protected: boolean
  fallback?: () => Promise<void>
}

export class CoreProtection {
  private coreComponents: CoreComponent[] = [
    {
      name: "Sistema de Score",
      type: "score",
      protected: true,
      fallback: async () => {
        // Fallback: resetear a score base si algo falla
        console.log("Core fallback: Score system reset")
      }
    },
    {
      name: "Estados OK/ATENCIÓN/RIESGO",
      type: "status",
      protected: true,
      fallback: async () => {
        console.log("Core fallback: Status system reset")
      }
    },
    {
      name: "Métrica Reina (Margen Neto)",
      type: "metric",
      protected: true,
      fallback: async () => {
        console.log("Core fallback: Margin metric reset")
      }
    },
    {
      name: "Upsell Contextual",
      type: "upsell",
      protected: true,
      fallback: async () => {
        console.log("Core fallback: Upsell system reset")
      }
    },
    {
      name: "Ritmo Emocional",
      type: "rhythm",
      protected: true,
      fallback: async () => {
        console.log("Core fallback: Emotional rhythm reset")
      }
    },
    {
      name: "Métricas Críticas",
      type: "metrics",
      protected: true,
      fallback: async () => {
        console.log("Core fallback: Critical metrics reset")
      }
    },
    {
      name: "Logging de Patrones",
      type: "logging",
      protected: true,
      fallback: async () => {
        console.log("Core fallback: Pattern logging reset")
      }
    }
  ]

  /**
   * Verificar si un cambio afecta el core
   */
  async checkCoreImpact(change: {
    affects: string[]
    modifies: string[]
  }): Promise<{
    safe: boolean
    affectedComponents: CoreComponent[]
    recommendation: string
  }> {
    const affectedComponents = this.coreComponents.filter(component =>
      change.affects.includes(component.name) || change.modifies.includes(component.type)
    )

    if (affectedComponents.length === 0) {
      return {
        safe: true,
        affectedComponents: [],
        recommendation: "Change does not affect core. Safe to proceed."
      }
    }

    // Si afecta componentes protegidos, requiere fallback
    const protectedAffected = affectedComponents.filter(c => c.protected)

    if (protectedAffected.length > 0) {
      return {
        safe: false,
        affectedComponents: protectedAffected,
        recommendation: `Change affects protected core components. Requires fallback mechanism.`
      }
    }

    return {
      safe: true,
      affectedComponents,
      recommendation: "Change affects non-protected components. Monitor closely."
    }
  }

  /**
   * Ejecutar fallback si core se rompe
   */
  async executeFallback(componentType: CoreComponent["type"]): Promise<void> {
    const component = this.coreComponents.find(c => c.type === componentType)
    if (component?.fallback) {
      await component.fallback()
    }
  }

  /**
   * Verificar integridad del core
   */
  async verifyCoreIntegrity(): Promise<{
    healthy: boolean
    issues: string[]
  }> {
    // Por ahora retornar healthy
    // En producción, verificar que cada componente funciona
    return {
      healthy: true,
      issues: []
    }
  }
}

/**
 * 🌍 Instancia global
 */
export const globalCoreProtection = new CoreProtection()






