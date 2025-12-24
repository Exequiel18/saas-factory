"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, CheckCircle2, ArrowRight, Lock, CheckCircle, Sparkles } from "lucide-react"
import { translateToHumanDiagnostic, getUpsellMessage } from "@/lib/human-translations"

/**
 * 🎯 CHEQUEO REAL DE NEGOCIO - MVP
 * 
 * El producto mínimo que cobra:
 * - 6-8 preguntas simples
 * - Cálculo automático
 * - 1 frase fuerte
 * - 1 problema principal
 * - 1 acción concreta
 * - Botón de pago $3.000
 */

const QUESTIONS = [
  {
    id: "revenue",
    label: "¿Cuánto entró de plata el mes pasado?",
    placeholder: "Ej: 500000",
    type: "number" as const,
    help: "Todo lo que cobraste, sin importar de dónde vino"
  },
  {
    id: "costs",
    label: "¿Cuánto salió de plata?",
    placeholder: "Ej: 450000",
    type: "number" as const,
    help: "Todo lo que gastaste: materiales, alquiler, servicios, lo que sea"
  },
  {
    id: "hours",
    label: "¿Cuántas horas laburaste?",
    placeholder: "Ej: 160",
    type: "number" as const,
    help: "Horas que realmente trabajaste (incluido lo que no facturaste)"
  },
  {
    id: "feeling",
    label: "¿Cómo te sentís al final del mes?",
    placeholder: "",
    type: "select" as const,
    options: ["Cansado pero con plata", "Cansado y sin plata", "Normal, ni bien ni mal"],
    help: "La verdad, sin pensar mucho"
  },
  {
    id: "months",
    label: "¿Hace cuántos meses viene así?",
    placeholder: "Ej: 6",
    type: "number" as const,
    help: "Meses que viene siendo así de cansado"
  },
  {
    id: "alone",
    label: "¿Laburás solo o con alguien?",
    placeholder: "",
    type: "select" as const,
    options: ["Solo", "Con alguien que ayuda", "Tengo empleados"],
    help: "Para entender tu situación"
  }
]

function ChequeoRealContent() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [diagnostic, setDiagnostic] = useState<any>(null)
  const [calculating, setCalculating] = useState(false)
  const [paid, setPaid] = useState(false)

  useEffect(() => {
    if (searchParams.get('status') === 'success') {
      setPaid(true)
      if (diagnostic) {
        setDiagnostic({ ...diagnostic, paid: true })
        
        fetch('/api/central-command/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system: 'pagos',
            type: 'conversion',
            message: `Pago recibido: Chequeo completo - $3.000 ARS`,
            data: { amount: 3000, currency: 'ARS', type: 'chequeo_completo' }
          })
        }).catch(err => console.error("Error recording payment event:", err))
      }
    }
  }, [searchParams, diagnostic])

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers({ ...answers, [questionId]: value })
  }

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1)
    } else {
      calculateDiagnostic()
    }
  }

  const calculateDiagnostic = async () => {
    setCalculating(true)
    
    const revenue = parseFloat(answers.revenue) || 0
    const costs = parseFloat(answers.costs) || 0
    const hours = parseFloat(answers.hours) || 0
    
    const netMargin = revenue > 0 ? ((revenue - costs) / revenue) * 100 : 0
    const hourlyRate = hours > 0 ? (revenue - costs) / hours : 0
    
    let score = 50
    if (netMargin > 20) score += 20
    if (netMargin > 40) score += 10
    if (netMargin < 10) score -= 20
    if (costs > revenue) score = 15
    
    let status: "OK" | "ATENCIÓN" | "RIESGO" = "OK"
    if (netMargin < 0 || score < 30) status = "RIESGO"
    else if (netMargin < 15 || score < 50) status = "ATENCIÓN"
    
    const feeling = answers.feeling || "Normal, ni bien ni mal"
    let trend: "mejorando" | "estable" | "empeorando" = "estable"
    if (feeling === "Cansado pero con plata") trend = "mejorando"
    if (feeling === "Cansado y sin plata") trend = "empeorando"
    
    const isAlone = answers.alone === "Solo"
    
    const humanDiagnostic = translateToHumanDiagnostic(
      score,
      status,
      netMargin,
      revenue,
      costs,
      trend,
      hours,
      hourlyRate,
      isAlone
    )
    
    setDiagnostic({
      ...humanDiagnostic,
      score,
      status,
      netMargin,
      revenue,
      costs,
      hours,
      hourlyRate,
      isAlone
    })
    
    try {
      await fetch('/api/central-command/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: 'chequeo',
          type: 'action',
          message: `Chequeo completado: Score ${score}, Status ${status}`,
          data: { score, status, netMargin, isAlone }
        })
      })
    } catch (error) {
      console.error("Error recording event:", error)
    }
    
    setCalculating(false)
  }

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: "Chequeo Real de Negocio - Diagnóstico Completo",
          amount: 3000,
          description: "Diagnóstico completo con análisis detallado y plan de acción"
        })
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else if (data.init_point) {
        window.location.href = data.init_point
      }
    } catch (error) {
      console.error("Error en checkout", error)
    }
  }

  if (calculating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]" />
        <Card className="max-w-md w-full p-12 text-center bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-2xl relative z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-16 w-16 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-6"
          />
          <h3 className="text-2xl font-black text-slate-900 mb-3">Analizando tus números...</h3>
          <p className="text-slate-600 font-medium">Sin mentiras, sin humo.</p>
        </Card>
      </div>
    )
  }

  if (diagnostic) {
    const upsellMessage = getUpsellMessage(diagnostic.score, diagnostic.status)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 p-6">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="max-w-3xl mx-auto pt-12 relative z-10">
          {/* Resultado del Chequeo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="mb-8 border-2 border-slate-200/50 bg-white/80 backdrop-blur-xl shadow-2xl">
              <CardContent className="p-10">
                {/* Frase Fuerte */}
                <div className="text-4xl md:text-5xl font-black text-slate-900 mb-10 leading-tight">
                  {diagnostic.headline}
                </div>
                
                {/* Problema Principal */}
                <div className="bg-gradient-to-br from-red-50 to-pink-50 border-l-4 border-red-600 p-8 mb-8 rounded-r-2xl">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-600 rounded-xl">
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-black text-red-900 mb-3 text-lg">El Problema</h4>
                      <p className="text-red-800 leading-relaxed text-lg font-medium">{diagnostic.problem}</p>
                    </div>
                  </div>
                </div>
                
                {/* Acción Concreta */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-l-4 border-blue-600 p-8 mb-10 rounded-r-2xl">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-600 rounded-xl">
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-black text-blue-900 mb-3 text-lg">Cómo Te Puedo Ayudar</h4>
                      <p className="text-blue-800 leading-relaxed text-lg font-semibold">{diagnostic.action}</p>
                    </div>
                  </div>
                </div>
                
                {/* Elemento Distintivo - Algo Único en el Mercado */}
                <div className="relative border-2 border-amber-400 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50 rounded-2xl p-10 mb-10 text-center shadow-2xl overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:32px_32px]" />
                  
                  {/* Badge */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-xl flex items-center gap-2">
                      <Sparkles className="h-3 w-3" />
                      Algo Único en el Mercado
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                      className="text-7xl mb-6"
                    >
                      🤝
                    </motion.div>
                    
                    <h3 className="text-3xl font-black text-slate-900 mb-4 leading-tight">
                      Te Cumplimos<br />
                      <span className="bg-gradient-to-r from-red-600 via-amber-600 to-red-600 bg-clip-text text-transparent">
                        Tu Sueño
                      </span>
                    </h3>
                    
                    <p className="text-slate-800 font-black text-xl italic mb-3">
                      "Si me lo permitís, te ayudo a cumplir el sueño"
                    </p>
                    <p className="text-slate-700 text-lg font-semibold mb-4">
                      de que tu negocio funcione solo
                    </p>
                    
                    <div className="mt-6 pt-6 border-t border-amber-200">
                      <p className="text-sm text-slate-600 font-black">— Sin chamuyo, solo números que cierran</p>
                      <p className="text-xs text-slate-500 mt-2 font-semibold">Algo único en el mercado</p>
                    </div>
                  </div>
                </div>
                
                {/* Paywall - Algo Único */}
                {!diagnostic.paid && (
                  <div className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50 rounded-2xl p-10 text-center shadow-2xl relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:32px_32px]" />
                    
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-amber-200 mb-6">
                        <Sparkles className="h-4 w-4 text-amber-600" />
                        <span className="text-xs font-black uppercase tracking-wider text-amber-700">
                          Algo Único en el Mercado
                        </span>
                      </div>
                      
                      <Lock className="h-12 w-12 text-amber-600 mx-auto mb-6" />
                      <h3 className="text-3xl font-black text-slate-900 mb-3 leading-tight">
                        Quiero que me ayudes<br />
                        <span className="bg-gradient-to-r from-red-600 via-amber-600 to-red-600 bg-clip-text text-transparent">
                          a cumplir mi sueño
                        </span>
                      </h3>
                      <p className="text-slate-700 mb-8 text-lg font-semibold leading-relaxed max-w-xl mx-auto">
                        Análisis detallado, números exactos, plan de acción paso a paso. 
                        <span className="text-slate-900 font-black"> Si me lo permitís, te ayudo a ordenarlo.</span>
                      </p>
                      
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={handleCheckout}
                          size="lg"
                          className="bg-gradient-to-r from-red-600 via-red-500 to-amber-600 hover:from-red-700 hover:via-red-600 hover:to-amber-700 text-white font-black px-12 py-8 text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all group relative overflow-hidden"
                        >
                          {/* Animated Background */}
                          <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-red-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          <span className="relative z-10 flex items-center gap-3">
                            <motion.span
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                            >
                              🤝
                            </motion.span>
                            <span>Te Cumplo Tu Sueño - $3.000</span>
                            <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                          </span>
                        </Button>
                      </motion.div>
                      
                      <p className="text-xs text-slate-500 mt-6 font-semibold">
                        Pago único. Sin suscripciones. Sin chamuyo.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Diagnóstico Completo Desbloqueado */}
                {diagnostic.paid && (
                  <div className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-green-600 rounded-xl">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900">
                        Diagnóstico Completo Desbloqueado
                      </h3>
                    </div>
                    <div className="space-y-6 text-slate-700">
                      <div>
                        <h4 className="font-black mb-2 text-lg">Margen Neto:</h4>
                        <p className="text-2xl font-black text-green-600">{diagnostic.netMargin.toFixed(1)}%</p>
                      </div>
                      <div>
                        <h4 className="font-black mb-2 text-lg">Estado del Negocio:</h4>
                        <p className="text-xl font-bold capitalize">{diagnostic.status}</p>
                      </div>
                      <div>
                        <h4 className="font-black mb-3 text-lg">Análisis Detallado:</h4>
                        <p className="text-base leading-relaxed font-medium">
                          Con un margen del {diagnostic.netMargin.toFixed(1)}%, tu negocio está en zona {diagnostic.status === "RIESGO" ? "de riesgo" : diagnostic.status === "ATENCIÓN" ? "de atención" : "segura"}. 
                          {diagnostic.netMargin < 0 && " Estás perdiendo plata cada mes. Necesitás ajustar costos o precios urgentemente."}
                          {diagnostic.netMargin >= 0 && diagnostic.netMargin < 15 && " Tu margen es justo. Un mes malo y podés entrar en rojo."}
                          {diagnostic.netMargin >= 15 && diagnostic.netMargin < 30 && " Tenés margen, pero no suficiente para crecer tranquilo."}
                          {diagnostic.netMargin >= 30 && " Tenés buen margen. El desafío ahora es no desperdiciarlo."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Upsell */}
                {upsellMessage && (
                  <div className="mt-8 border-2 border-slate-300 bg-white/60 backdrop-blur-sm rounded-2xl p-6">
                    <p className="text-slate-700 mb-4 italic font-medium text-lg">{upsellMessage}</p>
                    <Button
                      variant="outline"
                      onClick={() => window.location.href = '/pricing'}
                      className="w-full h-12 font-bold rounded-xl"
                    >
                      Ver Plan Mensual para Ordenar el Negocio
                    </Button>
                  </div>
                )}
                
                {/* Botón de Compartir */}
                {diagnostic.score < 40 && (
                  <div className="mt-8 border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 text-center">
                    <div className="text-4xl mb-4">🎁</div>
                    <h4 className="font-black text-slate-900 mb-3 text-xl">
                      Si esto te pegó, compartilo
                    </h4>
                    <p className="text-slate-700 text-base mb-6 font-medium">
                      Si alguien que compartas paga el diagnóstico completo, te doy $500 de crédito.
                    </p>
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={async () => {
                          const link = `${window.location.origin}/chequeo-real`
                          const text = `Encontré esto. En 3 minutos te dice si tu negocio está bien armado o solo te estás matando. Sin humo. ${link}`
                          
                          try {
                            await fetch('/api/central-command/events', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                system: 'referidos',
                                type: 'action',
                                message: 'Chequeo compartido',
                                data: { method: 'share' }
                              })
                            })
                          } catch (error) {
                            console.error("Error recording share event:", error)
                          }
                          
                          if (navigator.share) {
                            await navigator.share({ text, url: link })
                          } else {
                            await navigator.clipboard.writeText(text)
                            alert('Link copiado. Compartilo donde quieras.')
                          }
                        }}
                        className="flex-1 h-12 font-bold rounded-xl"
                      >
                        Compartir
                      </Button>
                      <Button
                        variant="outline"
                        onClick={async () => {
                          const link = `${window.location.origin}/chequeo-real`
                          await navigator.clipboard.writeText(link)
                          alert('Link copiado. Compartilo donde quieras.')
                        }}
                        className="h-12 font-bold rounded-xl"
                      >
                        Copiar Link
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Botón para empezar de nuevo */}
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => {
                  setStep(0)
                  setAnswers({})
                  setDiagnostic(null)
                }}
                className="font-semibold"
              >
                Hacer otro chequeo
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  const currentQuestion = QUESTIONS[step]
  const hasAnswer = answers[currentQuestion.id] !== undefined && answers[currentQuestion.id] !== ""

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 p-6">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="max-w-2xl mx-auto pt-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-6">
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-full px-6 py-2.5 shadow-sm">
              <span className="text-amber-700 font-black text-sm uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Sin Chamuyo
              </span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            Chequeo Real de Negocio
          </h1>
          <p className="text-slate-600 text-xl font-medium leading-relaxed max-w-xl mx-auto">
            Si laburás solo, esto es para vos. En 3 minutos te decimos si estás bien o solo te estás matando. Si me lo permitís, te ayudo.
          </p>
          <div className="mt-6 text-sm text-slate-500 font-semibold">
            Pregunta {step + 1} de {QUESTIONS.length}
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-lg"
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-8 border-2 border-slate-200/50 bg-white/80 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Label className="text-2xl font-black text-slate-900 mb-6 block">
                  {currentQuestion.label}
                </Label>
                
                {currentQuestion.type === "number" ? (
                  <Input
                    type="number"
                    placeholder={currentQuestion.placeholder}
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                    className="text-lg py-7 border-2 border-slate-300 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-200"
                    autoFocus
                  />
                ) : (
                  <div className="space-y-3">
                    {currentQuestion.options?.map((option) => (
                      <Button
                        key={option}
                        variant={answers[currentQuestion.id] === option ? "default" : "outline"}
                        onClick={() => handleAnswer(currentQuestion.id, option)}
                        className={`w-full justify-start text-left h-auto py-5 px-6 text-base font-semibold rounded-xl transition-all ${
                          answers[currentQuestion.id] === option 
                            ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg" 
                            : "hover:border-red-300 hover:bg-red-50/50"
                        }`}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}
                
                {currentQuestion.help && (
                  <p className="text-sm text-slate-500 mt-4 font-medium">{currentQuestion.help}</p>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          {step > 0 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="font-semibold rounded-xl px-6"
            >
              Atrás
            </Button>
          )}
          <div className="flex-1" />
          <Button
            onClick={handleNext}
            disabled={!hasAnswer}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black rounded-xl px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {step === QUESTIONS.length - 1 ? "Ver Resultado" : "Siguiente"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Wrapper con Suspense para useSearchParams
export default function ChequeoRealPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-12 w-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-slate-600 font-semibold">Cargando chequeo...</p>
        </div>
      </div>
    }>
      <ChequeoRealContent />
    </Suspense>
  )
}
