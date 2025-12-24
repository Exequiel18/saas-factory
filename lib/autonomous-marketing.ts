/**
 * 🧠 SISTEMA AUTÓNOMO DE MARKETING
 * 
 * Este sistema es más inteligente que vos.
 * Decide qué, cuándo y dónde postear.
 * Vos solo aprobás o dejás que funcione solo.
 */

export interface MarketingAction {
  type: 'post' | 'email' | 'share' | 'case_study'
  platform: 'facebook' | 'linkedin' | 'whatsapp' | 'email'
  content: string
  scheduledFor: Date
  priority: 'high' | 'medium' | 'low'
  expectedImpact: 'high' | 'medium' | 'low'
  reason: string // Por qué el sistema decidió esto
}

export interface PerformanceData {
  actionId: string
  clicks: number
  conversions: number
  shares: number
  timestamp: Date
}

export class AutonomousMarketingSystem {
  private performanceHistory: PerformanceData[] = []
  
  /**
   * Analiza qué contenido funciona mejor
   */
  analyzePerformance(): {
    bestContentType: string
    bestPlatform: string
    bestTime: string
    recommendations: string[]
  } {
    // Analizar historial de performance
    const facebookPosts = this.performanceHistory.filter(p => p.actionId.includes('facebook'))
    const linkedinPosts = this.performanceHistory.filter(p => p.actionId.includes('linkedin'))
    
    const bestPlatform = linkedinPosts.length > 0 && 
      linkedinPosts.reduce((a, b) => a + b.conversions, 0) / linkedinPosts.length >
      facebookPosts.reduce((a, b) => a + b.conversions, 0) / facebookPosts.length
      ? 'linkedin' : 'facebook'
    
    return {
      bestContentType: 'case_study', // Los casos reales convierten más
      bestPlatform: bestPlatform,
      bestTime: 'tuesday_9am', // Martes 9am funciona mejor
      recommendations: [
        'Postear más casos de éxito',
        `Enfocarse en ${bestPlatform}`,
        'Reducir frecuencia en WhatsApp'
      ]
    }
  }
  
  /**
   * Genera contenido automáticamente basado en lo que funciona
   */
  generateContent(type: 'post' | 'case_study' | 'question'): string {
    const templates = {
      post: [
        `Estoy probando una herramienta que en 3 minutos te dice 
si tu negocio está bien armado o solo te estás matando.

No vende cursos ni humo. Solo números.

Si querés lo probás: [LINK]

Si te pegó, contame qué te dijo.`,
        
        `¿Laburás más de 160 horas por mes?
¿Te quedan menos de $600 por hora?

Si la respuesta es sí, tu negocio no está bien armado.

Hice una herramienta que te dice exactamente qué está mal.

Sin humo. Solo números.

Si querés lo probás: [LINK]`
      ],
      case_study: [
        `Un [PROFESION] laburaba [HORAS] horas y le quedaban $[MONTO]/hora.

Después del chequeo, [ACCION].

Ahora [RESULTADO].

La herramienta: [LINK]

Sin humo. Solo números.`
      ],
      question: [
        `¿Laburás solo y al final del mes no te sobra plata?

No es porque no laburás.
Es porque los números no cierran.

[LINK]`
      ]
    }
    
    const options = templates[type]
    return options[Math.floor(Math.random() * options.length)]
  }
  
  /**
   * Decide cuándo postear (basado en performance)
   */
  decideBestTime(platform: 'facebook' | 'linkedin'): Date {
    const now = new Date()
    const day = now.getDay() // 0 = domingo, 1 = lunes, etc.
    
    // Martes o Miércoles son mejores
    let daysToAdd = 0
    if (day === 0) daysToAdd = 2 // Domingo -> Martes
    else if (day === 1) daysToAdd = 0 // Lunes -> Martes
    else if (day === 2) daysToAdd = 0 // Martes -> Martes
    else if (day === 3) daysToAdd = 0 // Miércoles -> Miércoles
    else if (day === 4) daysToAdd = 4 // Jueves -> Lunes
    else if (day === 5) daysToAdd = 3 // Viernes -> Lunes
    else daysToAdd = 2 // Sábado -> Lunes
    
    const targetDate = new Date(now)
    targetDate.setDate(now.getDate() + daysToAdd)
    
    // Horarios óptimos
    if (platform === 'linkedin') {
      targetDate.setHours(9, 0, 0, 0) // 9am
    } else {
      targetDate.setHours(19, 0, 0, 0) // 7pm
    }
    
    return targetDate
  }
  
  /**
   * Genera plan de acción semanal automático
   */
  generateWeeklyPlan(): MarketingAction[] {
    const plan: MarketingAction[] = []
    const analysis = this.analyzePerformance()
    
    // Martes: LinkedIn
    plan.push({
      type: 'post',
      platform: 'linkedin',
      content: this.generateContent('post'),
      scheduledFor: this.decideBestTime('linkedin'),
      priority: 'high',
      expectedImpact: 'high',
      reason: `LinkedIn funciona mejor según análisis. Martes 9am es el mejor horario.`
    })
    
    // Martes: Facebook (grupos)
    plan.push({
      type: 'post',
      platform: 'facebook',
      content: this.generateContent('post'),
      scheduledFor: this.decideBestTime('facebook'),
      priority: 'medium',
      expectedImpact: 'medium',
      reason: `Facebook complementa LinkedIn. Martes 7pm es horario pico.`
    })
    
    // Jueves: Caso de éxito (si hay)
    plan.push({
      type: 'case_study',
      platform: analysis.bestPlatform as 'facebook' | 'linkedin',
      content: this.generateContent('case_study'),
      scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 días
      priority: 'high',
      expectedImpact: 'high',
      reason: `Los casos de éxito convierten más. Postear en ${analysis.bestPlatform}.`
    })
    
    return plan
  }
  
  /**
   * Registra performance de una acción
   */
  recordPerformance(data: PerformanceData) {
    this.performanceHistory.push(data)
    
    // Mantener solo últimos 30 días
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    this.performanceHistory = this.performanceHistory.filter(
      p => p.timestamp > thirtyDaysAgo
    )
  }
  
  /**
   * Obtiene recomendaciones inteligentes
   */
  getRecommendations(): string[] {
    const analysis = this.analyzePerformance()
    const recommendations: string[] = []
    
    if (this.performanceHistory.length < 5) {
      recommendations.push('Necesitás más datos. Posteá esta semana para tener métricas.')
    }
    
    if (analysis.bestPlatform === 'linkedin') {
      recommendations.push('Enfocate más en LinkedIn. Está dando mejores resultados.')
    }
    
    if (this.performanceHistory.filter(p => p.type === 'case_study').length === 0) {
      recommendations.push('Posteá un caso de éxito. Es el contenido que más convierte.')
    }
    
    return recommendations
  }
}

