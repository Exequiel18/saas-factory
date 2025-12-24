"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Zap, ChevronLeft, ShieldCheck } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [referralCode, setReferralCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const ref = searchParams?.get("ref")
    if (ref) {
      setReferralCode(ref)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, referralCode: referralCode || undefined }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Algo salió mal. Intentá de nuevo.")
        setLoading(false)
        return
      }

      router.push("/auth/signin?registered=true")
    } catch (err) {
      setError("Error de conexión. Revisá tu internet.")
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
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Crear tu cuenta</h1>
          <p className="text-slate-500 font-medium mb-8">Empezá a recuperar tu tiempo hoy mismo.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl animate-in fade-in zoom-in-95">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
              <Input
                type="text"
                placeholder="Ej: Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-14 rounded-xl border-slate-200 focus:border-red-600 focus:ring-red-600 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email de Trabajo</label>
              <Input
                type="email"
                placeholder="vos@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 rounded-xl border-slate-200 focus:border-red-600 focus:ring-red-600 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña</label>
              <Input
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="h-14 rounded-xl border-slate-200 focus:border-red-600 focus:ring-red-600 bg-white"
              />
            </div>

            {referralCode && (
              <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                <p className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-1">CÓDIGO DE REFERIDO ACTIVO</p>
                <p className="text-xs text-green-600 font-bold">¡Vas a recibir créditos de regalo al entrar!</p>
              </div>
            )}

            <Button type="submit" className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-2xl shadow-lg shadow-red-100 transition-all mt-4" disabled={loading}>
              {loading ? "Preparando todo..." : "Registrarse Gratis"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            ¿Ya tenés cuenta?{" "}
            <Link href="/auth/signin" className="text-red-600 font-black hover:underline">
              Entrar
            </Link>
          </p>
        </div>

        <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
          <ShieldCheck className="h-48 w-48 text-slate-900" />
        </div>
      </Card>

      <div className="mt-12 flex items-center gap-6 opacity-30">
        <div className="h-[1px] w-12 bg-slate-300" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">100% Privado & Seguro</span>
        <div className="h-[1px] w-12 bg-slate-300" />
      </div>
    </div>
  )
}
