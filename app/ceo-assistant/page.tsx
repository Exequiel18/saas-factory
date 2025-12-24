"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TrendingUp, AlertTriangle, CheckCircle2, Zap, Rocket, ChevronLeft, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function CEOAssistantPage() {
    const [loading, setLoading] = useState(false)
    const [evaluated, setEvaluated] = useState(false)
    const [report, setReport] = useState<any>(null)

    const handleGenerateReport = async () => {
        setLoading(true)
        // Simulado para este nicho por ahora
        setTimeout(() => {
            setReport({
                summary: "Tenés 3 puntos de fuga en logística y un equipo de ventas que rinde al 70%. No necesitás más gente, necesitás automatizar el seguimiento de leads.",
                roi: "Ahorro de $45,000 en sobrecostos operativos.",
                action: "Activar el Sales Agent en WhatsApp hoy mismo."
            })
            setEvaluated(true)
            setLoading(false)
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <Link href="/que-hacemos" className="inline-flex items-center gap-2 text-slate-400 font-bold hover:text-red-600 transition-colors mb-8 group">
                    <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Volver a industrias
                </Link>

                {/* Header Directivo */}
                <div className="mb-12">
                    <div className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded inline-block mb-4">
                        VISIÓN DE DUEÑO / CEO
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 mb-4 leading-none">
                        Dejá de adivinar. <span className="text-red-600 underline">Decidí con datos.</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-medium">
                        Tu tiempo como cabeza de negocio es para vender y crecer, no para perseguir planillas. Te damos la visión clara de tu operación en 1 minuto.
                    </p>
                </div>

                {!evaluated ? (
                    <Card className="p-10 border-none shadow-2xl rounded-[3rem] bg-white text-center overflow-hidden relative">
                        <div className="relative z-10">
                            <BarChart3 className="h-16 w-16 text-slate-100 mx-auto mb-6" />
                            <h3 className="text-2xl font-black mb-4">¿Querés ver la radiografía de tu negocio?</h3>
                            <p className="text-slate-500 mb-8 font-medium">Analizamos tus métricas actuales y te damos el plan de acción sin vueltas.</p>
                            <Button
                                onClick={handleGenerateReport}
                                disabled={loading}
                                className="h-16 px-12 bg-slate-900 hover:bg-black text-white font-black text-lg rounded-2xl shadow-xl transition-all"
                            >
                                {loading ? "Procesando Datos..." : "Generar Visión Estratégica"}
                            </Button>
                        </div>
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            <TrendingUp className="h-48 w-48" />
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8">
                        <Card className="p-10 border-none shadow-2xl rounded-[3rem] bg-slate-900 text-white">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="bg-red-600 p-2 rounded-xl">
                                    <Rocket className="h-6 w-6 text-white fill-current" />
                                </div>
                                <h2 className="text-2xl font-black uppercase tracking-tight">Reporte Ejecutivo Directo</h2>
                            </div>

                            <div className="text-xl leading-relaxed mb-8 italic text-slate-200 bg-white/5 p-8 rounded-3xl border border-white/10">
                                &quot;{report.summary}&quot;
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-8">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="text-green-500" />
                                    <span className="font-bold">{report.roi}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="text-amber-500" />
                                    <span className="font-bold">Acción Sugerida: {report.action}</span>
                                </div>
                            </div>
                        </Card>

                        <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                            <div className="flex-grow">
                                <h4 className="text-xl font-black mb-2 text-slate-900">¿Querés que tu negocio corra solo?</h4>
                                <p className="text-slate-500 font-medium">Podemos armar un tablero que se actualice solo y te avise si algo falla.</p>
                            </div>
                            <Button className="h-14 px-8 bg-green-500 hover:bg-green-600 text-white font-black rounded-xl">Hablar con un Constructor</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
