/**
 * 📊 REPORTE SEMANAL AUTOMÁTICO (INTERNO)
 * 
 * Genera reporte semanal interno (no visible al usuario):
 * - Experimentos activos
 * - Estado (promover / observar / archivar)
 * - Impacto en ingresos/retención
 * 
 * Nada más.
 */

import { prisma } from "./prisma"
import { globalExperimentalSystem } from "./experimental-system"
import { globalCriticalMetricsCollector } from "./critical-metrics"

export interface WeeklyReport {
  week: string
  experiments: {
    active: number
    promoting: number
    observing: number
    archiving: number
    paused: number
  }
  impact: {
    revenueChange: number // % cambio
    retentionChange: number // % cambio
  }
  recommendations: string[]
}

export class WeeklyReportGenerator {
  /**
   * Generar reporte semanal automático
   */
  async generateWeeklyReport(): Promise<WeeklyReport> {
    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setDate(weekStart.getDate() - 7)

    // Obtener experimentos activos
    const activeExperiments = await globalExperimentalSystem.listActiveExperiments()

    // Evaluar cada experimento
    let promoting = 0
    let observing = 0
    let archiving = 0
    let paused = 0

    for (const experiment of activeExperiments) {
      const evaluation = await globalExperimentalSystem.evaluateExperiment(experiment.id)

      if (evaluation.shouldPromote) {
        promoting++
      } else if (evaluation.shouldArchive) {
        archiving++
      } else if (evaluation.shouldPause) {
        paused++
      } else {
        observing++
      }
    }

    // Obtener métricas críticas actuales
    const currentMetrics = await globalCriticalMetricsCollector.collectMetrics()

    // Obtener métricas de hace 7 días (baseline)
    // Por ahora usar valores actuales como proxy
    // En producción, guardar snapshot semanal

    const report: WeeklyReport = {
      week: `${weekStart.toISOString().split('T')[0]} to ${now.toISOString().split('T')[0]}`,
      experiments: {
        active: activeExperiments.length,
        promoting,
        observing,
        archiving,
        paused
      },
      impact: {
        revenueChange: 0, // Calcular comparando con baseline
        retentionChange: 0 // Calcular comparando con baseline
      },
      recommendations: this.generateRecommendations(activeExperiments.length, promoting, archiving)
    }

    // Guardar reporte
    await this.saveReport(report)

    return report
  }

  /**
   * Generar recomendaciones basadas en estado
   */
  private generateRecommendations(
    activeCount: number,
    promoting: number,
    archiving: number
  ): string[] {
    const recommendations: string[] = []

    if (activeCount >= 3) {
      recommendations.push("Máximo de experimentos activos alcanzado. Promover o archivar antes de crear nuevos.")
    }

    if (promoting > 0) {
      recommendations.push(`${promoting} experimento(s) listo(s) para promover a core.`)
    }

    if (archiving > 0) {
      recommendations.push(`${archiving} experimento(s) sin impacto. Considerar archivar.`)
    }

    if (activeCount === 0) {
      recommendations.push("No hay experimentos activos. Sistema puede crear nuevo experimento.")
    }

    return recommendations
  }

  /**
   * Guardar reporte en base de datos
   */
  private async saveReport(report: WeeklyReport): Promise<void> {
    await prisma.systemLog.create({
      data: {
        level: "info",
        message: `Weekly report generated: ${report.experiments.active} active experiments`,
        metadata: JSON.stringify({
          type: "weekly_report",
          report,
          generatedAt: new Date().toISOString()
        }),
        source: "weekly_report_generator"
      }
    })
  }

  /**
   * Obtener último reporte
   */
  async getLastReport(): Promise<WeeklyReport | null> {
    const lastReport = await prisma.systemLog.findFirst({
      where: {
        source: "weekly_report_generator",
        metadata: {
          contains: `"type":"weekly_report"`
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    if (!lastReport) {
      return null
    }

    try {
      const metadata = JSON.parse(lastReport.metadata || "{}")
      return metadata.report as WeeklyReport
    } catch {
      return null
    }
  }
}

/**
 * 🌍 Instancia global
 */
export const globalWeeklyReportGenerator = new WeeklyReportGenerator()





