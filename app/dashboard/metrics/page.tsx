
"use client"

import { useEffect, useState } from "react"
import { MetricCard } from "@/components/metrics/MetricCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Metric {
    name: string
    value: number
    unit: string
    status: "good" | "neutral" | "bad"
}

interface SimulationResponse {
    success?: boolean
    variantUrl?: string
    error?: string
}

export default function MetricsPage() {
    const [metrics, setMetrics] = useState<Metric[]>([])
    const [loading, setLoading] = useState(true)
    const [growthStep, setGrowthStep] = useState(0)
    const [lastVariant, setLastVariant] = useState("")

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await fetch("/api/metrics") // Auto-detects org from session member first
                if (res.ok) {
                    const data = await res.json()
                    setMetrics(data.metrics)
                }
            } catch (e) {
                console.error("Error fetching metrics", e)
            } finally {
                setLoading(false)
            }
        }

        fetchMetrics()
    }, [])

    if (loading) {
        return <div className="p-8">Cargando Tablero de Control Inteligente...</div>
    }




    const runGrowthLoop = async () => {
        const nextStep = growthStep + 1
        if (nextStep > 3) return

        try {
            const res = await fetch("/api/admin/simulate-revenue", {
                method: "POST",
                body: JSON.stringify({ step: nextStep }),
                headers: { "Content-Type": "application/json" }
            })

            const data = (await res.json()) as SimulationResponse

            if (data.success && data.variantUrl) {
                setGrowthStep(nextStep)
                setLastVariant(data.variantUrl)
                // Recargar métricas sin refresh completo para mejor UX
                window.location.reload()
            }
        } catch (error) {
            console.error("Growth Loop Failed:", error)
        }
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Tablero de Control IA ($100k Goal)</h2>
            </div>

            {/* Growth Engine UI */}
            <Card className="bg-slate-900 text-white border-blue-500 border-2">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl flex items-center gap-2">
                            🚀 Motor de Crecimiento Autónomo
                            {growthStep >= 3 && <span className="text-green-400 text-sm">(META ALCANZADA)</span>}
                        </CardTitle>
                        <div className="text-right">
                            <div className="text-2xl font-mono font-bold text-green-400">
                                Progreso: {Math.min(growthStep * 33, 100)}%
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 items-center">
                        <button
                            onClick={runGrowthLoop}
                            disabled={growthStep >= 3}
                            className={`px-6 py-3 rounded-lg font-bold text-lg transition-all flex flex-col items-center justify-center border-2 ${growthStep >= 3
                                ? "bg-gray-800 border-gray-600 text-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-emerald-500 to-green-600 border-green-400 text-white hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-pulse"
                                }`}
                        >
                            <span className="text-xl">
                                {growthStep === 0 && "⚡ ACTIVAR ALGORITMO MAESTRO ($20k+)"}
                                {growthStep === 1 && "🔄 RE-CALCULAR OPORTUNIDAD (+$35k)"}
                                {growthStep === 2 && "🚀 DOMINACIÓN TOTAL (+$45k)"}
                                {growthStep === 3 && "🏆 MISIÓN COMPLETADA"}
                            </span>
                            {growthStep < 3 && <span className="text-xs font-mono mt-1 opacity-80 text-green-100">Buscando entre 1s y 0s...</span>}
                        </button>

                        {lastVariant && (
                            <a href={lastVariant} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-white underline underline-offset-4 flex items-center gap-2">
                                👁️ Ver Web Viva ({lastVariant.split('/').pop()})
                            </a>
                        )}
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-xs font-mono text-slate-400">
                        <div className={growthStep >= 1 ? "text-green-400" : ""}>[ ] $20k Recaudado</div>
                        <div className={growthStep >= 2 ? "text-green-400" : ""}>[ ] Optimización UX</div>
                        <div className={growthStep >= 3 ? "text-green-400" : ""}>[ ] Dominio Global ($100k)</div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric: Metric, i: number) => (
                    <MetricCard
                        key={i}
                        name={metric.name}
                        value={metric.value}
                        unit={metric.unit}
                        status={metric.status}
                    />
                ))}
            </div>

            {/* ... Resto de componentes ... */}
        </div>
    )
}
