import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Users, Zap, Heart } from "lucide-react"

const VALUES = [
  {
    icon: Target,
    title: "Nuestra Misión",
    description: "Ayudar a emprendedores y empresas a construir sus SaaS más rápido, sin comprometer calidad ni seguridad.",
  },
  {
    icon: Zap,
    title: "Velocidad",
    description: "Lanza tu producto en días, no meses. Nuestra plantilla incluye todo lo esencial para empezar.",
  },
  {
    icon: Users,
    title: "Comunidad",
    description: "Únete a miles de desarrolladores y emprendedores que están construyendo el futuro.",
  },
  {
    icon: Heart,
    title: "Pasión",
    description: "Amamos lo que hacemos y queremos que tú también puedas construir algo increíble.",
  },
]

export default function AboutPage() {
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
          <h2 className="text-5xl font-bold mb-4">Sobre Nosotros</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Construimos SaaS Factory para que puedas lanzar tu producto más rápido
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="prose prose-lg mx-auto">
            <p className="text-lg text-gray-700 mb-6">
              SaaS Factory nació de la necesidad de tener una plantilla completa y funcional
              para construir aplicaciones SaaS modernas. Después de años desarrollando productos
              desde cero, decidimos crear una solución que incluyera todo lo esencial.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Nuestra misión es simple: <strong>ayudarte a construir tu SaaS más rápido</strong>.
              No queremos que pierdas tiempo configurando autenticación, pagos o multi-tenancy.
              Queremos que te enfoques en lo que realmente importa: tu producto.
            </p>
            <p className="text-lg text-gray-700">
              Con más de <strong>10,000+ desarrolladores</strong> usando SaaS Factory, hemos
              ayudado a crear cientos de productos exitosos. Y queremos ayudarte a crear el tuyo.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {VALUES.map((value, index) => {
            const Icon = value.icon
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mb-2">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="bg-primary/5 rounded-lg p-8 text-center">
          <h3 className="text-3xl font-bold mb-4">¿Listo para Empezar?</h3>
          <p className="text-gray-600 mb-6">
            Únete a miles de empresas que están construyendo su futuro con SaaS Factory
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






