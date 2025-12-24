"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, CheckCircle2, ArrowRight, Lock, CheckCircle } from "lucide-react"
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
      // Si ya teníamos un diagnóstico, lo mantenemos pero marcamos como pagado
      if (diagnostic) {
        setDiagnostic({ ...diagnostic, paid: true })
        
        // Registrar evento de pago en Command Center
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
    
    // Simular cálculo (en producción esto va al backend)
    const revenue = parseFloat(answers.revenue) || 0
    const costs = parseFloat(answers.costs) || 0
    const hours = parseFloat(answers.hours) || 0
    
    // Calcular margen neto
    const netMargin = revenue > 0 ? ((revenue - costs) / revenue) * 100 : 0
    
    // Calcular tasa horaria si hay horas
    const hourlyRate = hours > 0 ? (revenue - costs) / hours : 0
    
    // Calcular score simple
    let score = 50
    if (netMargin > 20) score += 20
    if (netMargin > 40) score += 10
    if (netMargin < 10) score -= 20
    if (costs > revenue) score = 15
    
    // Determinar status
    let status: "OK" | "ATENCIÓN" | "RIESGO" = "OK"
    if (netMargin < 0 || score < 30) status = "RIESGO"
    else if (netMargin < 15 || score < 50) status = "ATENCIÓN"
    
    // Determinar tendencia basado en feeling
    const feeling = answers.feeling || "Normal, ni bien ni mal"
    let trend: "mejorando" | "estable" | "empeorando" = "estable"
    if (feeling === "Cansado pero con plata") trend = "mejorando"
    if (feeling === "Cansado y sin plata") trend = "empeorando"
    
    // Verificar si labura solo
    const isAlone = answers.alone === "Solo"
    
    // Traducir a lenguaje humano (versión para emprendedores solos)
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
    
    // Registrar evento en Command Center
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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-12 text-center">
          <div className="animate-spin h-12 w-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-6" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Analizando tus números...</h3>
          <p className="text-slate-600">Sin mentiras, sin humo.</p>
        </Card>
      </div>
    )
  }

  if (diagnostic) {
    const upsellMessage = getUpsellMessage(diagnostic.score, diagnostic.status)
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
        <div className="max-w-2xl mx-auto pt-12">
          {/* Resultado del Chequeo */}
          <Card className="mb-6 border-2 border-slate-200">
            <CardContent className="p-8">
              {/* Frase Fuerte */}
              <div className="text-3xl font-black text-slate-900 mb-8 leading-tight">
                {diagnostic.headline}
              </div>
              
              {/* Problema Principal */}
              <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-red-900 mb-2">El Problema</h4>
                    <p className="text-red-800 leading-relaxed">{diagnostic.problem}</p>
                  </div>
                </div>
              </div>
              
              {/* Acción Concreta */}
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-blue-900 mb-2">Cómo Te Puedo Ayudar</h4>
                    <p className="text-blue-800 leading-relaxed font-medium">{diagnostic.action}</p>
                  </div>
                </div>
              </div>
              
              {/* Elemento Distintivo - Promesa Simple (LO QUE DESTACA) */}
              <div className="relative border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 mb-6 text-center shadow-lg">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-amber-400 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                    Mi Compromiso
                  </div>
                </div>
                <div className="text-5xl mb-4">🤝</div>
                <p className="text-slate-800 font-bold text-lg italic mb-2">
                  "Si me lo permitís, te ayudo a cumplir el sueño"
                </p>
                <p className="text-slate-600 text-sm">
                  de que tu negocio funcione solo
                </p>
                <div className="mt-4 pt-4 border-t border-amber-200">
                  <p className="text-xs text-slate-500 font-medium">— Sin chamuyo, solo números que cierran</p>
                </div>
              </div>
              
              {/* Paywall - Diagnóstico Completo */}
              {!diagnostic.paid && (
                <div className="border-2 border-amber-300 bg-amber-50 rounded-lg p-6 text-center">
                  <Lock className="h-8 w-8 text-amber-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Quiero que me ayudes con el diagnóstico completo
                  </h3>
                  <p className="text-slate-600 mb-6 text-sm">
                    Análisis detallado, números exactos, plan de acción paso a paso. Si me lo permitís, te ayudo a ordenarlo.
                  </p>
                  <Button
                    onClick={handleCheckout}
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-6 text-lg relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <span>🤝</span>
                      <span>Quiero que me ayudes - $3.000</span>
                    </span>
                    <div className="absolute inset-0 bg-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                  </Button>
                </div>
              )}
              
              {/* Diagnóstico Completo Desbloqueado */}
              {diagnostic.paid && (
                <div className="border-2 border-green-300 bg-green-50 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <h3 className="text-xl font-bold text-slate-900">
                      Diagnóstico Completo Desbloqueado
                    </h3>
                  </div>
                  <div className="space-y-4 text-slate-700">
                    <div>
                      <h4 className="font-bold mb-2">Margen Neto:</h4>
                      <p className="text-lg">{diagnostic.netMargin.toFixed(1)}%</p>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">Estado del Negocio:</h4>
                      <p className="text-lg capitalize">{diagnostic.status}</p>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">Análisis Detallado:</h4>
                      <p className="text-sm leading-relaxed">
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
              
              {/* Upsell (solo si score < 40) */}
              {upsellMessage && (
                <div className="mt-6 border-2 border-slate-300 bg-slate-50 rounded-lg p-6">
                  <p className="text-slate-700 mb-4 italic">{upsellMessage}</p>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/pricing'}
                    className="w-full"
                  >
                    Ver Plan Mensual para Ordenar el Negocio
                  </Button>
                </div>
              )}
              
              {/* Botón de Compartir (Sistema de Referidos Automático) */}
              {diagnostic.score < 40 && (
                <div className="mt-6 border-2 border-green-300 bg-green-50 rounded-lg p-6 text-center">
                  <div className="text-3xl mb-3">🎁</div>
                  <h4 className="font-bold text-slate-900 mb-2">
                    Si esto te pegó, compartilo
                  </h4>
                  <p className="text-slate-600 text-sm mb-4">
                    Si alguien que compartas paga el diagnóstico completo, te doy $500 de crédito.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={async () => {
                        const link = `${window.location.origin}/chequeo-real`
                        const text = `Encontré esto. En 3 minutos te dice si tu negocio está bien armado o solo te estás matando. Sin humo. ${link}`
                        
                        // Registrar evento de compartir
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
                      className="flex-1"
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
            >
              Hacer otro chequeo
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = QUESTIONS[step]
  const hasAnswer = answers[currentQuestion.id] !== undefined && answers[currentQuestion.id] !== ""

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="max-w-2xl mx-auto pt-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="bg-amber-100 border-2 border-amber-400 rounded-full px-6 py-2">
              <span className="text-amber-800 font-black text-sm uppercase tracking-wider">🤝 Sin Chamuyo</span>
            </div>
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4">
            Chequeo Real de Negocio
          </h1>
          <p className="text-slate-600 text-lg">
            Si laburás solo, esto es para vos. En 3 minutos te decimos si estás bien o solo te estás matando. Si me lo permitís, te ayudo.
          </p>
          <div className="mt-4 text-sm text-slate-500">
            Pregunta {step + 1} de {QUESTIONS.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
              className="h-full bg-red-600"
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Label className="text-lg font-bold text-slate-900 mb-4 block">
                  {currentQuestion.label}
                </Label>
                
                {currentQuestion.type === "number" ? (
                  <Input
                    type="number"
                    placeholder={currentQuestion.placeholder}
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                    className="text-lg py-6"
                    autoFocus
                  />
                ) : (
                  <div className="space-y-3">
                    {currentQuestion.options?.map((option) => (
                      <Button
                        key={option}
                        variant={answers[currentQuestion.id] === option ? "default" : "outline"}
                        onClick={() => handleAnswer(currentQuestion.id, option)}
                        className="w-full justify-start text-left h-auto py-4 px-6"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}
                
                {currentQuestion.help && (
                  <p className="text-sm text-slate-500 mt-3">{currentQuestion.help}</p>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          {step > 0 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
            >
              Atrás
            </Button>
          )}
          <div className="flex-1" />
          <Button
            onClick={handleNext}
            disabled={!hasAnswer}
            className="bg-red-600 hover:bg-red-700"
          >
            {step === QUESTIONS.length - 1 ? "Ver Resultado" : "Siguiente"}
            <ArrowRight className="ml-2 h-4 w-4" />
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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Cargando chequeo...</p>
        </div>
      </div>
    }>
      <ChequeoRealContent />
    </Suspense>
  )
}

