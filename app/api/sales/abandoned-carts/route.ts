import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        // Buscamos usuarios que no tengan ninguna suscripción activa
        const usersWithoutActiveSubscription = await prisma.user.findMany({
            where: {
                organizations: {
                    none: {
                        organization: {
                            subscriptions: {
                                some: {
                                    status: "active"
                                }
                            }
                        }
                    }
                }
            },
            take: 5, // Solo los últimos 5 para no saturar n8n
            orderBy: { createdAt: 'desc' }
        });

        const abandonedCarts = usersWithoutActiveSubscription.map(user => ({
            customerId: user.id,
            customerName: user.name || "Cliente Emprendedor",
            customerEmail: user.email,
            customerPhone: "5491112345678", // Placeholder ya que no tenemos teléfono en DB aún
            signupDate: user.createdAt
        }));

        return NextResponse.json({
            success: true,
            count: abandonedCarts.length,
            data: abandonedCarts
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
