import { redirect } from "next/navigation"

// Redirección temporal mientras se despliega la página
export async function GET() {
  // Si la página no está disponible, redirigir a una página de instrucciones
  redirect('/dashboard/deploy')
}

