"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Zap, ShieldCheck, Lock, ChevronLeft } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Email o contraseña incorrectos.")
        setLoading(false)
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError("Algo salió mal. Intentá de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <Link href="/" className="mb-8 group flex items-center gap-2">
        <div className="bg-red-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
          <Zap className="h-5 w-5 text-white fill-current" />
        </div>
        <span className="text-xl font-black uppercase tracking-tighter">SaaS Factory</span>
      </Link>

      <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden bg-slate-50">
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Bienvenido</h1>
          <p className="text-slate-500 font-medium mb-8">Administrá tu tiempo recuperado.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl animate-in fade-in zoom-in-95">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tu Email</label>
              <Input
                type="email"
                placeholder="vos@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 rounded-xl border-slate-200 focus:border-red-600 focus:ring-red-600 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contraseña</label>
                <Link href="#" className="text-[10px] font-black text-red-600 uppercase tracking-widest hover:underline">¿La olvidaste?</Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-14 rounded-xl border-slate-200 focus:border-red-600 focus:ring-red-600 bg-white"
              />
            </div>

            <Button type="submit" className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-2xl shadow-lg shadow-red-100 transition-all mt-4" disabled={loading}>
              {loading ? "Entrando..." : "Entrar al Comando"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            ¿No tenés cuenta?{" "}
            <Link href="/auth/signup" className="text-red-600 font-black hover:underline">
              Crear una ahora
            </Link>
          </p>
        </div>

        <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
          <Lock className="h-48 w-48 text-slate-900" />
        </div>
      </Card>

      <Link href="/" className="mt-8 text-sm font-bold text-slate-300 hover:text-slate-600 transition-colors uppercase tracking-[0.2em]">
        Volver al inicio
      </Link>
    </div>
  )
}
