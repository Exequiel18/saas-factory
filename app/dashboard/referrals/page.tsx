import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogoutButton } from "@/components/logout-button"
import { Copy, Share2, Users, Gift } from "lucide-react"
import { ReferralCard } from "@/components/referral-card"

export default async function ReferralsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const userId = session.user?.id || "default"
  const referralCode = `REF-${userId.slice(0, 8).toUpperCase()}`
  const referralUrl = `${process.env.NEXTAUTH_URL || ''}/auth/signup?ref=${referralCode}`

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
            <h1 className="text-2xl font-bold">Programa de Referidos</h1>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-600">{session.user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">
              Invita Amigos y Gana Recompensas
            </h2>
            <p className="text-gray-600">
              Comparte tu código de referido y obtén beneficios por cada amigo que se registre
            </p>
          </div>

          <ReferralCard referralCode={referralCode} referralUrl={referralUrl} />

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardHeader>
                <div className="p-3 bg-blue-100 rounded-lg w-fit mb-2">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Invita Amigos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Comparte tu código único con amigos y colegas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="p-3 bg-green-100 rounded-lg w-fit mb-2">
                  <Gift className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Gana Recompensas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Obtén créditos y descuentos por cada referido exitoso
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="p-3 bg-purple-100 rounded-lg w-fit mb-2">
                  <Share2 className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Comparte Fácilmente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Comparte por email, redes sociales o mensaje directo
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>¿Cómo Funciona?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Comparte tu Código</h4>
                  <p className="text-sm text-gray-600">
                    Copia tu código único o comparte el enlace de referido
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Tu Amigo se Registra</h4>
                  <p className="text-sm text-gray-600">
                    Tu amigo se registra usando tu código y crea su cuenta
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Ambos Ganan</h4>
                  <p className="text-sm text-gray-600">
                    Tú y tu amigo reciben beneficios y créditos en sus cuentas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}






