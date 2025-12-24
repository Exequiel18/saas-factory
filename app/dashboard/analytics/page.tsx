import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogoutButton } from "@/components/logout-button"
import { TrendingUp, DollarSign, Users, Building2 } from "lucide-react"

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Obtener todas las organizaciones del usuario
  const userOrganizations = await prisma.organizationMember.findMany({
    where: { userId: session.user.id },
    include: {
      organization: {
        include: {
          subscriptions: {
            include: {
              payments: {
                where: {
                  status: "approved",
                },
              },
            },
          },
        },
      },
    },
  })

  // Calcular estadísticas
  const totalRevenue = userOrganizations?.reduce((sum, member) => {
    const subscription = member.organization?.subscriptions?.[0]
    const payments = subscription?.payments || []
    return sum + payments.reduce((paymentSum, payment) => paymentSum + (payment.amount || 0), 0)
  }, 0) || 0

  const activeSubscriptions = userOrganizations.filter(
    (member) => member.organization.subscriptions[0]?.status === "active"
  ).length

  const totalOrganizations = userOrganizations.length

  const totalMembers = await prisma.organizationMember.count({
    where: {
      organizationId: {
        in: userOrganizations?.map((m) => m.organizationId) || [],
      },
    },
  })

  // Obtener pagos recientes
  const recentPayments = await prisma.payment.findMany({
    where: {
      subscription: {
        organizationId: {
          in: userOrganizations?.map((m) => m.organizationId) || [],
        },
      },
      status: "approved",
    },
    include: {
      subscription: {
        include: {
          organization: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                ← Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Analytics & Ingresos</h1>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-600">{session.user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* Estadísticas principales */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Ingresos Totales</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-green-500" />
                ${totalRevenue.toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                <TrendingUp className="h-4 w-4 inline mr-1" />
                Todos los pagos aprobados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Suscripciones Activas</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-blue-500" />
                {activeSubscriptions}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Organizaciones con plan pagado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Organizaciones</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Building2 className="h-6 w-6 text-purple-500" />
                {totalOrganizations}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Organizaciones que gestionas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Miembros</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Users className="h-6 w-6 text-orange-500" />
                {totalMembers}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Miembros en todas tus organizaciones
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pagos recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Pagos Recientes</CardTitle>
            <CardDescription>Historial de transacciones aprobadas</CardDescription>
          </CardHeader>
          <CardContent>
            {recentPayments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No hay pagos registrados aún</p>
                <Link href="/pricing">
                  <Button>Ver Planes</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">
                        {payment.subscription.organization.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Plan {payment.subscription.plan} -{" "}
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {payment.paymentMethod === "mercado_pago"
                          ? "Mercado Pago"
                          : payment.paymentMethod === "stripe"
                            ? "Stripe"
                            : payment.paymentMethod}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        ${payment.amount.toFixed(2)} {payment.currency}
                      </p>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Meta de ingresos */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Meta de Ingresos</CardTitle>
            <CardDescription>Objetivo: $20,000 USD</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progreso</span>
                <span>
                  ${totalRevenue.toFixed(2)} / $20,000.00 (
                  {((totalRevenue / 20000) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full transition-all"
                  style={{
                    width: `${Math.min((totalRevenue / 20000) * 100, 100)}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Faltan ${(20000 - totalRevenue).toFixed(2)} para alcanzar la meta
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}






