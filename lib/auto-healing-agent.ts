/**
 * 🔧 AGENTE DE AUTO-HEALING COMPLETO
 * 
 * Este agente:
 * - Sabe TODO del sistema (desde el primer punto hasta el último)
 * - Detecta problemas automáticamente
 * - Los soluciona hasta que queden bien
 * - No para hasta que todo funcione
 * - Si está bien, no hace nada
 */

import { DeploymentMonitorAgent, DeploymentIssue } from './deployment-monitor-agent'
import * as fs from 'fs'
import * as path from 'path'

export interface SystemCheck {
  category: 'code' | 'build' | 'deployment' | 'database' | 'environment' | 'api' | 'webhook'
  name: string
  status: 'ok' | 'error' | 'warning'
  message: string
  autoFixable: boolean
  fixAction?: () => Promise<void>
}

export class AutoHealingAgent {
  private deploymentMonitor: DeploymentMonitorAgent
  private checks: SystemCheck[] = []
  private isRunning = false
  private checkInterval = 30000 // 30 segundos
  private maxRetries = 5
  private retryCount = 0

  constructor() {
    this.deploymentMonitor = new DeploymentMonitorAgent()
  }

  /**
   * Inicia el monitoreo continuo
   * No para hasta que todo esté bien
   */
  start(): void {
    if (this.isRunning) return
    
    this.isRunning = true
    console.log('[AutoHealing] 🤖 Agente iniciado - Monitoreando TODO el sistema')
    
    // Primera verificación inmediata
    this.checkAndFix()
    
    // Verificación continua cada 30 segundos
    setInterval(() => {
      this.checkAndFix()
    }, this.checkInterval)
  }

  /**
   * Verifica TODO y soluciona problemas
   * No para hasta que todo esté bien
   */
  async checkAndFix(): Promise<void> {
    try {
      console.log('[AutoHealing] 🔍 Verificando sistema completo...')
      
      // 1. Verificar código
      await this.checkCode()
      
      // 2. Verificar build
      await this.checkBuild()
      
      // 3. Verificar deployment
      await this.checkDeployment()
      
      // 4. Verificar base de datos
      await this.checkDatabase()
      
      // 5. Verificar variables de entorno
      await this.checkEnvironment()
      
      // 6. Verificar APIs
      await this.checkAPIs()
      
      // 7. Verificar webhook
      await this.checkWebhook()
      
      // Analizar resultados
      const errors = this.checks.filter(c => c.status === 'error')
      const warnings = this.checks.filter(c => c.status === 'warning')
      const ok = this.checks.filter(c => c.status === 'ok')
      
      console.log(`[AutoHealing] 📊 Estado: ${ok.length} OK | ${warnings.length} Warnings | ${errors.length} Errores`)
      
      // Si hay errores auto-fixables, solucionarlos
      const fixableErrors = errors.filter(e => e.autoFixable && e.fixAction)
      
      if (fixableErrors.length > 0) {
        console.log(`[AutoHealing] 🔧 Solucionando ${fixableErrors.length} problema(s)...`)
        
        for (const error of fixableErrors) {
          try {
            if (error.fixAction) {
              await error.fixAction()
              // Verificar que se solucionó
              await this.verifyFix(error)
            }
          } catch (fixError) {
            console.error(`[AutoHealing] ❌ Error al solucionar ${error.name}:`, fixError)
            this.retryCount++
            
            // Reintentar si no excedimos el límite
            if (this.retryCount < this.maxRetries) {
              console.log(`[AutoHealing] 🔄 Reintentando (${this.retryCount}/${this.maxRetries})...`)
              setTimeout(() => this.checkAndFix(), 5000)
            }
          }
        }
      }
      
      // Si todo está bien, resetear contador de reintentos
      if (errors.length === 0) {
        this.retryCount = 0
        console.log('[AutoHealing] ✅ Todo está bien. Continuando monitoreo...')
      }
      
    } catch (error) {
      console.error('[AutoHealing] ❌ Error en verificación:', error)
    }
  }

  /**
   * Verifica el código
   */
  private async checkCode(): Promise<void> {
    const criticalFiles = [
      'app/page.tsx',
      'app/chequeo-real/page.tsx',
      'app/configurar-webhook/page.tsx',
      'app/dashboard/deploy/page.tsx',
      'package.json',
      'next.config.mjs',
      'prisma/schema.prisma'
    ]

    for (const file of criticalFiles) {
      const exists = fs.existsSync(path.join(process.cwd(), file))
      
      if (!exists) {
        this.addCheck({
          category: 'code',
          name: `Archivo faltante: ${file}`,
          status: 'error',
          message: `El archivo ${file} no existe`,
          autoFixable: false
        })
      } else {
        this.addCheck({
          category: 'code',
          name: `Archivo: ${file}`,
          status: 'ok',
          message: `Archivo ${file} existe`,
          autoFixable: false
        })
      }
    }

    // Verificar estructura de configurar-webhook
    const webhookDir = path.join(process.cwd(), 'app', 'configurar-webhook')
    const webhookPage = path.join(webhookDir, 'page.tsx')
    const webhookRoute = path.join(webhookDir, 'route.ts')
    
    if (fs.existsSync(webhookRoute)) {
      this.addCheck({
        category: 'code',
        name: 'Estructura webhook incorrecta',
        status: 'error',
        message: 'route.ts existe en configurar-webhook (debe eliminarse)',
        autoFixable: true,
        fixAction: async () => {
          fs.unlinkSync(webhookRoute)
          console.log('[AutoHealing] ✅ Eliminado route.ts de configurar-webhook')
        }
      })
    }
  }

  /**
   * Verifica el build
   */
  private async checkBuild(): Promise<void> {
    const nextDir = path.join(process.cwd(), '.next')
    const buildExists = fs.existsSync(nextDir)
    
    if (!buildExists) {
      this.addCheck({
        category: 'build',
        name: 'Build no existe',
        status: 'warning',
        message: 'No hay build generado. Ejecutar: npm run build',
        autoFixable: false
      })
    } else {
      this.addCheck({
        category: 'build',
        name: 'Build existe',
        status: 'ok',
        message: 'Build generado correctamente',
        autoFixable: false
      })
    }
  }

  /**
   * Verifica el deployment
   */
  private async checkDeployment(): Promise<void> {
    try {
      const issues = await this.deploymentMonitor.checkDeploymentStatus()
      
      for (const issue of issues) {
        this.addCheck({
          category: 'deployment',
          name: issue.type,
          status: issue.severity === 'critical' ? 'error' : 'warning',
          message: issue.message,
          autoFixable: issue.autoFixable,
          fixAction: issue.autoFixable ? async () => {
            await this.deploymentMonitor.autoFix()
          } : undefined
        })
      }
      
      if (issues.length === 0) {
        this.addCheck({
          category: 'deployment',
          name: 'Deployment OK',
          status: 'ok',
          message: 'No hay problemas de deployment',
          autoFixable: false
        })
      }
    } catch (error) {
      this.addCheck({
        category: 'deployment',
        name: 'Error verificando deployment',
        status: 'error',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown'}`,
        autoFixable: false
      })
    }
  }

  /**
   * Verifica la base de datos
   */
  private async checkDatabase(): Promise<void> {
    const envPath = path.join(process.cwd(), '.env.local')
    
    if (!fs.existsSync(envPath)) {
      this.addCheck({
        category: 'database',
        name: '.env.local no existe',
        status: 'warning',
        message: 'Archivo .env.local no encontrado',
        autoFixable: false
      })
      return
    }

    const envContent = fs.readFileSync(envPath, 'utf8')
    const hasDatabaseUrl = envContent.includes('DATABASE_URL=')
    
    if (!hasDatabaseUrl) {
      this.addCheck({
        category: 'database',
        name: 'DATABASE_URL faltante',
        status: 'error',
        message: 'DATABASE_URL no está configurado en .env.local',
        autoFixable: false
      })
    } else {
      this.addCheck({
        category: 'database',
        name: 'DATABASE_URL configurado',
        status: 'ok',
        message: 'DATABASE_URL está configurado',
        autoFixable: false
      })
    }
  }

  /**
   * Verifica variables de entorno
   */
  private async checkEnvironment(): Promise<void> {
    const requiredVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ]

    const envPath = path.join(process.cwd(), '.env.local')
    
    if (!fs.existsSync(envPath)) {
      return // Ya se reportó en checkDatabase
    }

    const envContent = fs.readFileSync(envPath, 'utf8')
    
    for (const varName of requiredVars) {
      const hasVar = envContent.includes(`${varName}=`)
      
      if (!hasVar) {
        this.addCheck({
          category: 'environment',
          name: `${varName} faltante`,
          status: 'error',
          message: `${varName} no está configurado`,
          autoFixable: false
        })
      } else {
        this.addCheck({
          category: 'environment',
          name: `${varName} configurado`,
          status: 'ok',
          message: `${varName} está configurado`,
          autoFixable: false
        })
      }
    }
  }

  /**
   * Verifica APIs críticas
   */
  private async checkAPIs(): Promise<void> {
    const criticalAPIs = [
      '/api/central-command/status',
      '/api/deployment-monitor/check',
      '/api/mercadopago/webhook'
    ]

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    
    for (const apiPath of criticalAPIs) {
      try {
        const response = await fetch(`${baseUrl}${apiPath}`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000) // 5 segundos timeout
        })
        
        if (response.ok) {
          this.addCheck({
            category: 'api',
            name: `API: ${apiPath}`,
            status: 'ok',
            message: `API ${apiPath} responde correctamente`,
            autoFixable: false
          })
        } else {
          this.addCheck({
            category: 'api',
            name: `API: ${apiPath}`,
            status: 'error',
            message: `API ${apiPath} responde con error: ${response.status}`,
            autoFixable: false
          })
        }
      } catch (error) {
        // Si el servidor no está corriendo, no es un error crítico
        if (error instanceof Error && error.name === 'AbortError') {
          this.addCheck({
            category: 'api',
            name: `API: ${apiPath}`,
            status: 'warning',
            message: `API ${apiPath} no responde (servidor puede no estar corriendo)`,
            autoFixable: false
          })
        } else {
          this.addCheck({
            category: 'api',
            name: `API: ${apiPath}`,
            status: 'warning',
            message: `Error verificando API ${apiPath}: ${error instanceof Error ? error.message : 'Unknown'}`,
            autoFixable: false
          })
        }
      }
    }
  }

  /**
   * Verifica webhook
   */
  private async checkWebhook(): Promise<void> {
    const envPath = path.join(process.cwd(), '.env.local')
    
    if (!fs.existsSync(envPath)) {
      return
    }

    const envContent = fs.readFileSync(envPath, 'utf8')
    const hasWebhookSecret = envContent.includes('MERCADO_PAGO_WEBHOOK_SECRET=')
    
    if (!hasWebhookSecret) {
      this.addCheck({
        category: 'webhook',
        name: 'Webhook no configurado',
        status: 'warning',
        message: 'MERCADO_PAGO_WEBHOOK_SECRET no está configurado',
        autoFixable: false
      })
    } else {
      this.addCheck({
        category: 'webhook',
        name: 'Webhook configurado',
        status: 'ok',
        message: 'MERCADO_PAGO_WEBHOOK_SECRET está configurado',
        autoFixable: false
      })
    }
  }

  /**
   * Agrega un check al listado
   */
  private addCheck(check: SystemCheck): void {
    // Actualizar si ya existe uno con el mismo nombre
    const existingIndex = this.checks.findIndex(c => c.name === check.name && c.category === check.category)
    
    if (existingIndex >= 0) {
      this.checks[existingIndex] = check
    } else {
      this.checks.push(check)
    }
  }

  /**
   * Verifica que un fix funcionó
   */
  private async verifyFix(check: SystemCheck): Promise<void> {
    // Re-ejecutar el check específico
    switch (check.category) {
      case 'code':
        await this.checkCode()
        break
      case 'deployment':
        await this.checkDeployment()
        break
    }
    
    // Verificar que el problema se solucionó
    const updatedCheck = this.checks.find(c => c.name === check.name && c.category === check.category)
    
    if (updatedCheck && updatedCheck.status === 'ok') {
      console.log(`[AutoHealing] ✅ Problema solucionado: ${check.name}`)
      this.retryCount = 0
    } else {
      console.log(`[AutoHealing] ⚠️ Problema persiste: ${check.name}`)
    }
  }

  /**
   * Obtiene el estado completo
   */
  getStatus(): {
    isRunning: boolean
    totalChecks: number
    ok: number
    warnings: number
    errors: number
    checks: SystemCheck[]
  } {
    return {
      isRunning: this.isRunning,
      totalChecks: this.checks.length,
      ok: this.checks.filter(c => c.status === 'ok').length,
      warnings: this.checks.filter(c => c.status === 'warning').length,
      errors: this.checks.filter(c => c.status === 'error').length,
      checks: this.checks
    }
  }

  /**
   * Detiene el agente
   */
  stop(): void {
    this.isRunning = false
    console.log('[AutoHealing] 🛑 Agente detenido')
  }
}

// Instancia global
let autoHealingAgent: AutoHealingAgent | null = null

export function getAutoHealingAgent(): AutoHealingAgent {
  if (!autoHealingAgent) {
    autoHealingAgent = new AutoHealingAgent()
    autoHealingAgent.start()
  }
  return autoHealingAgent
}

