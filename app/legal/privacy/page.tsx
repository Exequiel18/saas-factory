import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
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

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Política de Privacidad</h1>
        <div className="prose prose-lg">
          <p className="text-gray-600 mb-6">
            Última actualización: {new Date().toLocaleDateString()}
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Información que Recopilamos</h2>
            <p className="text-gray-700 mb-4">
              Recopilamos información que nos proporcionas directamente, como nombre, email,
              y datos de pago cuando te registras o realizas una compra.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Cómo Usamos tu Información</h2>
            <p className="text-gray-700 mb-4">
              Usamos tu información para proporcionar, mantener y mejorar nuestros servicios,
              procesar pagos, y comunicarnos contigo.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Seguridad de los Datos</h2>
            <p className="text-gray-700 mb-4">
              Implementamos medidas de seguridad técnicas y organizativas para proteger
              tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Compartir Información</h2>
            <p className="text-gray-700 mb-4">
              No vendemos tu información personal. Solo compartimos datos con proveedores
              de servicios de confianza (como Mercado Pago y Stripe) que nos ayudan a operar.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Tus Derechos</h2>
            <p className="text-gray-700 mb-4">
              Tienes derecho a acceder, corregir o eliminar tu información personal en cualquier momento.
              Puedes hacerlo desde tu configuración de cuenta.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Contacto</h2>
            <p className="text-gray-700">
              Si tienes preguntas sobre esta política, contáctanos en: soporte@saasfactory.com
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}






