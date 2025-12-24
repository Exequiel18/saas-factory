import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendSignalToN8n } from "@/lib/n8n"

export async function GET() {
  try {
    // Verificar conexión a base de datos
    await prisma.$queryRaw`SELECT 1`

    // Verificar variables de entorno críticas
    const checks = {
      database: true,
      nextAuth: !!process.env.NEXTAUTH_SECRET && !!process.env.NEXTAUTH_URL,
      mercadoPago: !!process.env.MERCADOPAGO_ACCESS_TOKEN && !!process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY,
      stripe: !!process.env.STRIPE_SECRET_KEY,
    }

    const allHealthy = Object.values(checks).every(Boolean)

    // 🛰️ Notificar al Cerebro n8n sobre el estado del "Pulso" del sistema
    await sendSignalToN8n("health_check_pulse", {
      status: allHealthy ? "healthy" : "degraded",
      checks
    })

    return NextResponse.json({
      status: allHealthy ? "healthy" : "degraded",
      checks,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}






