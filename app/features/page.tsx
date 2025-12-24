import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Zap, Users, CreditCard, BarChart, Lock, Globe, HeadphonesIcon } from "lucide-react"

const FEATURES = [
  {
    icon: Shield,
    title: "Seguridad de Nivel Empresarial",
    description: "Autenticación robusta, encriptación de datos y cumplimiento con estándares de seguridad internacionales.",
  },
  {
    icon: Zap,
    title: "Rendimiento Optimizado",
    description: "Carga rápida, optimización automática y escalabilidad para manejar millones de usuarios.",
  },
  {
    icon: Users,
    title: "Multi-Tenancy Completo",
    description: "Gestiona múltiples organizaciones con control de acceso granular y roles personalizables.",
  },
  {
    icon: CreditCard,
    title: "Pagos Integrados",
    description: "Mercado Pago y Stripe integrados. Facturación automática, suscripciones y gestión de pagos.",
  },
  {
    icon: BarChart,
    title: "Analytics en Tiempo Real",
    description: "Dashboard completo con métricas, ingresos, usuarios y análisis detallados de tu negocio.",
  },
  {
    icon: Lock,
    title: "Privacidad y Cumplimiento",
    description: "GDPR compliant, protección de datos y políticas de privacidad configurables.",
  },
  {
    icon: Globe,
    title: "Multi-idioma",
    description: "Soporte para múltiples idiomas y localización automática según la región del usuario.",
  },
  {
    icon: HeadphonesIcon,
    title: "Soporte 24/7",
    description: "Soporte técnico dedicado, documentación completa y comunidad activa de desarrolladores.",
  },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold">SaaS Factory</h1>
          </Link>
          <div className="flex gap-4">
            <Link href="/pricing">
              <Button variant="ghost">Precios</Button>
            </Link>
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
            Todo lo que Necesitas para Tu SaaS
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Funcionalidades completas y listas para usar. Construye tu SaaS sin preocuparte por la infraestructura.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mb-2">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="bg-primary/5 rounded-lg p-8 text-center">
          <h3 className="text-3xl font-bold mb-4">¿Listo para Empezar?</h3>
          <p className="text-gray-600 mb-6">
            Únete a miles de empresas que confían en SaaS Factory
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg">Empezar Gratis</Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                Ver Planes
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}






