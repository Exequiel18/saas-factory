import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogoutButton } from "@/components/logout-button"
import { Gift, TrendingUp, Users } from "lucide-react"

export default async function CreditsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      credits: true,
      referralCode: true,
      referredBy: true,
    },
  })

  // Obtener referidos del usuario
  const referrals = await prisma.user.findMany({
    where: {
      referredBy: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  })

  // Calcular créditos ganados por referidos con seguridad
  const creditsFromReferrals = (referrals?.length || 0) * 10

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
            <h1 className="text-2xl font-bold">Mis Créditos</h1>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-600">{session.user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Balance de Créditos */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-6 w-6 text-primary" />
                Balance de Créditos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-5xl font-bold text-primary mb-2">
                  ${user?.credits.toFixed(2) || "0.00"}
                </p>
                <p className="text-gray-600">Créditos disponibles</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Ganados por Referidos</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${creditsFromReferrals.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total de Referidos</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {referrals?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cómo Usar Créditos */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>¿Cómo Usar Mis Créditos?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Aplicar a Suscripción</h4>
                  <p className="text-sm text-gray-600">
                    Los créditos se aplican automáticamente al renovar tu suscripción
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Descuentos Automáticos</h4>
                  <p className="text-sm text-gray-600">
                    Si tienes suficientes créditos, se usarán para cubrir el costo completo
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Gana Más Créditos</h4>
                  <p className="text-sm text-gray-600">
                    Invita más amigos usando tu código de referido para ganar más créditos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mis Referidos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Mis Referidos ({referrals.length})
              </CardTitle>
              <CardDescription>
                Personas que se registraron usando tu código
              </CardDescription>
            </CardHeader>
            <CardContent>
              {referrals.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Aún no tienes referidos</p>
                  <Link href="/dashboard/referrals">
                    <Button>Compartir Mi Código</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {referrals.map((referral) => (
                    <div
                      key={referral.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-semibold">{referral.name || referral.email}</p>
                        <p className="text-sm text-gray-600">
                          Registrado: {new Date(referral.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">+$10.00</p>
                        <p className="text-xs text-gray-500">Crédito ganado</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* CTA para Referidos */}
          <div className="mt-6 text-center">
            <Link href="/dashboard/referrals">
              <Button size="lg" className="w-full md:w-auto">
                <TrendingUp className="h-4 w-4 mr-2" />
                Invitar Más Amigos y Ganar Créditos
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}






