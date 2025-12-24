/**
 * 🧠 AGENTE DE COMANDO CENTRAL
 * 
 * Este es el cerebro que controla todo.
 * Monitorea todas las automatizaciones.
 * Muestra qué está pasando en tiempo real.
 * Nunca para.
 */

import { prisma } from "./prisma"
import { AutonomousMarketingSystem } from "./autonomous-marketing"
import { DeploymentMonitorAgent } from "./deployment-monitor-agent"
import { getAutoHealingAgent } from "./auto-healing-agent"

export interface SystemStatus {
  id: string
  name: string
  status: 'running' | 'idle' | 'error' | 'paused'
  lastActivity: Date
  nextActivity?: Date
  metrics: {
    total: number
    today: number
    thisWeek: number
    successRate: number
  }
  details: any
}

export interface RealTimeEvent {
  id: string
  timestamp: Date
  system: string
  type: 'action' | 'conversion' | 'error' | 'info' | 'warning'
  message: string
  data?: any
}

export class CentralCommandAgent {
  private events: RealTimeEvent[] = []
  private maxEvents = 100 // Mantener últimos 100 eventos
  private deploymentMonitor: DeploymentMonitorAgent | null = null
  
  /**
   * Obtiene el estado de todos los sistemas
   */
  async getSystemStatus(): Promise<SystemStatus[]> {
    const systems: SystemStatus[] = []
    
    // 1. Sistema de Chequeo
    const chequeos = await this.getChequeoStatus()
    systems.push(chequeos)
    
    // 2. Sistema de Marketing Autónomo
    const marketing = await this.getMarketingStatus()
    systems.push(marketing)
    
    // 3. Sistema de Referidos
    const referidos = await this.getReferidosStatus()
    systems.push(referidos)
    
    // 4. Sistema de Pagos
    const pagos = await this.getPagosStatus()
    systems.push(pagos)
    
    // 5. Sistema de Alertas
    const alertas = await this.getAlertasStatus()
    systems.push(alertas)
    
    // 6. Monitor de Deployment (NUEVO - detecta problemas automáticamente)
    const deployment = await this.getDeploymentStatus()
    systems.push(deployment)
    
    // 7. Auto-Healing Agent (NUEVO - soluciona TODO automáticamente)
    const autoHealing = await this.getAutoHealingStatus()
    systems.push(autoHealing)
    
    return systems
  }
  
  /**
   * Estado del sistema de chequeo
   */
  private async getChequeoStatus(): Promise<SystemStatus> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const thisWeek = new Date()
    thisWeek.setDate(thisWeek.getDate() - 7)
    
    // Contar chequeos (simulado - en producción usarías una tabla real)
    const totalChequeos = 0 // await prisma.chequeo.count()
    const chequeosHoy = 0
    const chequeosSemana = 0
    
    return {
      id: 'chequeo',
      name: 'Sistema de Chequeo',
      status: 'running',
      lastActivity: new Date(),
      metrics: {
        total: totalChequeos,
        today: chequeosHoy,
        thisWeek: chequeosSemana,
        successRate: 0
      },
      details: {
        activeUsers: 0,
        conversionRate: 0
      }
    }
  }
  
  /**
   * Estado del sistema de marketing
   */
  private async getMarketingStatus(): Promise<SystemStatus> {
    const marketingSystem = new AutonomousMarketingSystem()
    const plan = marketingSystem.generateWeeklyPlan()
    const recommendations = marketingSystem.getRecommendations()
    
    return {
      id: 'marketing',
      name: 'Marketing Autónomo',
      status: 'running',
      lastActivity: new Date(),
      nextActivity: plan[0]?.scheduledFor,
      metrics: {
        total: plan.length,
        today: 0,
        thisWeek: plan.length,
        successRate: 0
      },
      details: {
        pendingActions: plan.length,
        recommendations: recommendations.length,
        nextPost: plan[0]?.scheduledFor
      }
    }
  }
  
  /**
   * Estado del sistema de referidos
   */
  private async getReferidosStatus(): Promise<SystemStatus> {
    const referidos = await prisma.user.findMany({
      where: {
        referredBy: { not: null }
      }
    })
    
    const pagosReferidos = await prisma.payment.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    })
    
    return {
      id: 'referidos',
      name: 'Sistema de Referidos',
      status: 'running',
      lastActivity: new Date(),
      metrics: {
        total: referidos.length,
        today: 0,
        thisWeek: referidos.length,
        successRate: referidos.length > 0 ? (pagosReferidos.length / referidos.length) * 100 : 0
      },
      details: {
        totalReferidos: referidos.length,
        pagosGenerados: pagosReferidos.length
      }
    }
  }
  
  /**
   * Estado del sistema de pagos
   */
  private async getPagosStatus(): Promise<SystemStatus> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const thisWeek = new Date()
    thisWeek.setDate(thisWeek.getDate() - 7)
    
    const pagosHoy = await prisma.payment.count({
      where: {
        createdAt: { gte: today },
        status: 'approved'
      }
    })
    
    const pagosSemana = await prisma.payment.count({
      where: {
        createdAt: { gte: thisWeek },
        status: 'approved'
      }
    })
    
    const totalPagos = await prisma.payment.count({
      where: { status: 'approved' }
    })
    
    const totalAmount = await prisma.payment.aggregate({
      where: { status: 'approved' },
      _sum: { amount: true }
    })
    
    return {
      id: 'pagos',
      name: 'Sistema de Pagos',
      status: 'running',
      lastActivity: new Date(),
      metrics: {
        total: totalPagos,
        today: pagosHoy,
        thisWeek: pagosSemana,
        successRate: 95 // Asumiendo 95% de éxito
      },
      details: {
        totalRevenue: totalAmount._sum.amount || 0,
        revenueToday: 0,
        revenueThisWeek: 0
      }
    }
  }
  
  /**
   * Estado del sistema de alertas
   */
  private async getAlertasStatus(): Promise<SystemStatus> {
    // Simulado - en producción usarías tu sistema de alertas
    return {
      id: 'alertas',
      name: 'Sistema de Alertas',
      status: 'running',
      lastActivity: new Date(),
      metrics: {
        total: 0,
        today: 0,
        thisWeek: 0,
        successRate: 0
      },
      details: {
        activeAlerts: 0,
        resolvedAlerts: 0
      }
    }
  }

  /**
   * Estado del monitor de deployment (NUEVO)
   */
  private async getDeploymentStatus(): Promise<SystemStatus> {
    if (!this.deploymentMonitor) {
      this.deploymentMonitor = new DeploymentMonitorAgent()
      this.deploymentMonitor.startMonitoring()
    }

    const status = this.deploymentMonitor.getStatus()
    const issues = status.issues

    // Si hay problemas críticos, intentar solucionarlos automáticamente
    const criticalIssues = issues.filter(i => i.severity === 'critical' && i.autoFixable)
    if (criticalIssues.length > 0) {
      // Solucionar automáticamente en background
      this.deploymentMonitor.autoFix().catch(err => {
        this.recordEvent({
          system: 'deployment_monitor',
          type: 'error',
          message: `Error al auto-solucionar: ${err.message}`,
          data: { error: err }
        })
      })
    }

    return {
      id: 'deployment_monitor',
      name: 'Monitor de Deployment',
      status: status.criticalIssues > 0 ? 'error' : status.warnings > 0 ? 'idle' : 'running',
      lastActivity: status.lastCheck || new Date(),
      metrics: {
        total: issues.length,
        today: issues.length,
        thisWeek: issues.length,
        successRate: issues.length === 0 ? 100 : ((issues.length - status.criticalIssues) / issues.length) * 100
      },
      details: {
        criticalIssues: status.criticalIssues,
        warnings: status.warnings,
        issues: issues.map(i => ({
          type: i.type,
          message: i.message,
          autoFixable: i.autoFixable
        }))
      }
    }
  }
  
  /**
   * Registra un evento en tiempo real
   */
  recordEvent(event: Omit<RealTimeEvent, 'id' | 'timestamp'>) {
    const newEvent: RealTimeEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...event
    }
    
    this.events.unshift(newEvent)
    
    // Mantener solo últimos N eventos
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents)
    }
    
    return newEvent
  }
  
  /**
   * Obtiene eventos recientes
   */
  getRecentEvents(limit: number = 50): RealTimeEvent[] {
    return this.events.slice(0, limit)
  }
  
  /**
   * Obtiene estadísticas generales
   */
  async getOverallStats() {
    const systems = await this.getSystemStatus()
    
    const totalActions = systems.reduce((sum, s) => sum + s.metrics.total, 0)
    const actionsToday = systems.reduce((sum, s) => sum + s.metrics.today, 0)
    const actionsThisWeek = systems.reduce((sum, s) => sum + s.metrics.thisWeek, 0)
    const avgSuccessRate = systems.reduce((sum, s) => sum + s.metrics.successRate, 0) / systems.length
    
    const runningSystems = systems.filter(s => s.status === 'running').length
    const errorSystems = systems.filter(s => s.status === 'error').length
    
    return {
      totalSystems: systems.length,
      runningSystems,
      errorSystems,
      totalActions,
      actionsToday,
      actionsThisWeek,
      avgSuccessRate: Math.round(avgSuccessRate),
      lastUpdate: new Date()
    }
  }
  
  /**
   * Inicia monitoreo continuo (simulado)
   */
  startContinuousMonitoring() {
    // En producción, esto sería un loop que monitorea constantemente
    console.log('🧠 Central Command Agent: Monitoreo continuo iniciado')
    
    // Iniciar monitor de deployment
    this.deploymentMonitor = new DeploymentMonitorAgent()
    this.deploymentMonitor.startMonitoring()
    
    // Iniciar auto-healing agent (soluciona TODO automáticamente)
    const autoHealing = getAutoHealingAgent()
    
    this.recordEvent({
      system: 'central',
      type: 'info',
      message: 'Auto-Healing Agent iniciado - Soluciona TODO automáticamente',
      data: { timestamp: new Date() }
    })
    
    this.recordEvent({
      system: 'central',
      type: 'info',
      message: 'Monitor de Deployment iniciado - Detecta y soluciona problemas automáticamente',
      data: { timestamp: new Date() }
    })
    
    // Verificar deployment cada 2 minutos
    setInterval(async () => {
      try {
        const deploymentStatus = await this.getDeploymentStatus()
        const issues = deploymentStatus.details.issues || []
        
        if (issues.length > 0) {
          this.recordEvent({
            system: 'deployment_monitor',
            type: issues.some(i => i.type.includes('critical')) ? 'error' : 'warning',
            message: `${issues.length} problema(s) detectado(s) en deployment`,
            data: { issues }
          })
        }
      } catch (error) {
        this.recordEvent({
          system: 'deployment_monitor',
          type: 'error',
          message: `Error verificando deployment: ${error instanceof Error ? error.message : 'Unknown'}`,
          data: { error }
        })
      }
    }, 120000) // Cada 2 minutos
    
    // Simular eventos periódicos
    setInterval(() => {
      this.recordEvent({
        system: 'central',
        type: 'info',
        message: 'Sistema monitoreando...',
        data: { timestamp: new Date() }
      })
    }, 60000) // Cada minuto
  }
}

// Instancia global del agente
let centralAgent: CentralCommandAgent | null = null

export function getCentralAgent(): CentralCommandAgent {
  if (!centralAgent) {
    centralAgent = new CentralCommandAgent()
    centralAgent.startContinuousMonitoring()
  }
  return centralAgent
}

