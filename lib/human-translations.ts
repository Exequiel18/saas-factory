/**
 * 🎯 TRADUCCIÓN HUMANA DEL SISTEMA TÉCNICO
 * 
 * El sistema técnico calcula scores, métricas y estados.
 * Esto lo traduce a frases que conectan con el negocio real.
 * 
 * REGLA: Nunca mencionar "score", "métrica", "algoritmo".
 * Solo verdades que el negocio necesita escuchar.
 */

export interface HumanDiagnostic {
  /** Una frase fuerte que resume la situación */
  headline: string
  
  /** El problema principal en lenguaje humano */
  problem: string
  
  /** Una acción concreta y ejecutable */
  action: string
  
  /** Mensaje de upsell (solo si score < 40) */
  upsellMessage?: string
}

/**
 * Traducir evaluación técnica a diagnóstico humano
 * Versión para emprendedores solos - Enfoque en cansancio y esfuerzo
 */
export function translateToHumanDiagnostic(
  score: number,
  status: "OK" | "ATENCIÓN" | "RIESGO",
  netMargin: number,
  revenue: number,
  expenses: number,
  trend: "mejorando" | "estable" | "empeorando",
  hours: number = 0,
  hourlyRate: number = 0,
  isAlone: boolean = true
): HumanDiagnostic {
  
  // RIESGO: Margen negativo o muy bajo
  if (status === "RIESGO" || netMargin < 10) {
    const aloneContext = isAlone ? "Laburás solo y " : ""
    const hoursContext = hours > 0 && hourlyRate < 500 
      ? `Laburás ${hours} horas y te quedan $${hourlyRate.toFixed(0)} por hora. ` 
      : ""
    
    return {
      headline: isAlone 
        ? "Laburás todo el día y no te queda nada"
        : "Hoy tu negocio se esfuerza más de lo que gana",
      problem: netMargin < 0 
        ? `${aloneContext}${hoursContext}Estás perdiendo plata. Cada trabajo te cuesta más de lo que cobrás. No es que no laburás, es que los números no cierran.`
        : `${aloneContext}${hoursContext}Tu margen es tan bajo que cualquier imprevisto te rompe. Estás laburando para sostener, no para crecer.`,
      action: netMargin < 0
        ? "Si querés, te ayudo a revisar tus precios. Estás cobrando menos de lo que te cuesta laburar y eso tiene solución."
        : "Te puedo ayudar a subir tus precios o bajar tus costos. No es imposible, solo hay que ver cómo.",
      upsellMessage: score < 40 
        ? "No estás mal vos. Con estos números, lo raro sería que te vaya bien solo. Si querés, te ayudo a ordenarlo."
        : undefined
    }
  }
  
  // ATENCIÓN: Margen bajo pero positivo, o estable sin crecimiento
  if (status === "ATENCIÓN" || (netMargin >= 10 && netMargin < 20)) {
    const aloneContext = isAlone ? "Laburás solo, " : ""
    const hoursContext = hours > 0 && hourlyRate < 800
      ? `laburás ${hours} horas y te quedan $${hourlyRate.toFixed(0)} por hora. `
      : ""
    
    return {
      headline: isAlone
        ? "Estás cansado de laburar para no ganar"
        : "El problema no es vender, es lo que te queda",
      problem: trend === "estable"
        ? `${aloneContext}${hoursContext}Tu negocio está estancado. Laburás lo mismo, ganás lo mismo, pero todo sube. Es una cuenta regresiva.`
        : `${aloneContext}${hoursContext}Tu margen es justo. Funciona, pero no sobra nada. Un mes malo y entrás en rojo.`,
      action: trend === "estable"
        ? "Si me lo permitís, te ayudo a ver cómo crecer o ajustar. No tenés que quedarte quieto laburando así."
        : "Te puedo ayudar a aumentar tu margen en 5 puntos. Eso te da respiro para no estar siempre al límite.",
      upsellMessage: score < 40
        ? "No estás mal vos. Con estos números, lo raro sería que te vaya bien solo. Si querés, te ayudo a ordenarlo."
        : undefined
    }
  }
  
  // OK pero con margen medio (20-30%)
  if (status === "OK" && netMargin >= 20 && netMargin < 30) {
    return {
      headline: "Tu negocio funciona, pero podés hacerlo mejor",
      problem: "Tenés margen, pero no es suficiente para crecer tranquilo. Estás en zona segura, pero no en zona de expansión.",
      action: "Si querés, te ayudo a aumentar tu margen 10 puntos más. Eso te da el capital para invertir en crecimiento.",
      upsellMessage: undefined
    }
  }
  
  // OK con buen margen (30%+)
  if (status === "OK" && netMargin >= 30) {
    return {
      headline: "Tu negocio está bien armado",
      problem: "Tenés margen suficiente. El problema ahora es no desperdiciarlo en cosas que no escalan.",
      action: "Te puedo ayudar a ver dónde invertir ese margen extra para que multiplique tus ingresos. No tiene que quedarse quieto.",
      upsellMessage: undefined
    }
  }
  
  // Fallback
  return {
    headline: "Tu negocio necesita un ajuste",
    problem: "Hay algo en tus números que no cierra. Necesitás ver el diagnóstico completo.",
      action: "Si querés, te ayudo a revisar tus costos y precios. Algo está desbalanceado y se puede arreglar.",
      upsellMessage: score < 40
      ? "No estás mal vos. Con este diagnóstico, lo raro sería que te vaya bien solo. Si querés, te ayudo a ordenarlo."
      : undefined
  }
}

/**
 * Generar mensaje de upsell cuando score < 40
 */
export function getUpsellMessage(score: number, status: "OK" | "ATENCIÓN" | "RIESGO"): string | null {
  if (score >= 40) return null
  
  if (status === "RIESGO") {
    return "No estás mal vos. Con este diagnóstico, lo raro sería que te vaya bien solo. Si querés, te ayudo a ordenarlo con un plan mensual."
  }
  
  if (status === "ATENCIÓN") {
    return "No estás mal vos. Con este diagnóstico, lo raro sería que te vaya bien solo. Si querés, te ayudo con un seguimiento mensual para que no caigas en rojo."
  }
  
  return "No estás mal vos. Con este diagnóstico, lo raro sería que te vaya bien solo. Si querés, te ayudo a mantener el orden con un plan mensual."
}

/**
 * Traducir tendencia a lenguaje humano
 */
export function translateTrend(trend: "mejorando" | "estable" | "empeorando"): string {
  switch (trend) {
    case "mejorando":
      return "Tus números están mejorando"
    case "estable":
      return "Tus números están estancados"
    case "empeorando":
      return "Tus números están empeorando"
  }
}

