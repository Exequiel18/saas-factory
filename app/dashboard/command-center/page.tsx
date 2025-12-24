"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Brain, Activity, TrendingUp, DollarSign, Users, 
  AlertCircle, CheckCircle2, Clock, Zap, RefreshCw
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SystemStatus {
  id: string
  name: string
  status: 'running' | 'idle' | 'error' | 'paused'
  lastActivity: string
  nextActivity?: string
  metrics: {
    total: number
    today: number
    thisWeek: number
    successRate: number
  }
  details: any
}

interface RealTimeEvent {
  id: string
  timestamp: string
  system: string
  type: 'action' | 'conversion' | 'error' | 'info' | 'warning'
  message: string
  data?: any
}

export default function CommandCenterPage() {
  const [systems, setSystems] = useState<SystemStatus[]>([])
  const [events, setEvents] = useState<RealTimeEvent[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    fetchStatus()
    // Polling cada 5 segundos para actualización en tiempo real
    const interval = setInterval(() => {
      fetchStatus()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/central-command/status')
      const data = await response.json()
      
      setSystems(data.systems || [])
      setEvents(data.events || [])
      setStats(data.stats || {})
      setLastUpdate(new Date())
      setLoading(false)
    } catch (error) {
      console.error("Error fetching status:", error)
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800'
      case 'idle': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'paused': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'action': return <Zap className="h-4 w-4 text-blue-500" />
      case 'conversion': return <DollarSign className="h-4 w-4 text-green-500" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    
    if (seconds < 60) return 'hace unos segundos'
    if (seconds < 3600) return `hace ${Math.floor(seconds / 60)} minutos`
    return date.toLocaleTimeString('es-AR')
  }

  if (loading && systems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-cyan-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Iniciando Command Center...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyan-500 rounded-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900">
                  Command Center
                </h1>
                <p className="text-gray-600">
                  Monitoreo en tiempo real de todas las automatizaciones
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-gray-500">Última actualización</div>
                <div className="text-sm font-medium">{lastUpdate.toLocaleTimeString('es-AR')}</div>
              </div>
              <button
                onClick={fetchStatus}
                className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <RefreshCw className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas Generales */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Sistemas Activos</p>
                    <p className="text-2xl font-bold">{stats.runningSystems}/{stats.totalSystems}</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Acciones Hoy</p>
                    <p className="text-2xl font-bold">{stats.actionsToday}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Esta Semana</p>
                    <p className="text-2xl font-bold">{stats.actionsThisWeek}</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tasa de Éxito</p>
                    <p className="text-2xl font-bold">{stats.avgSuccessRate}%</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sistemas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Sistemas Conectados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systems.map((system) => (
                  <div
                    key={system.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900">{system.name}</h3>
                          <Badge className={getStatusColor(system.status)}>
                            {system.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          Última actividad: {formatTime(system.lastActivity)}
                        </p>
                        {system.nextActivity && (
                          <p className="text-xs text-gray-500">
                            Próxima: {formatTime(system.nextActivity)}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="text-lg font-bold">{system.metrics.total}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Hoy</p>
                        <p className="text-lg font-bold">{system.metrics.today}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Esta Semana</p>
                        <p className="text-lg font-bold">{system.metrics.thisWeek}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Éxito</p>
                        <p className="text-lg font-bold">{system.metrics.successRate.toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Eventos en Tiempo Real */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Eventos en Tiempo Real
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                <AnimatePresence>
                  {events.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="mt-0.5">
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-700">
                            {event.system}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {event.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-900">{event.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTime(event.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {events.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No hay eventos aún</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

