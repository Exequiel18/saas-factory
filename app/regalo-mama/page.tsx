"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sparkles, BookOpen, PenTool, Layout, Gift, ChevronRight, Clock, Lock } from "lucide-react"
import { useSession } from "next-auth/react"

export default function TeacherGift() {
    const { data: session } = useSession()
    const [activeTab, setActiveTab] = useState("plan")
    const [subject, setSubject] = useState("")
    const [topic, setTopic] = useState("")
    const [generating, setGenerating] = useState(false)
    const [result, setResult] = useState<string | null>(null)
    const [paywall, setPaywall] = useState(false)

    const handleGenerate = async () => {
        if (!topic || !subject) return
        setGenerating(true)
        setResult(null)
        setPaywall(false)

        try {
            const response = await fetch("/api/business/evaluate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "teacher_plan",
                    data: { subject, topic },
                    userId: (session?.user as any)?.id
                })
            })

            if (response.status === 402) {
                setPaywall(true)
                return
            }

            const data = await response.json()
            if (data.success) {
                setResult(data.output)
            }
        } catch (error) {
            console.error("Error generating plan:", error)
            setResult("Che, perdón. Hubo un error en la conexión. Intentemos de nuevo.")
        } finally {
            setGenerating(false)
        }
    }

    const handleUpgrade = async () => {
        setGenerating(true)
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
            setGenerating(false)
        }
    }

    return (
        <div className="min-h-screen bg-white text-slate-900 py-12 px-4 selection:bg-red-100">
            <div className="max-w-3xl mx-auto">
                {/* Header Humano */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 font-bold text-xs mb-4 border border-red-100">
                        <Gift className="h-3 w-3" /> Especial: Recuperá tus domingos
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                        Asistente para <span className="text-red-600">Docentes</span>
                    </h1>
                    <p className="text-slate-500 text-lg leading-relaxed">
                        No te compliques con la IA. Contanos qué tenés que dar y nosotros te armamos el borrador para que vos solo lo pulas.
                    </p>
                </div>

                <div className="w-full">
                    {/* Tabs Sencillas */}
                    <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-2xl overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => { setActiveTab("plan"); setResult(null); }}
                            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'plan' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            <Layout className="h-4 w-4 mr-2" /> Armar Clase
                        </button>
                        <button
                            onClick={() => { setActiveTab("corregir"); setResult(null); }}
                            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'corregir' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            <PenTool className="h-4 w-4 mr-2" /> Devoluciones
                        </button>
                        <button
                            onClick={() => { setActiveTab("rubrica"); setResult(null); }}
                            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'rubrica' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            <Sparkles className="h-4 w-4 mr-2" /> Rúbricas
                        </button>
                    </div>

                    {activeTab === "plan" && (
                        <Card className="p-8 border-2 border-slate-100 shadow-xl bg-white rounded-[2rem] animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                                <BookOpen className="text-blue-500 h-5 w-5" /> ¿Qué tema vas a dar?
                            </h3>
                            <div className="space-y-5 mb-8">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Materia o Grado</label>
                                    <Input
                                        placeholder="Ej: Historia - 3er Año"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="h-14 border-slate-200 rounded-xl focus:ring-red-500 bg-slate-50 border-none px-6 text-lg"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">El tema de la clase</label>
                                    <Input
                                        placeholder="Ej: La Revolución de Mayo"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        className="h-14 border-slate-200 rounded-xl focus:ring-red-500 bg-slate-50 border-none px-6 text-lg"
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={handleGenerate}
                                disabled={generating || !topic}
                                className="w-full h-16 text-lg bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-lg shadow-red-200"
                            >
                                {generating ? "Pensando por vos..." : "Armar Planificación"}
                            </Button>

                            {result && (
                                <div className="mt-8 p-8 bg-slate-50 rounded-3xl whitespace-pre-line text-slate-700 leading-relaxed border border-slate-100">
                                    <div className="font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
                                        <Sparkles className="h-4 w-4 text-red-500" /> Borrador Listo:
                                    </div>
                                    {result}
                                    <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400 italic">
                                        <span>Podes copiar esto y pegarlo en tu Word o Drive.</span>
                                        <span className="flex items-center gap-1 font-bold text-slate-500">
                                            <Clock className="h-3 w-3" /> Te ahorraste ~2 horas
                                        </span>
                                    </div>
                                </div>
                            )}
                        </Card>
                    )}

                    {activeTab === "corregir" && (
                        <Card className="p-12 border-2 border-dashed border-slate-200 shadow-none bg-slate-50 text-center rounded-[2rem] animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <PenTool className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Devoluciones Motivadoras</h3>
                            <p className="text-slate-500 mb-8 max-w-xs mx-auto text-sm">
                                Venís cansada de corregir. Subí o contanos los errores comunes y te armamos un mensaje personalizado para cada alumno.
                            </p>
                            <div className="inline-block px-4 py-2 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                                Próximamente para ahorrarte toda la tarde
                            </div>
                        </Card>
                    )}

                    {activeTab === "rubrica" && (
                        <Card className="p-8 border-2 border-slate-100 shadow-xl bg-white rounded-[2rem] animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                                <Sparkles className="text-yellow-500 h-5 w-5" /> Rúbricas sin dolor de cabeza
                            </h3>
                            <div className="p-6 rounded-2xl bg-yellow-50 border border-yellow-100 text-sm text-yellow-800 mb-8">
                                &quot;Lo que más me cuesta es poner los criterios de evaluación claros sin ser injusta.&quot; - **¡Te lo resolvemos nosotros!**
                            </div>
                            <Button className="w-full h-16 text-lg bg-yellow-500 hover:bg-yellow-600 text-white font-black rounded-2xl">
                                Crear Grilla de Evaluación
                            </Button>
                        </Card>
                    )}

                    {paywall && (
                        <Card className="p-10 border-none shadow-2xl rounded-[3rem] bg-slate-900 text-white text-center animate-in zoom-in-95 duration-300 mt-8">
                            <div className="bg-red-600/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Lock className="h-10 w-10 text-red-600" />
                            </div>
                            <h2 className="text-3xl font-black mb-4">¿Querés tus domingos libres siempre?</h2>
                            <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                                Ya probaste el ahorro de tiempo. Cientos de docentes ya recuperaron sus noches libres usando este asistente ilimitado.
                                <br /><br />
                                Pasate a **PRO** y armá todas tus clases en segundos.
                            </p>
                            <Button
                                onClick={handleUpgrade}
                                disabled={generating}
                                className="w-full h-16 bg-red-600 hover:bg-red-700 text-white font-black text-xl rounded-2xl shadow-xl shadow-red-900/40 mb-4"
                            >
                                {generating ? "Preparando pago..." : "Recuperar mi Tiempo ($9.99)"}
                            </Button>
                            <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Pago seguro con Mercado Pago</p>
                        </Card>
                    )}
                </div>

                {/* Mensaje de Exe */}
                <div className="mt-16 text-center">
                    <p className="text-slate-400 text-sm italic mb-4">
                        &quot;Hecho para que las profes vuelvan a disfrutar de enseñar y no de administrar.&quot;
                    </p>
                    <a href="/solutions" className="text-red-600 font-bold hover:underline flex items-center justify-center gap-1 transition-colors">
                        Volver a Inicio <ChevronRight className="h-4 w-4" />
                    </a>
                </div>
            </div>
        </div>
    )
}
