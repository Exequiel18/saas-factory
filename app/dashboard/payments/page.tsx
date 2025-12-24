import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogoutButton } from "@/components/logout-button"
import { Download, FileText } from "lucide-react"

export default async function PaymentsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Obtener todas las organizaciones del usuario
  const userOrganizations = await prisma.organizationMember.findMany({
    where: { userId: session.user.id },
    include: {
      organization: true,
    },
  })

  // Obtener todos los pagos
  const allPayments = await prisma.payment.findMany({
    where: {
      subscription: {
        organizationId: {
          in: userOrganizations?.map((m) => m.organizationId) || [],
        },
      },
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
  })

  // Agrupar por estado
  const paymentsByStatus = {
    approved: allPayments.filter((p) => p.status === "approved"),
    pending: allPayments.filter((p) => p.status === "pending"),
    rejected: allPayments.filter((p) => p.status === "rejected"),
  }

  const totalRevenue = paymentsByStatus.approved.reduce(
    (sum, p) => sum + p.amount,
    0
  )

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
            <h1 className="text-2xl font-bold">Facturación y Pagos</h1>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-600">{session.user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* Resumen */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Pagado</CardDescription>
              <CardTitle className="text-3xl">
                ${totalRevenue.toFixed(2)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pagos Aprobados</CardDescription>
              <CardTitle className="text-3xl text-green-600">
                {paymentsByStatus.approved.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pendientes</CardDescription>
              <CardTitle className="text-3xl text-yellow-600">
                {paymentsByStatus.pending.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Rechazados</CardDescription>
              <CardTitle className="text-3xl text-red-600">
                {paymentsByStatus.rejected.length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Historial de pagos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Historial de Pagos</CardTitle>
                <CardDescription>Todos tus pagos y facturas</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {allPayments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No hay pagos registrados</p>
                <Link href="/pricing">
                  <Button>Ver Planes</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {allPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 rounded">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold">
                          {payment.subscription.organization.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {payment.description || `Pago ${payment.subscription.plan}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(payment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        ${payment.amount.toFixed(2)} {payment.currency}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded ${payment.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : payment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                      >
                        {payment.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {payment.paymentMethod === "mercado_pago"
                          ? "Mercado Pago"
                          : payment.paymentMethod === "stripe"
                            ? "Stripe"
                            : payment.paymentMethod}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}






