import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const TESTIMONIALS = [
  {
    name: "María González",
    role: "CEO, TechStart",
    company: "TechStart",
    image: null,
    content: "SaaS Factory nos permitió lanzar nuestra plataforma en tiempo récord. La integración con Mercado Pago fue perfecta para nuestro mercado latinoamericano.",
    rating: 5,
  },
  {
    name: "Carlos Rodríguez",
    role: "CTO, InnovateLab",
    company: "InnovateLab",
    image: null,
    content: "Increíble plantilla. Tiene todo lo que necesitas para empezar un SaaS profesional. El sistema de multi-tenancy es robusto y fácil de usar.",
    rating: 5,
  },
  {
    name: "Ana Martínez",
    role: "Fundadora, CloudSolutions",
    company: "CloudSolutions",
    image: null,
    content: "Ahorramos meses de desarrollo usando SaaS Factory. La documentación es excelente y el código es de calidad profesional.",
    rating: 5,
  },
  {
    name: "Diego Fernández",
    role: "Desarrollador Full Stack",
    company: "Freelance",
    image: null,
    content: "Como desarrollador independiente, SaaS Factory me permitió crear un producto completo sin tener que construir toda la infraestructura desde cero.",
    rating: 5,
  },
  {
    name: "Laura Sánchez",
    role: "Product Manager, DataFlow",
    company: "DataFlow",
    image: null,
    content: "El dashboard de analytics es increíble. Podemos ver todos nuestros ingresos y métricas en tiempo real. Muy útil para tomar decisiones.",
    rating: 5,
  },
  {
    name: "Roberto López",
    role: "CEO, StartupHub",
    company: "StartupHub",
    image: null,
    content: "La integración con Mercado Pago fue clave para nosotros. Nuestros clientes pueden pagar fácilmente y nosotros recibimos los pagos sin problemas.",
    rating: 5,
  },
]

export default function TestimonialsPage() {
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
            Lo que Dicen Nuestros Clientes
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Miles de empresas confían en SaaS Factory para construir sus productos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {TESTIMONIALS.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.image || undefined} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-primary/5 rounded-lg p-8 text-center">
          <h3 className="text-3xl font-bold mb-4">¿Listo para Unirte?</h3>
          <p className="text-gray-600 mb-6">
            Únete a miles de empresas que están construyendo su SaaS con nosotros
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






