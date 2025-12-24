"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { intuitSolution, SolutionConfig } from "@/lib/factory"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Zap, Lock, ArrowRight } from "lucide-react"

export default function DynamicSolutionPage() {
    const params = useParams()
    // Ensure intent is a string (handle array case if necessary, though [intent] usually returns string)
    const intentRaw = params.intent
    const intent = Array.isArray(intentRaw) ? intentRaw[0] : intentRaw

    const [solution, setSolution] = useState<SolutionConfig | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (intent) {
            // Simulate "Thinking" time of the AI
            setTimeout(() => {
                setSolution(intuitSolution(decodeURIComponent(intent)))
                setLoading(false)
            }, 1500)
        }
    }, [intent])

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-xl animate-pulse text-blue-400">Intuyendo solución para: &quot;{decodeURIComponent(intent || '')}&quot;...</p>
            </div>
        )
    }

    if (!solution) return null

    const Icon = solution.icon

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
            {/* Background Gradients */}
            <div className={`fixed inset-0 bg-gradient-to-br ${solution.colorTheme} opacity-10 pointer-events-none`} />

            <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">

                {/* Header */}
                <div className="text-center space-y-6 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-slate-900/50 border border-slate-800 shadow-2xl mb-4">
                        <Icon className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        {solution.title}
                    </h1>
                    <p className="text-2xl text-slate-400 font-light max-w-2xl mx-auto">
                        {solution.subtitle}
                    </p>
                </div>

                {/* Interactive Dashboard Preview */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {solution.metrics.map((metric, i) => (
                        <Card key={i} className="bg-slate-900/40 border-slate-800 backdrop-blur-md hover:bg-slate-900/60 transition-colors">
                            <CardContent className="p-6">
                                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-2">{metric.label}</p>
                                <div className="flex items-baseline gap-1">
                                    {metric.type === 'currency' && <span className="text-2xl font-bold text-slate-400">$</span>}
                                    <span className="text-4xl font-bold text-white">
                                        {metric.type === 'percent' ? Math.floor(Math.random() * 100) : Math.floor(Math.random() * 10000)}
                                    </span>
                                    {metric.type === 'percent' && <span className="text-2xl font-bold text-slate-400">%</span>}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* AI Analysis (The Hook) */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-12 flex items-start gap-4 animate-in fade-in duration-1000 delay-500">
                    <Zap className="w-6 h-6 text-yellow-400 shrink-0 mt-1" />
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-yellow-100">Diagnóstico de I.A.</h3>
                        <p className="text-lg text-slate-300 leading-relaxed">
                            &quot;{solution.advice}&quot;
                        </p>
                    </div>
                </div>

                {/* The Paywall / CTA */}
                <div className="text-center space-y-8">
                    <div className="inline-block relative group">
                        <div className={`absolute -inset-1 bg-gradient-to-r ${solution.colorTheme} rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200`} />
                        <Button className="relative text-xl px-12 py-8 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white">
                            <span className="mr-2">Desbloquear Sistema Completo</span>
                            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-amber-500">
                                ${solution.price} ARS
                            </span>
                            <ArrowRight className="ml-4 w-6 h-6" />
                        </Button>
                    </div>

                    <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
                        <Lock className="w-4 h-4" />
                        Pago seguro procesado por Mercado Pago
                    </p>
                </div>

            </div>
        </div>
    )
}
