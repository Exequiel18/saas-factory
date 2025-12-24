import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="text-6xl font-black text-slate-900 mb-4">404</div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Página no encontrada</h1>
        <p className="text-slate-600 mb-8">
          La página que buscás no existe. Volvé al inicio o hacé tu chequeo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="bg-red-600 hover:bg-red-700">
              Volver al Inicio
            </Button>
          </Link>
          <Link href="/chequeo-real">
            <Button variant="outline">
              Hacer Chequeo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}






