"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, AlertCircle, Info } from "lucide-react"

interface Alert {
  id: string
  type: "risk" | "opportunity" | "update"
  priority: "high" | "medium" | "low"
  title: string
  message: string
  action: string
}

export function AlertBell() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlerts()
    // Refrescar alertas cada 5 minutos
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchAlerts = async () => {
    try {
      // Obtener alertas desde API (si existe) o generar dinámicamente
      // Por ahora, usar evaluación directa
      const response = await fetch("/api/alerts/unread")
      if (response.ok) {
        const data = await response.json()
        setAlerts(data.alerts || [])
      }
    } catch (error) {
      console.error("Error fetching alerts:", error)
    } finally {
      setLoading(false)
    }
  }

  const unreadCount = alerts?.filter(a => !a.read).length || 0
  const highPriorityCount = alerts?.filter(a => a.priority === "high" && !a.read).length || 0

  const getIcon = (type: string) => {
    switch (type) {
      case "risk":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "opportunity":
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className={`absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs ${highPriorityCount > 0 ? "bg-red-500" : "bg-blue-500"
                }`}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>
          Alertas de Negocio
          {unreadCount > 0 && (
            <span className="ml-2 text-xs text-gray-500">
              {unreadCount} sin leer
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <div className="p-4 text-center text-sm text-gray-500">
            Cargando alertas...
          </div>
        ) : (alerts?.length || 0) === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            No hay alertas nuevas
          </div>
        ) : (
          alerts?.slice(0, 5).map((alert) => (
            <DropdownMenuItem
              key={alert.id}
              className="flex flex-col items-start gap-2 p-3 cursor-pointer"
            >
              <div className="flex items-start gap-2 w-full">
                {getIcon(alert.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{alert.title}</span>
                    <Badge className={`text-xs ${getPriorityColor(alert.priority)}`}>
                      {alert.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{alert.message}</p>
                  <p className="text-xs text-blue-600 font-medium">{alert.action}</p>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}
        {(alerts?.length || 0) > 5 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-sm text-blue-600 cursor-pointer">
              Ver todas las alertas ({alerts?.length})
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}






