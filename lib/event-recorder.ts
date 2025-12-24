/**
 * 📡 RECORDADOR DE EVENTOS GLOBAL
 * 
 * Helper para registrar eventos desde cualquier parte del sistema
 * Todos los eventos van al Command Center automáticamente
 */

import { getCentralAgent } from "./central-command-agent"

export type EventType = 'action' | 'conversion' | 'error' | 'info' | 'warning'

export interface EventData {
  system: string
  type: EventType
  message: string
  data?: any
}

/**
 * Registra un evento en el Command Center
 * Se puede usar desde cualquier parte del sistema
 */
export async function recordEvent(event: EventData) {
  try {
    const agent = getCentralAgent()
    agent.recordEvent(event)
    
    // También loguear en consola para debugging
    console.log(`[EVENT] ${event.system}: ${event.message}`)
  } catch (error) {
    console.error("Error recording event:", error)
    // No fallar si hay error, solo loguear
  }
}

/**
 * Helpers específicos para eventos comunes
 */
export const EventRecorder = {
  /**
   * Registra cuando alguien completa el chequeo
   */
  async chequeoCompleted(score: number, status: string, paid: boolean = false) {
    await recordEvent({
      system: 'chequeo',
      type: paid ? 'conversion' : 'action',
      message: paid 
        ? `Chequeo completado y pagado (Score: ${score}, Status: ${status})`
        : `Chequeo completado (Score: ${score}, Status: ${status})`,
      data: { score, status, paid }
    })
  },
  
  /**
   * Registra cuando se genera un pago
   */
  async paymentReceived(amount: number, currency: string, paymentId: string) {
    await recordEvent({
      system: 'pagos',
      type: 'conversion',
      message: `Pago recibido: ${currency} ${amount}`,
      data: { amount, currency, paymentId }
    })
  },
  
  /**
   * Registra cuando se genera contenido de marketing
   */
  async marketingContentGenerated(platform: string, contentType: string) {
    await recordEvent({
      system: 'marketing',
      type: 'action',
      message: `Contenido generado para ${platform}: ${contentType}`,
      data: { platform, contentType }
    })
  },
  
  /**
   * Registra cuando alguien comparte el chequeo
   */
  async chequeoShared(method: string) {
    await recordEvent({
      system: 'referidos',
      type: 'action',
      message: `Chequeo compartido vía ${method}`,
      data: { method }
    })
  },
  
  /**
   * Registra errores del sistema
   */
  async systemError(system: string, error: string, details?: any) {
    await recordEvent({
      system,
      type: 'error',
      message: `Error: ${error}`,
      data: { error, details }
    })
  },
  
  /**
   * Registra información general
   */
  async systemInfo(system: string, message: string, data?: any) {
    await recordEvent({
      system,
      type: 'info',
      message,
      data
    })
  }
}

