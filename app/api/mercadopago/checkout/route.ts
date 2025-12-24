import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createMercadoPagoSubscription } from "@/lib/mercadopago"
import { prisma } from "@/lib/prisma"

const PLANS = {
  pro: {
    name: "Pro",
    amount: 29.99, // USD - ajustar según tu mercado
    id: "pro",
  },
  enterprise: {
    name: "Enterprise",
    amount: 99.99,
    id: "enterprise",
  },
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { organizationId, planId, couponCode } = await request.json()

    if (!organizationId || !planId) {
      return NextResponse.json(
        { error: "Organization ID and Plan ID are required" },
        { status: 400 }
      )
    }

    // Validar cupón si existe
    let discount = 0
    let couponId = null
    if (couponCode) {
      const { validateCoupon, applyDiscount } = await import("@/lib/billing/discounts")
      const coupon = await validateCoupon(couponCode)
      if (coupon) {
        couponId = coupon.id
        const amountAfterDiscount = applyDiscount(PLANS[planId as keyof typeof PLANS].amount, coupon)
        discount = PLANS[planId as keyof typeof PLANS].amount - amountAfterDiscount
      }
    }

    if (!session?.user?.email) {
      return NextResponse.json({ error: "User email not found" }, { status: 401 })
    }

    // Verificar usuario es miembro de la organización
    const member = await prisma.organizationMember.findFirst({
      where: {
        organizationId,
        user: { email: session.user.email },
        role: { in: ["owner", "admin"] },
      },
      include: {
        organization: {
          include: {
            subscriptions: true,
          },
        },
      },
    })

    if (!member) {
      return NextResponse.json(
        { error: "Unauthorized to manage this organization" },
        { status: 403 }
      )
    }

    const plan = PLANS[planId as keyof typeof PLANS]
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    // Obtener o crear suscripción
    let subscription = member.organization.subscriptions[0]

    if (!subscription) {
      subscription = await prisma.subscription.create({
        data: {
          organizationId,
          plan: "free",
          status: "inactive",
        },
      })
    }

    // Obtener información del usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    // Crear preferencia de Mercado Pago con el descuento aplicado
    const finalAmount = Math.max(0, plan.amount - discount)
    const mercadoPagoPreference = await createMercadoPagoSubscription(
      organizationId,
      plan.id,
      plan.name,
      finalAmount,
      user?.email || "",
      member.organization.name
    )

    // Actualizar suscripción con información de Mercado Pago y cupón
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        mercadoPagoPreferenceId: mercadoPagoPreference.id,
        paymentProvider: "mercado_pago",
        plan: planId,
        amount: finalAmount,
        currency: "USD",
        couponId: couponId, // Almacenar el cupón usado
      },
    })

    return NextResponse.json({
      url: mercadoPagoPreference.init_point,
      preferenceId: mercadoPagoPreference.id,
    })
  } catch (error: any) {
    console.error("Mercado Pago checkout error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

