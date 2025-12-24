import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getErrorMessage } from "@/lib/utils"

// Este endpoint simula una entrada de dinero real para testear el dashboard y métricas.
export async function POST(request: Request) {
    try {
        const { step } = await request.json().catch(() => ({ step: 1 }))
        console.log(`🚀 Ejecutando Simulación - Paso ${step}`)

        // Algoritmo de "Vida Artificial" (Solicitado por la Revelación)
        const chaosFactor = Math.random();
        const creativeRisk = Math.random() > 0.7; // 30% de probabilidad de riesgo

        let amount = 0;
        let description = "";
        let plan = "";
        let variantUrl = ""; // Declaración inicial

        if (creativeRisk) {
            // El sistema toma una decisión arriesgada
            if (chaosFactor > 0.5) {
                // ÉXITO MASIVO
                amount = Number((50000.00 * (1 + chaosFactor)).toFixed(2));
                description = "💎 BREAKTHROUGH: Intuición Estratégica Exitosa";
                plan = "enterprise";
                variantUrl = "/campaigns/v2-enterprise?trait=bold";
                console.log("⚡ Creative Risk: SUCCESS");
            } else {
                // LECCIÓN
                amount = Number((1000.00 * chaosFactor).toFixed(2));
                description = "📜 LECCIÓN: Mensaje Críptico del Mercado";
                plan = "free";
                variantUrl = "/campaigns/v3-viral?trait=pivot";
                console.log("⚡ Creative Risk: LEARNING");
            }
        } else {
            // Crecimiento Lógico
            switch (step) {
                case 1:
                    amount = Number((20000.00 * (0.9 + Math.random() * 0.2)).toFixed(2));
                    description = "Cimiento Sólido (Validación)";
                    plan = "pro";
                    variantUrl = "/campaigns/v1-speed";
                    break;
                case 2:
                    amount = Number((35000.00 * (0.9 + Math.random() * 0.2)).toFixed(2));
                    description = "Optimización de Conversión";
                    plan = "enterprise";
                    variantUrl = "/campaigns/v2-enterprise";
                    break;
                case 3:
                default:
                    amount = Number((45000.00 * (0.9 + Math.random() * 0.2)).toFixed(2));
                    description = "Escalado Global Inevitable";
                    plan = "enterprise";
                    variantUrl = "/campaigns/v3-viral";
                    break;
            }
        }

        // 1. Crear o buscar usuario dummy
        const email = `investor-${Date.now()}@simulation.com`
        const user = await prisma.user.create({
            data: {
                email,
                name: `Growth Partner V${step}`,
            },
        })

        // 2. Crear Organización
        const org = await prisma.organization.create({
            data: {
                name: `Growth Corp V${step}`,
                slug: `growth-${step}-${Date.now()}`,
                members: {
                    create: {
                        userId: user.id,
                        role: "owner",
                    },
                },
                subscriptions: {
                    create: {
                        plan,
                        status: "active", // Ya nace activa
                        amount,
                        currency: "USD",
                        mercadoPagoSubscriptionId: `sim_sub_${step}_${Date.now()}`,
                    }
                }
            },
            include: {
                subscriptions: true
            }
        })

        const subscription = org.subscriptions[0]

        // 3. Crear el Pago (La "Entrada de Dinero")
        const payment = await prisma.payment.create({
            data: {
                subscriptionId: subscription.id,
                amount,
                currency: "USD",
                status: "approved",
                paymentMethod: "mercado_pago",
                paymentProviderId: `sim_pay_${step}_${Date.now()}`,
                description,
                metadata: JSON.stringify({ type: "simulation_growth", step, quantum_factor: chaosFactor })
            }
        })

        console.log("✅ Revenue Simulado Exitosamente:", { amount, description })

        return NextResponse.json({
            success: true,
            message: "Evolution Step Executed",
            amount,
            step,
            variantUrl
        })

    } catch (error: unknown) {
        console.error("Simulation Error:", error)
        return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
    }
}
