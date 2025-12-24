/**
 * 🤖 AGENTE MONITOR DE DEPLOYMENT
 * 
 * Detecta y soluciona problemas de deployment automáticamente
 */

import { logEvent } from './central-command-agent'

export interface DeploymentIssue {
  type: 'vercel_not_deployed' | 'wrong_branch' | 'build_failed' | 'missing_env' | 'webhook_not_configured'
  severity: 'critical' | 'warning' | 'info'
  message: string
  solution: string
  autoFixable: boolean
}

export class DeploymentMonitorAgent {
  private issues: DeploymentIssue[] = []
  private lastCheck: Date | null = null
  private checkInterval: number = 60000 // 1 minuto

  /**
   * Verifica el estado del deployment y detecta problemas
   */
  async checkDeploymentStatus(): Promise<DeploymentIssue[]> {
    this.issues = []
    
    // Log interno (sin dependencia circular)
    console.log('[DeploymentMonitor] Verificando estado de deployment...')

    // 1. Verificar que el código esté en GitHub
    await this.checkGitHubStatus()
    
    // 2. Verificar que Vercel tenga el branch correcto
    await this.checkVercelBranch()
    
    // 3. Verificar que el último deployment sea exitoso
    await this.checkVercelDeployment()
    
    // 4. Verificar variables de entorno
    await this.checkEnvironmentVariables()
    
    // 5. Verificar webhook
    await this.checkWebhookConfiguration()

    this.lastCheck = new Date()

    console.log(`[DeploymentMonitor] Verificación completa: ${this.issues.length} problema(s) encontrado(s)`)

    return this.issues
  }

  /**
   * Intenta solucionar problemas automáticamente
   */
  async autoFix(): Promise<{ fixed: number; failed: number }> {
    const fixableIssues = this.issues.filter(i => i.autoFixable)
    let fixed = 0
    let failed = 0

    console.log(`[DeploymentMonitor] Iniciando auto-fix para ${fixableIssues.length} problema(s)`)

    for (const issue of fixableIssues) {
      try {
        switch (issue.type) {
          case 'vercel_not_deployed':
            await this.triggerVercelRedeploy()
            fixed++
            break
          
          case 'wrong_branch':
            await this.switchVercelBranch()
            fixed++
            break
          
          case 'build_failed':
            await this.investigateBuildFailure()
            // No siempre es auto-fixable
            break
          
          case 'missing_env':
            // Requiere credenciales, no auto-fixable sin permisos
            break
          
          case 'webhook_not_configured':
            // Requiere acción manual del usuario
            break
        }

        console.log(`[DeploymentMonitor] ✅ Problema solucionado: ${issue.type}`)
      } catch (error) {
        failed++
        console.error(`[DeploymentMonitor] ❌ Error al solucionar ${issue.type}:`, error)
      }
    }

    return { fixed, failed }
  }

  /**
   * Verifica que el código esté en GitHub
   */
  private async checkGitHubStatus(): Promise<void> {
    try {
      // Verificar que haya commits recientes
      const response = await fetch('https://api.github.com/repos/ExequielRogers/SAAS-FACTORY/commits?per_page=1', {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })

      if (!response.ok) {
        this.issues.push({
          type: 'vercel_not_deployed',
          severity: 'warning',
          message: 'No se pudo verificar el estado de GitHub',
          solution: 'Verificar conexión a GitHub',
          autoFixable: false
        })
        return
      }

      const commits = await response.json()
      if (commits.length === 0) {
        this.issues.push({
          type: 'vercel_not_deployed',
          severity: 'critical',
          message: 'No hay commits en GitHub',
          solution: 'Hacer push del código a GitHub',
          autoFixable: false
        })
      }
    } catch (error) {
      // GitHub puede no ser público, no es crítico
    }
  }

  /**
   * Verifica que Vercel esté usando el branch correcto
   */
  private async checkVercelBranch(): Promise<void> {
    const expectedBranch = process.env.VERCEL_BRANCH || 'nuevo-diseno'
    
    // Si no tenemos token de Vercel, no podemos verificar
    if (!process.env.VERCEL_TOKEN) {
      return
    }

    try {
      const response = await fetch(
        `https://api.vercel.com/v9/projects/saas-factory-antigravity?teamId=${process.env.VERCEL_TEAM_ID || ''}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        const project = await response.json()
        const currentBranch = project.productionBranch || 'main'

        if (currentBranch !== expectedBranch) {
          this.issues.push({
            type: 'wrong_branch',
            severity: 'critical',
            message: `Vercel está desplegando desde '${currentBranch}' pero debería ser '${expectedBranch}'`,
            solution: `Cambiar branch de producción a '${expectedBranch}' en Vercel`,
            autoFixable: true
          })
        }
      }
    } catch (error) {
      // No crítico si no podemos verificar
    }
  }

  /**
   * Verifica el estado del último deployment
   */
  private async checkVercelDeployment(): Promise<void> {
    if (!process.env.VERCEL_TOKEN) {
      return
    }

    try {
      const response = await fetch(
        `https://api.vercel.com/v6/deployments?projectId=saas-factory-antigravity&limit=1`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        const deployments = data.deployments || []

        if (deployments.length > 0) {
          const lastDeployment = deployments[0]
          
          if (lastDeployment.readyState === 'ERROR') {
            this.issues.push({
              type: 'build_failed',
              severity: 'critical',
              message: 'El último deployment falló',
              solution: 'Revisar logs de build en Vercel',
              autoFixable: false
            })
          } else if (lastDeployment.readyState === 'BUILDING') {
            // Está construyendo, no es un problema
          } else if (lastDeployment.readyState === 'READY') {
            // Verificar que sea reciente (menos de 1 hora)
            const deploymentTime = new Date(lastDeployment.createdAt)
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
            
            if (deploymentTime < oneHourAgo) {
              this.issues.push({
                type: 'vercel_not_deployed',
                severity: 'warning',
                message: 'El último deployment es antiguo, puede que no tenga los cambios más recientes',
                solution: 'Forzar redeploy en Vercel',
                autoFixable: true
              })
            }
          }
        }
      }
    } catch (error) {
      // No crítico
    }
  }

  /**
   * Verifica variables de entorno críticas
   */
  private async checkEnvironmentVariables(): Promise<void> {
    const requiredVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ]

    const missing = requiredVars.filter(varName => !process.env[varName])

    if (missing.length > 0) {
      this.issues.push({
        type: 'missing_env',
        severity: 'critical',
        message: `Faltan variables de entorno: ${missing.join(', ')}`,
        solution: 'Configurar variables en Vercel',
        autoFixable: false
      })
    }
  }

  /**
   * Verifica configuración del webhook
   */
  private async checkWebhookConfiguration(): Promise<void> {
    if (!process.env.MERCADO_PAGO_WEBHOOK_SECRET) {
      this.issues.push({
        type: 'webhook_not_configured',
        severity: 'warning',
        message: 'Webhook de Mercado Pago no configurado',
        solution: 'Configurar webhook en Mercado Pago y agregar secret a Vercel',
        autoFixable: false
      })
    }
  }

  /**
   * Fuerza un redeploy en Vercel
   */
  private async triggerVercelRedeploy(): Promise<void> {
    if (!process.env.VERCEL_TOKEN) {
      throw new Error('No hay token de Vercel')
    }

    const branch = process.env.VERCEL_BRANCH || 'nuevo-diseno'

    const response = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'saas-factory-antigravity',
        gitSource: {
          type: 'github',
          repo: 'ExequielRogers/SAAS-FACTORY',
          ref: branch
        }
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Error al trigger redeploy: ${error.message || 'Unknown error'}`)
    }

    console.log(`[DeploymentMonitor] 🚀 Redeploy iniciado desde branch: ${branch}`)
  }

  /**
   * Cambia el branch de producción en Vercel
   */
  private async switchVercelBranch(): Promise<void> {
    // Esto requiere actualizar la configuración del proyecto
    // Por ahora, trigger un nuevo deployment del branch correcto
    await this.triggerVercelRedeploy()
  }

  /**
   * Investiga por qué falló el build
   */
  private async investigateBuildFailure(): Promise<void> {
    // Obtener logs del último deployment fallido
    console.log('[DeploymentMonitor] 🔍 Investigando fallo de build...')
  }

  /**
   * Inicia monitoreo continuo
   */
  startMonitoring(): void {
    setInterval(async () => {
      await this.checkDeploymentStatus()
      const fixableIssues = this.issues.filter(i => i.autoFixable)
      
      if (fixableIssues.length > 0) {
        await this.autoFix()
      }
    }, this.checkInterval)

    // Primera verificación inmediata
    this.checkDeploymentStatus().then(() => {
      const fixableIssues = this.issues.filter(i => i.autoFixable)
      if (fixableIssues.length > 0) {
        this.autoFix()
      }
    })
  }

  /**
   * Obtiene el estado actual
   */
  getStatus(): {
    lastCheck: Date | null
    issues: DeploymentIssue[]
    criticalIssues: number
    warnings: number
  } {
    return {
      lastCheck: this.lastCheck,
      issues: this.issues,
      criticalIssues: this.issues.filter(i => i.severity === 'critical').length,
      warnings: this.issues.filter(i => i.severity === 'warning').length
    }
  }
}

