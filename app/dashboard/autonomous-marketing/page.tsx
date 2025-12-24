"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Calendar, TrendingUp, CheckCircle2, Clock, Zap } from "lucide-react"

interface MarketingAction {
  type: string
  platform: string
  content: string
  scheduledFor: string
  priority: string
  expectedImpact: string
  reason: string
}

export default function AutonomousMarketingPage() {
  const [plan, setPlan] = useState<MarketingAction[]>([])
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlan()
  }, [])

  const fetchPlan = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/autonomous-marketing/plan')
      const data = await response.json()
      setPlan(data.plan || [])
      setRecommendations(data.recommendations || [])
    } catch (error) {
      console.error("Error fetching plan:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-cyan-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">El sistema está pensando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-cyan-500" />
            <h1 className="text-3xl font-black text-gray-900">
              Sistema Autónomo de Marketing
            </h1>
          </div>
          <p className="text-gray-600">
            El sistema decide qué, cuándo y dónde postear. Vos solo aprobás o dejás que funcione solo.
          </p>
        </div>

        {/* Recomendaciones Inteligentes */}
        {recommendations.length > 0 && (
          <Card className="mb-6 border-2 border-cyan-200 bg-cyan-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-cyan-600" />
                Recomendaciones del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Plan Semanal Generado */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Plan Semanal Automático
                </CardTitle>
                <CardDescription>
                  Generado automáticamente por el sistema. Aprobá o dejá que funcione solo.
                </CardDescription>
              </div>
              <Button onClick={fetchPlan} variant="outline">
                Regenerar Plan
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {plan.map((action, i) => (
                <Card key={i} className="border-l-4 border-l-cyan-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={getPriorityColor(action.priority)}>
                            {action.priority}
                          </Badge>
                          <Badge className={getImpactColor(action.expectedImpact)}>
                            Impacto: {action.expectedImpact}
                          </Badge>
                          <Badge variant="outline">
                            {action.platform}
                          </Badge>
                          <Badge variant="outline">
                            {action.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(action.scheduledFor)}</span>
                        </div>
                        <p className="text-xs text-gray-500 italic mb-3">
                          {action.reason}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {action.content}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        Aprobar y Programar
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Editar
                      </Button>
                      <Button size="sm" variant="outline">
                        Descartar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Acciones Esta Semana</p>
                  <p className="text-2xl font-bold">{plan.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Prioridad Alta</p>
                  <p className="text-2xl font-bold">
                    {plan.filter(p => p.priority === 'high').length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Recomendaciones</p>
                  <p className="text-2xl font-bold">{recommendations.length}</p>
                </div>
                <Brain className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

