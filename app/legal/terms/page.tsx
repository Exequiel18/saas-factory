import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold mb-8">Términos de Servicio</h1>
        <div className="prose prose-lg">
          <p className="text-gray-600 mb-6">
            Última actualización: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Aceptación de los Términos</h2>
            <p className="text-gray-700 mb-4">
              Al acceder y usar SaaS Factory, aceptas cumplir con estos términos de servicio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Uso del Servicio</h2>
            <p className="text-gray-700 mb-4">
              Te otorgamos una licencia limitada, no exclusiva y no transferible para usar
              nuestro servicio de acuerdo con estos términos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Pagos y Facturación</h2>
            <p className="text-gray-700 mb-4">
              Los pagos se procesan a través de Mercado Pago o Stripe. Las suscripciones
              se renuevan automáticamente a menos que las canceles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Cancelación</h2>
            <p className="text-gray-700 mb-4">
              Puedes cancelar tu suscripción en cualquier momento. No hay reembolsos
              por períodos parciales, pero tendrás acceso hasta el final del período pagado.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Limitación de Responsabilidad</h2>
            <p className="text-gray-700 mb-4">
              SaaS Factory se proporciona &quot;tal cual&quot; sin garantías. No seremos responsables
              por daños indirectos o consecuentes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Modificaciones</h2>
            <p className="text-gray-700">
              Nos reservamos el derecho de modificar estos términos en cualquier momento.
              Te notificaremos de cambios significativos.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}






