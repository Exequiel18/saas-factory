import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, User, ArrowRight } from "lucide-react"

const BLOG_POSTS = [
  {
    id: 1,
    title: "Cómo Construir un SaaS Exitoso en 2024",
    excerpt: "Guía completa para lanzar tu SaaS desde cero. Aprende las mejores prácticas y evita errores comunes.",
    author: "Equipo SaaS Factory",
    date: "2024-01-15",
    category: "Guías",
    readTime: "5 min",
  },
  {
    id: 5,
    title: "Optimización de Rentabilidad en Panaderías con IA",
    excerpt: "¿Sabías que los costos fijos están devorando tu margen? Descubre cómo nuestra calculadora detecta fugas de capital invisibles.",
    author: "Equipo SaaS Factory",
    date: "2025-12-19",
    category: "Negocios Locales",
    readTime: "6 min",
  },
  {
    id: 6,
    title: "Flujo de Caja en Retail: Guía de Supervivencia",
    excerpt: "Evita quiebras técnicas mediante el diagnóstico temprano. Aprende a leer tus números antes de que sea tarde.",
    author: "Equipo SaaS Factory",
    date: "2025-12-19",
    category: "Finanzas",
    readTime: "7 min",
  },
  {
    id: 7,
    title: "Por qué gastar $3.000 ARS te ahorra $300.000 ARS",
    excerpt: "El ROI de un diagnóstico profesional es inmediato. Te mostramos casos reales de negocios tradicionales que salvaron su margen.",
    author: "Equipo SaaS Factory",
    date: "2025-12-19",
    category: "Casos de Éxito",
    readTime: "4 min",
  },
  {
    id: 2,
    title: "Integración de Pagos con Mercado Pago: Guía Completa",
    excerpt: "Aprende a integrar Mercado Pago en tu aplicación y empezar a recibir pagos en minutos.",
    author: "Equipo SaaS Factory",
    date: "2024-01-10",
    category: "Tutoriales",
    readTime: "8 min",
  },
  {
    id: 3,
    title: "10 Estrategias para Aumentar tus Ingresos SaaS",
    excerpt: "Descubre técnicas probadas para aumentar tus ingresos recurrentes y llegar a tus metas financieras.",
    author: "Equipo SaaS Factory",
    date: "2024-01-05",
    category: "Negocios",
    readTime: "6 min",
  },
  {
    id: 4,
    title: "Multi-Tenancy: Todo lo que Necesitas Saber",
    excerpt: "Comprende cómo funciona el multi-tenancy y por qué es esencial para tu SaaS.",
    author: "Equipo SaaS Factory",
    date: "2024-01-01",
    category: "Técnico",
    readTime: "10 min",
  },
]

export default function BlogPage() {
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
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4">Blog</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Aprende sobre SaaS, desarrollo, negocios y más
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {BLOG_POSTS.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                    {post.category}
                  </span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <Link href={`/blog/${post.id}`}>
                  <Button variant="ghost" className="w-full mt-4">
                    Leer más <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-primary/5 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">¿Quieres Más Contenido?</h3>
          <p className="text-gray-600 mb-6">
            Suscríbete a nuestro newsletter para recibir las últimas actualizaciones
          </p>
          <div className="flex gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="tu@email.com"
              className="flex-1 px-4 py-2 border rounded-md"
            />
            <Button>Suscribirse</Button>
          </div>
        </div>
      </main>
    </div>
  )
}






