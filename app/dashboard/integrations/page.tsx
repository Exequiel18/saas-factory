import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogoutButton } from "@/components/logout-button"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"

export default async function IntegrationsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const hasMercadoPagoToken = !!process.env.MERCADOPAGO_ACCESS_TOKEN
  const hasMercadoPagoKey = !!process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
  const hasStripeKey = !!process.env.STRIPE_SECRET_KEY

  const mercadoPagoConfigured = hasMercadoPagoToken && hasMercadoPagoKey

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
            <h1 className="text-2xl font-bold">Integraciones</h1>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-600">{session.user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Configuración de Pagos</h2>
            <p className="text-gray-600">
              Configura tus métodos de pago para empezar a recibir ingresos
            </p>
          </div>

          <div className="space-y-6">
            {/* Mercado Pago */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Mercado Pago
                      {mercadoPagoConfigured ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </CardTitle>
                    <CardDescription>
                      Recibe pagos en Latinoamérica con Mercado Pago
                    </CardDescription>
                  </div>
                  <div>
                    {mercadoPagoConfigured ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        Configurado
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                        No Configurado
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Access Token</span>
                    {hasMercadoPagoToken ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Public Key</span>
                    {hasMercadoPagoKey ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Alias</span>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {process.env.MERCADOPAGO_ALIAS || "aliascomun.mp"}
                    </span>
                  </div>
                </div>
                {!mercadoPagoConfigured && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-yellow-800 mb-1">
                          Configuración Requerida
                        </p>
                        <p className="text-sm text-yellow-700 mb-3">
                          Necesitas configurar Mercado Pago para recibir pagos. Solo necesitas 2 credenciales.
                        </p>
                        <Link href="/QUE_NECESITAS_MERCADOPAGO.md" target="_blank">
                          <Button variant="outline" size="sm">
                            Ver Guía de Configuración
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stripe */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Stripe
                      {hasStripeKey ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-400" />
                      )}
                    </CardTitle>
                    <CardDescription>
                      Método de pago alternativo (opcional)
                    </CardDescription>
                  </div>
                  <div>
                    {hasStripeKey ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        Configurado
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold">
                        Opcional
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Stripe es opcional. Puedes usar solo Mercado Pago o ambos métodos de pago.
                </p>
              </CardContent>
            </Card>

            {/* Información */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">¿Necesitas Ayuda?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-800 mb-4">
                  Para configurar Mercado Pago, solo necesitas 2 credenciales que puedes obtener
                  en menos de 5 minutos.
                </p>
                <div className="space-y-2">
                  <Link href="/QUE_NECESITAS_MERCADOPAGO.md" target="_blank">
                    <Button variant="outline" className="w-full">
                      Ver Guía Completa de Mercado Pago
                    </Button>
                  </Link>
                  <Link href="/MERCADOPAGO_SETUP.md" target="_blank">
                    <Button variant="outline" className="w-full">
                      Ver Documentación Técnica
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}






