"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle2, AlertCircle, TrendingUp, TrendingDown, Minus, Check, ArrowUp } from "lucide-react"
import { BusinessStatus } from "@/lib/business-evaluator"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useEffect as useEffectHook } from "react"

interface BusinessScoreCardProps {
  score: number
  status: BusinessStatus
  alert: string
  action: string
  trend: "mejorando" | "estable" | "empeorando"
  comparison: string
  organizationName: string
  organizationId: string
}

export function BusinessScoreCard({
  score,
  status,
  alert,
  action,
  trend,
  comparison,
  organizationName,
  organizationId
}: BusinessScoreCardProps) {
  const { toast } = useToast()
  const [actionCompleted, setActionCompleted] = useState(false)
  const [upsellOpportunity, setUpsellOpportunity] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [emotionalState, setEmotionalState] = useState<any>(null)
  const [previousScore, setPreviousScore] = useState<number | null>(null)

  // Controlar ritmo emocional y verificar upsell
  useEffectHook(() => {
    // Obtener score anterior del localStorage
    const storedScore = localStorage.getItem(`score-${organizationId}`)
    const prevScore = storedScore ? parseInt(storedScore) : null
    
    // Controlar ritmo emocional (máximo 1 estímulo fuerte por sesión)
    fetch("/api/emotional-rhythm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score,
        previousScore: prevScore,
        status,
        hasSeenUpsellThisSession: !!upsellOpportunity
      })
    })
      .then(res => res.json())
      .then(data => {
        setEmotionalState(data.state)
        // Solo mostrar upsell si el ritmo emocional lo permite
        if (data.state.shouldShowUpsell && score < 40) {
          fetchUpsellOpportunity()
        }
      })
      .catch(() => {})

    // Guardar score actual
    localStorage.setItem(`score-${organizationId}`, score.toString())
    setPreviousScore(prevScore)

    // Clasificar usuario en sombra (sin exponer)
    fetch("/api/users/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId })
    }).catch(() => {}) // Silencioso

    // Loggear visualización de alerta (fase 2 en sombra)
    fetch("/api/patterns/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "alert_view",
        organizationId,
        score,
        status
      })
    }).catch(() => {}) // Silencioso, no bloquear UI
  }, [score, organizationId, status])

  const fetchUpsellOpportunity = async () => {
    try {
      const response = await fetch(`/api/upsell/check?organizationId=${organizationId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.hasOpportunity) {
          setUpsellOpportunity(data.opportunity)
        }
      }
    } catch (error) {
      console.error("Error fetching upsell opportunity:", error)
    }
  }

  const handleCompleteAction = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/actions/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionId: `action-${organizationId}-current`,
          organizationId
        })
      })

      if (response.ok) {
        const result = await response.json()
        setActionCompleted(true)
        toast({
          title: "¡Acción completada!",
          description: result.message || "Tu score mejorará al recargar la página.",
          variant: "default"
        })
        // Recargar después de 2 segundos para mostrar nuevo score
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        throw new Error("Error al completar acción")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo completar la acción. Intenta nuevamente.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  const statusConfig = {
    OK: {
      color: "bg-emerald-500",
      borderColor: "border-emerald-500",
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-50",
      icon: CheckCircle2,
      label: "OK"
    },
    ATENCIÓN: {
      color: "bg-amber-500",
      borderColor: "border-amber-500",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
      icon: AlertCircle,
      label: "ATENCIÓN"
    },
    RIESGO: {
      color: "bg-red-500",
      borderColor: "border-red-500",
      textColor: "text-red-700",
      bgColor: "bg-red-50",
      icon: AlertTriangle,
      label: "RIESGO"
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  const trendIcon = trend === "mejorando" ? TrendingUp : trend === "empeorando" ? TrendingDown : Minus
  const TrendIcon = trendIcon

  return (
    <Card className={`border-2 ${config.borderColor} ${config.bgColor}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Evaluación de {organizationName}</CardTitle>
          <Badge className={config.color} variant="default">
            {config.label}
          </Badge>
        </div>
        <CardDescription>Análisis automático actualizado</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Grande */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className={`text-7xl font-bold ${config.textColor}`}>
              {score}
            </div>
            <div className="absolute -top-2 -right-8">
              <TrendIcon className={`h-6 w-6 ${trend === "mejorando" ? "text-emerald-600" : trend === "empeorando" ? "text-red-600" : "text-gray-400"}`} />
            </div>
          </div>
          <div className="ml-4 text-sm text-gray-600">
            <div className="font-semibold">Score de Salud</div>
            <div className="text-xs">0-100</div>
          </div>
        </div>

        {/* Alerta Principal - Solo mostrar si ritmo emocional lo permite */}
        {(!emotionalState || emotionalState.shouldShowAlert) && (
          <div className={`p-4 rounded-lg border-l-4 ${config.borderColor} bg-white`}>
            <div className="flex items-start gap-3">
              <Icon className={`h-5 w-5 ${config.textColor} mt-0.5 flex-shrink-0`} />
              <div>
                <div className="font-semibold text-sm mb-1">Alerta Principal</div>
                <p className="text-sm text-gray-700 leading-relaxed">{alert}</p>
              </div>
            </div>
          </div>
        )}

        {/* Acción Concreta con Botón */}
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="font-semibold text-sm mb-2 text-gray-900">Acción Sugerida</div>
          <p className="text-sm text-gray-700 mb-3">{action}</p>
          {!actionCompleted && (
            <Button
              onClick={handleCompleteAction}
              disabled={loading}
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Check className="h-4 w-4 mr-2" />
              {loading ? "Completando..." : "Marcar como hecho"}
            </Button>
          )}
          {actionCompleted && (
            <div className="text-sm text-emerald-600 font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Acción completada. Recargando...
            </div>
          )}
        </div>

        {/* Upsell Automático cuando Score < 40 - Solo si ritmo emocional lo permite */}
        {upsellOpportunity && score < 40 && emotionalState?.shouldShowUpsell && (
          <div className={`p-4 rounded-lg border-2 ${status === "RIESGO" ? "border-red-500 bg-red-50" : "border-amber-500 bg-amber-50"}`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className={`h-5 w-5 ${status === "RIESGO" ? "text-red-600" : "text-amber-600"} mt-0.5 flex-shrink-0`} />
              <div className="flex-1">
                <div className="font-semibold text-sm mb-1 text-gray-900">
                  {upsellOpportunity.urgency === "critical" ? "Atención Urgente" : "Oportunidad de Mejora"}
                </div>
                <p className="text-sm text-gray-700 mb-3">{upsellOpportunity.message}</p>
                <Link href={`/dashboard/organizations/${organizationId}?upsell=${upsellOpportunity.suggestedPlan}`}>
                  <Button
                    size="sm"
                    className={`w-full ${status === "RIESGO" ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700"}`}
                  >
                    <ArrowUp className="h-4 w-4 mr-2" />
                    {upsellOpportunity.cta}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Comparación Social Suave */}
        <div className="text-xs text-gray-500 italic text-center">
          {comparison}
        </div>
      </CardContent>
    </Card>
  )
}

