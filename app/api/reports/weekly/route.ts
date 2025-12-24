import { NextResponse } from "next/server"
import { globalWeeklyReportGenerator } from "@/lib/weekly-report"
import { getErrorMessage } from "@/lib/utils"

/**
 * 📊 Endpoint para reporte semanal automático (INTERNO)
 * 
 * Genera reporte semanal interno (no visible al usuario):
 * - Experimentos activos
 * - Estado (promover / observar / archivar)
 * - Impacto en ingresos/retención
 */
export async function GET() {
  try {
    // Generar reporte semanal
    const report = await globalWeeklyReportGenerator.generateWeeklyReport()

    return NextResponse.json({
      success: true,
      report,
      generatedAt: new Date().toISOString()
    })
  } catch (error: unknown) {
    console.error("Weekly report error:", error)
    return NextResponse.json(
      { error: getErrorMessage(error) || "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST para forzar generación de reporte
 */
export async function POST() {
  try {
    const report = await globalWeeklyReportGenerator.generateWeeklyReport()

    return NextResponse.json({
      success: true,
      report,
      message: "Weekly report generated successfully"
    })
  } catch (error: unknown) {
    console.error("Weekly report generation error:", error)
    return NextResponse.json(
      { error: getErrorMessage(error) || "Internal server error" },
      { status: 500 }
    )
  }
}





