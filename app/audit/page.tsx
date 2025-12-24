"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Zap, Clock, TrendingUp, Sparkles, ChevronRight } from "lucide-react"

const AUDIT_STEPS = [
    {
        title: "Tareas Repetitivas",
        q: "¿Cuántas horas por semana pierde tu equipo (o vos) haciendo lo mismo una y otra vez? (Excel, mails, planillas)",
        placeholder: "Ej: 15"
    },
    {
        title: "Clientes y Contactos",
        q: "¿Cuántas consultas te llegan al mes que no llegás a responder a tiempo?",
        placeholder: "Ej: 50"
    },
    {
        title: "Costo de tu Tiempo",
        q: "¿Cuánto vale la hora de trabajo de tu equipo? (Aproximado)",
        placeholder: "Ej: 1000"
    }
]

export default function AIAudit() {
    const [step, setStep] = useState(0)
    const [answers, setAnswers] = useState<string[]>([])
    const [showResults, setShowResults] = useState(false)
    const [evaluating, setEvaluating] = useState(false)
    const [auditOutput, setAuditOutput] = useState<string | null>(null)

    const nextStep = async (val: string) => {
        const newAnswers = [...answers, val]
        setAnswers(newAnswers)
        if (step < AUDIT_STEPS.length - 1) {
            setStep(step + 1)
        } else {
            setShowResults(true)
            setEvaluating(true)
            try {
                const response = await fetch("/api/business/evaluate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type: "business_audit",
                        data: {
                            industry: "Comercio Local",
                            metrics: { saving: (parseFloat(newAnswers[0]) * parseFloat(newAnswers[2]) * 52) }
                        }
                    })
                })
                const data = await response.json()
                if (data.success) {
                    setAuditOutput(data.output)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setEvaluating(false)
            }
        }
    }

    const yearlySaving = parseFloat(answers[0]) * parseFloat(answers[2]) * 52
    const leadImprovement = parseFloat(answers[1]) * 0.3

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header Humano */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold mb-4 border border-slate-200">
                        <Zap className="h-3 w-3 fill-current text-red-600" /> ANÁLISIS DE TIEMPO REAL
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
                        ¿Dónde se te está <span className="text-red-600">yendo el tiempo</span>?
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Contanos 3 cosas y te decimos exactamente cuánto podrías recuperar con un sistema simple.
                    </p>
                </div>

                {!showResults ? (
                    <Card className="p-10 border-none shadow-2xl bg-white rounded-[2.5rem] animate-in fade-in slide-in-from-bottom-2 duration-400">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-slate-900 mb-2">{AUDIT_STEPS[step].title}</h2>
                            <p className="text-slate-500 font-medium text-lg leading-relaxed">{AUDIT_STEPS[step].q}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Input
                                type="number"
                                id="audit-input"
                                className="bg-slate-100 border-none h-16 text-2xl font-bold px-6 rounded-2xl"
                                placeholder={AUDIT_STEPS[step].placeholder}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        const val = (e.target as HTMLInputElement).value
                                        if (val) nextStep(val)
                                    }
                                }}
                            />
                            <Button
                                onClick={() => {
                                    const val = (document.getElementById('audit-input') as HTMLInputElement).value
                                    if (val) nextStep(val)
                                }}
                                className="h-16 px-10 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-lg shadow-red-100"
                            >
                                Continuar
                            </Button>
                        </div>
                        <div className="mt-8 pt-8 border-t border-slate-100 flex justify-between text-xs font-bold text-slate-300 uppercase tracking-widest">
                            <span>Paso {step + 1} de 3</span>
                            <span>Promesa: Sin humo, solo realidad</span>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-8">
                        <Card className="p-10 border-none shadow-2xl bg-white rounded-[2.5rem]">
                            <h2 className="text-2xl font-black mb-10 text-center text-slate-900">
                                Diagnóstico de tu Laburo
                            </h2>

                            <div className="grid gap-6 mb-12">
                                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 text-center">
                                    <div className="text-slate-500 mb-2 font-bold text-xs uppercase tracking-wider">Esto podrías ahorrar al año</div>
                                    <div className="text-5xl font-black text-slate-900 leading-none mb-4">
                                        ${yearlySaving.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-red-600 font-bold bg-red-50 inline-block px-3 py-1 rounded-full italic">
                                        &quot;Plata que hoy estás regalando al desorden&quot;
                                    </div>
                                </div>
                                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 text-center">
                                    <div className="text-slate-500 mb-2 font-bold text-xs uppercase tracking-wider">Tiempo que vas a recuperar</div>
                                    <div className="text-3xl font-black text-slate-900">+{leadImprovement.toFixed(0)} contactos respondidos</div>
                                    <div className="text-sm text-slate-400 mt-2">Dormí tranquilo, el sistema responde por vos.</div>
                                </div>
                            </div>

                            {evaluating ? (
                                <div className="py-12 text-center">
                                    <div className="animate-spin h-10 w-10 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4" />
                                    <p className="text-slate-500 italic font-medium">Analizando tus números sin mentiras...</p>
                                </div>
                            ) : auditOutput && (
                                <div className="mb-10 p-8 rounded-[2rem] bg-slate-900 text-white whitespace-pre-line leading-relaxed relative overflow-hidden">
                                    <div className="relative z-10 text-lg italic">
                                        {auditOutput}
                                    </div>
                                    <div className="absolute top-0 right-0 p-4 opacity-20"><Sparkles /></div>
                                </div>
                            )}

                            <div className="space-y-4 mb-12">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    ¿Por qué esto sirve?
                                </h3>
                                <div className="grid gap-3">
                                    {[
                                        "Dejás de anotar cosas en papelitos que se pierden.",
                                        "Respondés en segundos, no horas después.",
                                        "Ves tu rentabilidad real sin ser contador."
                                    ].map((win, i) => (
                                        <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 font-medium text-slate-600">
                                            <CheckCircle2 className="h-5 w-5 text-red-600" />
                                            <span>{win}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-slate-500 mb-6 text-sm font-medium">
                                    ¿Querés que charlemos sobre cómo aplicar esto en tu negocio hoy?
                                </p>
                                <a href="https://wa.me/something">
                                    <Button className="w-full h-16 bg-green-500 hover:bg-green-600 text-white font-black rounded-2xl text-lg shadow-lg shadow-green-100">
                                        Charlemos por WhatsApp
                                    </Button>
                                </a>
                            </div>
                        </Card>

                        <div className="text-center">
                            <a href="/que-hacemos" className="text-slate-400 font-bold hover:text-slate-900 flex items-center justify-center gap-1 transition-all">
                                Volver a industrias <ChevronRight className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
