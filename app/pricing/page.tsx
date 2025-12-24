import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const PLANS = [
  {
    name: "Free",
    price: "$0",
    priceId: null,
    description: "Perfecto para empezar",
    features: [
      "Hasta 1 organización",
      "Hasta 5 miembros",
      "Funciones básicas",
      "Soporte por email",
      "Acceso a dashboard básico",
    ],
    cta: "Empezar gratis",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29.99",
    priceId: "pro",
    description: "Para equipos en crecimiento",
    features: [
      "Organizaciones ilimitadas",
      "Miembros ilimitados",
      "Todas las funciones Pro",
      "Soporte prioritario",
      "Analytics avanzados",
      "Integraciones personalizadas",
      "Facturación mensual",
    ],
    cta: "Comenzar ahora",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99.99",
    priceId: "enterprise",
    description: "Para empresas grandes",
    features: [
      "Todo lo de Pro",
      "Soporte 24/7",
      "Gerente de cuenta dedicado",
      "Personalización completa",
      "API ilimitada",
      "SLA garantizado",
      "Facturación anual disponible",
      "Capacitación incluida",
    ],
    cta: "Contactar ventas",
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold">SaaS Factory</h1>
          </Link>
          <div className="flex gap-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Empezar Gratis</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            Precios Simples y Transparentes
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Elige el plan perfecto para tu negocio. Todos los planes incluyen
            prueba gratuita de 14 días.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular
                  ? "border-primary shadow-lg scale-105"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Más Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "$0" && (
                    <span className="text-gray-600">/mes</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  {plan.priceId ? (
                    <Link href={`/auth/signup?plan=${plan.priceId}`}>
                      <Button
                        className="w-full"
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/auth/signup">
                      <Button className="w-full" variant="outline">
                        {plan.cta}
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            ¿Necesitas un plan personalizado?
          </p>
          <Link href="/contact">
            <Button variant="outline">Contactar Ventas</Button>
          </Link>
        </div>

        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-center mb-6">
            Preguntas Frecuentes
          </h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div>
              <h4 className="font-semibold mb-2">¿Puedo cambiar de plan después?</h4>
              <p className="text-sm text-gray-600">
                Sí, puedes actualizar o degradar tu plan en cualquier momento.
                Los cambios se aplicarán en el próximo ciclo de facturación.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">¿Qué métodos de pago aceptan?</h4>
              <p className="text-sm text-gray-600">
                Aceptamos tarjetas de crédito/débito, Mercado Pago, y
                transferencias bancarias para planes Enterprise.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">¿Hay descuentos anuales?</h4>
              <p className="text-sm text-gray-600">
                Sí, ofrecemos un 20% de descuento en planes anuales. Contacta
                a nuestro equipo de ventas para más información.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">¿Puedo cancelar en cualquier momento?</h4>
              <p className="text-sm text-gray-600">
                Sí, puedes cancelar tu suscripción en cualquier momento sin
                penalizaciones. No hay compromisos a largo plazo.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

