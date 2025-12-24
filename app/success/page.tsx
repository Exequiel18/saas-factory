import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl">¡Pago Exitoso!</CardTitle>
          <CardDescription>
            Tu suscripción ha sido activada correctamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            Gracias por tu compra. Tu plan ha sido activado y ya puedes disfrutar
            de todas las funcionalidades premium.
          </p>
          <div className="space-y-2">
            <Link href="/dashboard" className="block">
              <Button className="w-full">Ir al Dashboard</Button>
            </Link>
            <Link href="/dashboard/organizations" className="block">
              <Button variant="outline" className="w-full">
                Ver Organizaciones
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}






