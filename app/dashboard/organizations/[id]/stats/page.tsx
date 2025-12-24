import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogoutButton } from "@/components/logout-button"
import { DollarSign, Users, CreditCard, TrendingUp } from "lucide-react"

export default async function OrganizationStatsPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Obtener estadísticas
  const statsResponse = await fetch(
    `${process.env.NEXTAUTH_URL}/api/organizations/${params.id}/stats`,
    {
      headers: {
        Cookie: `next-auth.session-token=${session.user.id}`, // Simplificado
      },
    }
  )

  const stats = statsResponse.ok ? await statsResponse.json() : null

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/organizations/${params.id}`}>
              <Button variant="ghost" size="sm">
                ← Volver
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Estadísticas</h1>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-600">{session.user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Plan Actual</CardDescription>
              <CardTitle className="text-2xl capitalize">
                {stats?.subscription?.plan || "Free"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 capitalize">
                Estado: {stats?.subscription?.status || "inactive"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Miembros</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Users className="h-5 w-5" />
                {stats?.members?.total || 0}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Gastado</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                ${(stats?.payments?.totalSpent || 0).toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {stats?.payments?.total || 0} pagos realizados
              </p>
            </CardContent>
          </Card>
        </div>

        {stats?.payments?.recent && stats.payments.recent.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pagos Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.payments.recent.map((payment: any) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{payment.description}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-bold text-green-600">
                      ${payment.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}






