"use client"

import { useState, useEffect, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Calculator, Lock, TrendingUp, Zap, AlertTriangle,
    CheckCircle2, DollarSign, BarChart3, PieChart,
    ArrowUpRight, ArrowDownRight, Info, ShieldCheck,
    Cpu, Globe, Rocket
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function CalculatorPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-cyan-500/30">
            <Suspense fallback={<div className="flex h-screen items-center justify-center font-black animate-pulse text-cyan-500">INITIATING TERMINAL...</div>}>
                <CalculatorContent />
            </Suspense>
        </div>
    )
}

function CalculatorContent() {
    const searchParams = useSearchParams()

    const [revenue, setRevenue] = useState<number>(0)
    const [costs, setCosts] = useState<number>(0)
    const [fixedCosts, setFixedCosts] = useState<number>(0)
    const [variableCosts, setVariableCosts] = useState<number>(0)

    const [aiFeedback, setAiFeedback] = useState<string>("Esperando datos para análisis neuronal...")
    const [score, setScore] = useState<number>(0)
    const [unlocked, setUnlocked] = useState(false)

    const netMargin = revenue > 0 ? ((revenue - costs) / revenue) * 100 : 0
    const breakEven = (1 - (variableCosts / (revenue || 1))) !== 0
        ? fixedCosts / (1 - (variableCosts / (revenue || 1)))
        : 0

    useEffect(() => {
        if (searchParams.get('status') === 'success') {
            setUnlocked(true)
            setAiFeedback("🌟 NIVEL IMPERIAL DESBLOQUEADO. El algoritmo ha identificado 3 puntos de fuga masivos en tu flujo de caja.")
        }
    }, [searchParams])

    const handleCheckout = async () => {
        try {
            const response = await fetch('/api/mercadopago/cash-checkout', {
                method: 'POST',
                body: JSON.stringify({ leadId: 'anonymous', niche: 'calculator_user' }),
                headers: { 'Content-Type': 'application/json' }
            })
            const data = await response.json()
            if (data.url) window.location.href = data.url
        } catch (error) {
            console.error("Checkout link failed", error)
        }
    }

    useEffect(() => {
        if (revenue === 0) return;

        let newScore = 50
        let insight = ""

        if (netMargin > 20) newScore += 20
        if (netMargin > 40) newScore += 10
        if (netMargin < 10) newScore -= 20
        if (costs > revenue) newScore = 15

        const fixedRatio = fixedCosts / (revenue || 1)
        const variableRatio = variableCosts / (revenue || 1)

        if (fixedRatio > 0.4) insight = "⚠️ VULNERABILIDAD ESTRUCTURAL: Tus costos fijos están canibalizando tu margen. Necesitas pivotar a un modelo de servicio automatizado."
        else if (variableRatio > 0.6) insight = "💸 INEFICIENCIA OPERATIVA: Cada venta te está costando demasiado. Escalabilidad en riesgo por costos variables descontrolados."
        else if (netMargin > 30) insight = "🚀 ZONA DE EXPANSIÓN: Tienes un motor de efectivo limpio. Recomiendo duplicar el gasto en marketing inmediatamente."
        else insight = "⚖️ EQUILIBRIO FRÁGIL: El negocio es funcional pero no soberano. Falta de apalancamiento tecnológico detectada en la estructura."

        setScore(Math.min(100, Math.max(0, newScore)))
        setAiFeedback(insight)
    }, [revenue, costs, fixedCosts, variableCosts, netMargin])

    return (
        <div className="relative pt-24 pb-20 px-6">
            {/* Grid background & Light effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-6"
                    >
                        <Cpu className="w-3 h-3" /> Terminal de Diagnóstico Imperial
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-4">
                        Salud de <span className="text-cyan-500">Flujo de Caja</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                        Analiza la eficiencia de tu motor de ingresos y detecta fugas de capital con precisión algorítmica.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* INPUTS COLUMN */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="bg-[#0f172a]/60 backdrop-blur-3xl border-white/5 rounded-[2rem] overflow-hidden">
                            <CardHeader className="border-b border-white/5 pb-8">
                                <CardTitle className="flex items-center gap-3 text-xl font-black italic uppercase tracking-tight">
                                    <div className="p-2 bg-cyan-500 rounded-lg">
                                        <BarChart3 className="w-5 h-5 text-black" />
                                    </div>
                                    Métricas Base
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-8 space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Ingresos Mensuales ($)</Label>
                                    <Input
                                        type="number"
                                        placeholder="000.000"
                                        className="bg-black/50 border-white/5 h-14 text-xl font-bold rounded-xl focus-visible:ring-cyan-500"
                                        onChange={(e) => setRevenue(Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Costos Operativos ($)</Label>
                                    <Input
                                        type="number"
                                        placeholder="000.000"
                                        className="bg-black/50 border-white/5 h-14 text-xl font-bold rounded-xl focus-visible:ring-cyan-500"
                                        onChange={(e) => setCosts(Number(e.target.value))}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Fijos</Label>
                                        <Input
                                            type="number"
                                            placeholder="Fijos"
                                            className="bg-black/20 border-white/5 h-12 text-sm rounded-xl"
                                            onChange={(e) => setFixedCosts(Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Variables</Label>
                                        <Input
                                            type="number"
                                            placeholder="Var"
                                            className="bg-black/20 border-white/5 h-12 text-sm rounded-xl"
                                            onChange={(e) => setVariableCosts(Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* AI FEEDBACK */}
                        <div className={`p-8 rounded-[2rem] border-l-8 transition-all duration-700 bg-white/[0.02] backdrop-blur-md ${score > 70 ? 'border-cyan-500' : score > 40 ? 'border-yellow-500' : 'border-red-500'
                            }`}>
                            <div className="flex gap-4">
                                <Zap className={`w-10 h-10 mt-1 shrink-0 ${score > 70 ? 'text-cyan-500' : score > 40 ? 'text-yellow-500' : 'text-red-500'
                                    }`} />
                                <div>
                                    <h4 className="font-black italic uppercase tracking-widest text-xs mb-2 text-slate-400">Sinopsis del Agente</h4>
                                    <p className="text-md font-medium leading-relaxed italic">{aiFeedback}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DASHBOARD COLUMN */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Primary Dashboard Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <MetricDisplay
                                label="Margen Neto"
                                value={`${netMargin.toFixed(1)}%`}
                                subText={netMargin > 20 ? "Óptimo" : "Crítico"}
                                icon={<TrendingUp className="w-5 h-5" />}
                                trend={netMargin > 0 ? "up" : "down"}
                            />
                            <MetricDisplay
                                label="Punto Equilibrio"
                                value={`$${breakEven.toLocaleString()}`}
                                subText="Meta Mensual"
                                icon={<Target className="w-5 h-5" />}
                            />
                            <MetricDisplay
                                label="Flujo Libre"
                                value={`$${(revenue - costs).toLocaleString()}`}
                                subText="Capital Disponible"
                                icon={<DollarSign className="w-5 h-5" />}
                                highlight={revenue > costs}
                            />
                        </div>

                        {/* ADVANCED SECTION / PAYWALL */}
                        <div className="relative">
                            {!unlocked && (
                                <div className="absolute inset-0 z-20 rounded-[3rem] overflow-hidden border border-white/10 group">
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md group-hover:bg-black/80 transition-colors duration-500" />
                                    <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
                                        <div className="p-4 rounded-3xl bg-yellow-500/10 border border-yellow-500/20 mb-6">
                                            <Lock className="w-12 h-12 text-yellow-500 animate-pulse" />
                                        </div>
                                        <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Métricas de Soberanía</h3>
                                        <p className="text-slate-400 text-lg max-w-md mb-8">
                                            Calcula el LTV real, CAC proyectado y ROI de reinversión para escalar al siguiente nivel.
                                        </p>
                                        <Button
                                            size="lg"
                                            onClick={handleCheckout}
                                            className="h-16 px-12 bg-white text-black hover:bg-yellow-500 transition-all font-black text-xl rounded-2xl group shadow-[0_0_50px_rgba(255,255,255,0.1)]"
                                        >
                                            DESBLOQUEAR REPORTE
                                            <ArrowUpRight className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${!unlocked ? 'opacity-20 blur-sm pointer-events-none' : ''}`}>
                                <Card className="bg-white/5 border-white/5 rounded-[2.5rem] p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <Badge className="bg-cyan-500 text-black font-black uppercase tracking-tighter italic">LTV Proyectado</Badge>
                                        <ShieldCheck className="text-cyan-500 w-6 h-6" />
                                    </div>
                                    <div className="text-4xl font-black mb-2">$8,540.00</div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Valor de ciclo de vida del cliente</p>
                                </Card>
                                <Card className="bg-white/5 border-white/5 rounded-[2.5rem] p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <Badge className="bg-purple-500 text-white font-black uppercase tracking-tighter italic">CAC Máximo</Badge>
                                        <Rocket className="text-purple-500 w-6 h-6" />
                                    </div>
                                    <div className="text-4xl font-black mb-2">$425.00</div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Costo adquisición permitido</p>
                                </Card>
                                <div className="md:col-span-2 p-10 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-white/5 rounded-[3rem] text-center">
                                    <h4 className="text-2xl font-black italic uppercase mb-2">📥 ARCHIVO DE CRECIMIENTO GENERADO</h4>
                                    <p className="text-slate-400 mb-6">Hemos consolidado 3 estrategias de reinversión basadas en tu ratio de Margen/CAC.</p>
                                    <Button variant="outline" className="border-cyan-500/20 hover:bg-cyan-500 hover:text-black rounded-xl font-bold px-8">DESCARGAR ESTRATEGIA (PDF)</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Score Circle Sticky Mini */}
                <div className="fixed bottom-10 right-10 z-50">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="p-6 rounded-full bg-black/60 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex items-center gap-4"
                    >
                        <div className="relative w-16 h-16">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                <circle
                                    cx="50" cy="50" r="45" fill="none"
                                    stroke={score > 70 ? '#06b6d4' : score > 40 ? '#f59e0b' : '#ef4444'}
                                    strokeWidth="8"
                                    strokeDasharray="283"
                                    strokeDashoffset={283 - (283 * score / 100)}
                                    className="transition-all duration-1000 ease-out"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center font-black text-xl italic">{score}</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Global Health</div>
                            <div className={`font-black italic uppercase ${score > 70 ? 'text-cyan-400' : 'text-yellow-400'}`}>
                                {score > 70 ? 'Sovereign' : score > 40 ? 'Stable' : 'Risk'}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

function MetricDisplay({ label, value, subText, icon, trend, highlight }: any) {
    return (
        <Card className={`bg-white/[0.03] border-white/5 rounded-3xl p-6 hover:bg-white/[0.05] transition-all duration-300 group ${highlight ? 'border-cyan-500/30 ring-1 ring-cyan-500/10' : ''}`}>
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 ${trend === 'up' ? 'text-cyan-400' : 'text-red-400'}`}>
                        {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        <span className="text-[10px] font-black uppercase tracking-tighter">8.4%</span>
                    </div>
                )}
            </div>
            <div className={`text-4xl font-black italic tracking-tighter mb-1 ${highlight ? 'text-cyan-100' : 'text-white'}`}>{value}</div>
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
                <span className={`text-[10px] font-bold ${highlight ? 'text-cyan-500' : 'text-slate-400'}`}>{subText}</span>
            </div>
        </Card>
    )
}
