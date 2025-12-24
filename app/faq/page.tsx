import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"

const FAQS = [
  {
    question: "¿Cómo funciona el sistema de pagos?",
    answer: "Usamos Mercado Pago para procesar pagos de forma segura. Los pagos se procesan automáticamente y tu suscripción se activa inmediatamente después de la aprobación.",
  },
  {
    question: "¿Puedo cambiar de plan en cualquier momento?",
    answer: "Sí, puedes actualizar o degradar tu plan en cualquier momento. Los cambios se aplicarán en el próximo ciclo de facturación. Si actualizas, tendrás acceso inmediato a las nuevas funcionalidades.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer: "Aceptamos todos los métodos de pago disponibles en Mercado Pago: tarjetas de crédito/débito, transferencias bancarias, y más. También soportamos Stripe como alternativa.",
  },
  {
    question: "¿Hay período de prueba?",
    answer: "Sí, todos los planes incluyen un período de prueba gratuito de 14 días. Puedes cancelar en cualquier momento durante el período de prueba sin cargos.",
  },
  {
    question: "¿Cómo funciona el sistema de referidos?",
    answer: "Cada usuario tiene un código único de referido. Cuando alguien se registra usando tu código, ambos reciben créditos. $10 por registro, $50 si se suscribe a Pro, y $100 si se suscribe a Enterprise.",
  },
  {
    question: "¿Mis datos están seguros?",
    answer: "Absolutamente. Usamos encriptación de extremo a extremo, cumplimos con GDPR, y todos los pagos se procesan de forma segura a través de Mercado Pago y Stripe.",
  },
  {
    question: "¿Puedo cancelar mi suscripción?",
    answer: "Sí, puedes cancelar tu suscripción en cualquier momento sin penalizaciones. No hay compromisos a largo plazo. Tu acceso continuará hasta el final del período de facturación actual.",
  },
  {
    question: "¿Ofrecen soporte técnico?",
    answer: "Sí, ofrecemos soporte por email para todos los planes. Los planes Pro y Enterprise incluyen soporte prioritario y los planes Enterprise incluyen soporte 24/7.",
  },
  {
    question: "¿Puedo usar mi propio dominio?",
    answer: "Sí, todos los planes incluyen la posibilidad de usar tu propio dominio personalizado. Los planes Enterprise incluyen configuración asistida.",
  },
  {
    question: "¿Hay límites de uso?",
    answer: "El plan Free tiene límites básicos. Los planes Pro y Enterprise incluyen uso ilimitado de todas las funcionalidades. Revisa nuestra página de precios para más detalles.",
  },
]

export default function FAQPage() {
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
          <h2 className="text-5xl font-bold mb-4">Preguntas Frecuentes</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encuentra respuestas a las preguntas más comunes
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {FAQS.map((faq, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                    <ChevronDown className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                  </summary>
                  <p className="mt-4 text-gray-600">{faq.answer}</p>
                </details>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">¿No encuentras lo que buscas?</p>
          <Link href="/contact">
            <Button>Contactar Soporte</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}






