"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Stethoscope, Clock, ShieldCheck, Zap, Sparkles, ChevronLeft, FileText, Lock } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"

export default function MedicoPage() {
    const { data: session } = useSession()
    const [history, setHistory] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [paywall, setPaywall] = useState(false)

    const handleSummarize = async () => {
        if (!history) return
        setLoading(true)
        setPaywall(false)
        try {
            const response = await fetch("/api/business/evaluate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "patient_summary",
                    data: {
                        industry: "salud",
                        history: history
                    },
                    userId: session?.user?.id
                })
            })

            if (response.status === 402) {
                setPaywall(true)
                return
            }

            const data = await response.json()
            if (data.success) {
                setResult(data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpgrade = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/mercadopago/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ planId: "pro" })
            })
            const { url } = await res.json()
            window.location.href = url
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white text-slate-900 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <Link href="/que-hacemos" className="inline-flex items-center gap-2 text-slate-400 font-bold hover:text-red-600 transition-colors mb-8 group">
                    <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Volver a industrias
                </Link>

                {/* Header Humano */}
                <div className="mb-12">
                    <div className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded inline-block mb-4">
                        HERRAMIENTA PARA PROFESIONALES DE SALUD
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 mb-4 leading-none">
                        Tu tiempo con el paciente <span className="text-red-600 underline">vale oro</span>.
                    </h1>
                    <p className="text-xl text-slate-500 font-medium">
                        Pegá las notas de la última consulta y te armamos un resumen clave para que no pierdas 10 minutos leyendo la historia clínica completa.
                    </p>
                </div>

                {!result ? (
                    <Card className="p-8 border-none shadow-2xl rounded-[2.5rem] bg-slate-50 animate-in fade-in slide-in-from-bottom-4">
                        <div className="mb-6 flex items-center gap-3 text-slate-400 uppercase text-xs font-black tracking-widest">
                            <FileText className="h-4 w-4" /> Notas de la historia clínica
                        </div>
                        <textarea
                            className="w-full min-h-[200px] text-lg font-medium border-2 border-slate-200 bg-white rounded-2xl p-6 mb-6 focus:border-red-600 transition-colors focus:outline-none"
                            placeholder="Ej: Paciente de 45 años consulta por dolor lumbar. Antecedentes de hipertensión. Trabaja sentado..."
                            value={history}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setHistory(e.target.value)}
                        />
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4 text-slate-400 text-sm font-bold">
                                <div className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-green-500" /> 100% Privado</div>
                                <div className="flex items-center gap-1"><Clock className="h-4 w-4 text-red-600" /> Ahorras ~10 min</div>
                            </div>
                            <Button
                                onClick={handleSummarize}
                                disabled={loading || !history}
                                className="w-full sm:w-auto h-16 px-10 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-red-100 transition-all active:scale-95"
                            >
                                {loading ? "Procesando..." : "Sintetizar Historia"}
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8">
                        <Card className="p-10 border-none shadow-2xl rounded-[3rem] bg-white border-2 border-slate-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="bg-slate-100 p-2 rounded-xl text-red-600">
                                    <Stethoscope className="h-6 w-6" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Ficha de Consulta Rápida</h2>
                            </div>

                            <div className="text-xl leading-relaxed mb-10 text-slate-700 bg-slate-50 p-8 rounded-3xl border border-slate-100 italic">
                                {result.output}
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-slate-100 pt-8">
                                <div className="flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-red-600 fill-current" />
                                    <span className="font-black text-slate-900">{result.roi?.message}</span>
                                </div>
                                <Button
                                    onClick={() => setResult(null)}
                                    variant="ghost"
                                    className="font-black text-slate-400 hover:text-red-600"
                                >
                                    Cerrar y nueva ficha
                                </Button>
                            </div>
                        </Card>

                        <div className="bg-slate-900 p-8 rounded-[2rem] text-white flex flex-col sm:flex-row items-center gap-6">
                            <div className="flex-grow">
                                <h4 className="text-lg font-black mb-1">¿Querés que tu secretaria automatice esto?</h4>
                                <p className="text-slate-400 font-medium text-sm text-balance">Podemos conectar tu agenda para que los resúmenes te lleguen por WhatsApp antes de cada consulta.</p>
                            </div>
                            <a href="https://wa.me/something">
                                <Button className="bg-red-600 text-white font-black px-6 h-12 rounded-xl">Invertir en mi tiempo</Button>
                            </a>
                        </div>
                    </div>
                )}

                {paywall && (
                    <Card className="p-10 border-none shadow-2xl rounded-[3rem] bg-slate-900 text-white text-center animate-in zoom-in-95 duration-300">
                        <div className="bg-red-600/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock className="h-10 w-10 text-red-600" />
                        </div>
                        <h2 className="text-3xl font-black mb-4">Probaste el ahorro. ¿Seguimos?</h2>
                        <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
                            Médicos están recuperando <span className="text-white font-bold">10 horas por semana</span> con esto.
                            <br /><br />
                            Por menos de un café por día, desbloqueás resúmenes ilimitados.
                        </p>
                        <Button
                            onClick={handleUpgrade}
                            disabled={loading}
                            className="w-full h-16 bg-red-600 hover:bg-red-700 text-white font-black text-xl rounded-2xl shadow-xl shadow-red-900/40 mb-4"
                        >
                            {loading ? "Redirigiendo..." : "Desbloquear por $7.99/mes"}
                        </Button>
                        <p className="text-xs text-slate-500 uppercase font-black tracking-widest">✓ Cancelás cuando quieras • Mercado Pago</p>
                    </Card>
                )}
            </div>
        </div>
    )
}
