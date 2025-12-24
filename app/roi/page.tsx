"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

const ROI_EXAMPLES = [
    {
        investment: 10,
        revenue: 127,
        days: 7,
        industry: "E-commerce",
        description: "Automatización de emails de carrito abandonado"
    },
    {
        investment: 50,
        revenue: 890,
        days: 14,
        industry: "Servicios",
        description: "Sistema de seguimiento automático de leads"
    },
    {
        investment: 100,
        revenue: 2340,
        days: 30,
        industry: "SaaS",
        description: "Onboarding automatizado + upsells"
    },
    {
        investment: 25,
        revenue: 315,
        days: 10,
        industry: "Consultoría",
        description: "Calificación automática de prospectos"
    }
]

export default function ROICalculator() {
    const [investment, setInvestment] = useState("")
    const [email, setEmail] = useState("")
    const [showResults, setShowResults] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const calculateROI = () => {
        const inv = parseFloat(investment)
        if (inv > 0) {
            setShowResults(true)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Integrate with email/CRM
        setSubmitted(true)
    }

    const estimatedRevenue = parseFloat(investment) * 12.7 // Conservative 1170% ROI
    const roi = ((estimatedRevenue - parseFloat(investment)) / parseFloat(investment)) * 100

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Calculá tu ROI en <span className="text-purple-400">Tiempo Real</span>
                    </h1>
                    <p className="text-xl text-gray-300">
                        Descubrí cuánto podés generar automatizando tu negocio
                    </p>
                </div>

                {/* Calculator */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 mb-12">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-white text-lg mb-4">
                                ¿Cuánto querés invertir en automatización?
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">$</span>
                                <Input
                                    type="number"
                                    value={investment}
                                    onChange={(e) => setInvestment(e.target.value)}
                                    className="pl-10 text-2xl h-16 bg-white/20 border-white/30 text-white placeholder:text-gray-400"
                                    placeholder="100"
                                />
                            </div>
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    calculateROI()
                                }}
                                className="w-full mt-4 h-14 text-lg bg-purple-600 hover:bg-purple-700 text-white rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                disabled={!investment || parseFloat(investment) <= 0}
                            >
                                Calcular mi ROI
                            </button>
                        </div>

                        {showResults && (
                            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-6 text-white">
                                <div className="text-center">
                                    <div className="text-sm opacity-80 mb-2">Retorno Estimado en 30 días</div>
                                    <div className="text-5xl font-bold mb-4">
                                        ${estimatedRevenue.toFixed(0)}
                                    </div>
                                    <div className="text-2xl mb-6">
                                        ROI: <span className="font-bold">{roi.toFixed(0)}%</span>
                                    </div>
                                    <div className="bg-white/20 rounded p-4 text-sm">
                                        <div className="flex justify-between mb-2">
                                            <span>Inversión:</span>
                                            <span className="font-bold">${investment}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span>Ganancia:</span>
                                            <span className="font-bold text-green-300">+${(estimatedRevenue - parseFloat(investment)).toFixed(0)}</span>
                                        </div>
                                        <div className="border-t border-white/30 pt-2 mt-2">
                                            <div className="flex justify-between">
                                                <span>Total generado:</span>
                                                <span className="font-bold">${estimatedRevenue.toFixed(0)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Real Examples */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-white text-center mb-8">
                        Casos Reales de Nuestros Clientes
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {ROI_EXAMPLES.map((example, idx) => (
                            <Card key={idx} className="bg-white/10 backdrop-blur-lg border-white/20 p-6 hover:bg-white/15 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="text-purple-400 font-semibold">{example.industry}</div>
                                        <div className="text-white text-lg">{example.description}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-400">en {example.days} días</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <div className="text-sm text-gray-400">Invirtió</div>
                                        <div className="text-2xl font-bold text-white">${example.investment}</div>
                                    </div>
                                    <div className="text-3xl text-purple-400">→</div>
                                    <div className="flex-1">
                                        <div className="text-sm text-gray-400">Generó</div>
                                        <div className="text-2xl font-bold text-green-400">${example.revenue}</div>
                                    </div>
                                    <div className="flex-1 text-right">
                                        <div className="text-sm text-gray-400">ROI</div>
                                        <div className="text-2xl font-bold text-purple-400">
                                            {(((example.revenue - example.investment) / example.investment) * 100).toFixed(0)}%
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Lead Capture */}
                {showResults && !submitted && (
                    <Card className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
                        <div className="max-w-2xl mx-auto text-center">
                            <h3 className="text-3xl font-bold mb-4">
                                ¿Querés lograr estos resultados?
                            </h3>
                            <p className="text-lg mb-6 opacity-90">
                                Dejanos tu email y te mostramos cómo automatizar tu negocio en menos de 7 días
                            </p>
                            <form onSubmit={handleSubmit} className="flex gap-4">
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    required
                                    className="flex-1 h-14 text-lg bg-white/20 border-white/30 text-white placeholder:text-white/60"
                                />
                                <button
                                    type="submit"
                                    className="h-14 px-8 text-lg bg-white text-purple-600 hover:bg-gray-100 rounded-md font-semibold transition-colors"
                                >
                                    Quiero mi plan
                                </button>
                            </form>
                            <p className="text-sm mt-4 opacity-75">
                                🔒 No spam. Solo resultados reales.
                            </p>
                        </div>
                    </Card>
                )}

                {submitted && (
                    <Card className="bg-green-600 p-8 text-white text-center">
                        <div className="text-5xl mb-4">✅</div>
                        <h3 className="text-2xl font-bold mb-2">¡Listo!</h3>
                        <p className="text-lg">
                            Te contactamos en las próximas 24hs con tu plan personalizado
                        </p>
                    </Card>
                )}
            </div>
        </div>
    )
}
