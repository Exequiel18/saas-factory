"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle2, ArrowRight, Clock, Shield, 
  TrendingUp, Users, Zap, AlertTriangle
} from "lucide-react"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b bg-white/80 backdrop-blur-lg">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-lg">🤝</span>
            </div>
            <span className="text-xl font-black text-slate-900">
              Chequeo Real
            </span>
          </Link>
          <div className="hidden md:flex gap-6 items-center">
            <Link href="/chequeo-real" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Hacer Chequeo
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Planes
            </Link>
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/chequeo-real">
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                Empezar
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-100 border-2 border-amber-400 text-amber-800 text-sm font-black uppercase tracking-widest mb-8 shadow-lg"
            >
              <span className="text-xl">🤝</span> Sin Chamuyo, Solo Números que Cierran
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-tight"
            >
              Si laburás solo,<br />
              <span className="text-red-600">esto es para vos</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              En 3 minutos te decimos si estás bien o solo te estás matando.
              <span className="text-slate-900 font-semibold"> Sin humo, sin promesas.</span> Si me lo permitís, te ayudo a que funcione.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/chequeo-real">
                <Button size="lg" className="h-14 px-10 text-lg font-black bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
                  Hacer Chequeo Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold border-2 border-slate-300 hover:border-slate-400 rounded-xl">
                  Ver Planes
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-slate-500"
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>3 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>100% gratis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Sin registro</span>
              </div>
            </motion.div>
          </div>

          {/* How It Works */}
          <section className="mt-32 mb-20">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 text-center mb-12">
              Cómo Funciona
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Respondés 6 preguntas",
                  desc: "Sobre tu negocio. Sin complicaciones. En 2 minutos.",
                  icon: CheckCircle2
                },
                {
                  step: "02",
                  title: "Te decimos la verdad",
                  desc: "Sin humo. Sin promesas. Solo números que cierran o no.",
                  icon: AlertTriangle
                },
                {
                  step: "03",
                  title: "Te ayudo a ordenarlo",
                  desc: "Si querés, te doy el diagnóstico completo y te ayudo a que funcione.",
                  icon: Zap
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="bg-white border-2 border-slate-200 rounded-2xl p-8 hover:border-red-300 hover:shadow-lg transition-all"
                >
                  <div className="text-4xl font-black text-red-600 mb-4">{item.step}</div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <item.icon className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Social Proof */}
          <section className="mt-20 mb-20 bg-slate-900 text-white rounded-3xl p-12 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="text-5xl mb-6">🤝</div>
              <h3 className="text-3xl font-black mb-4">
                "Si me lo permitís, te ayudo a cumplir el sueño"
              </h3>
              <p className="text-xl text-slate-300 mb-6">
                de que tu negocio funcione solo
              </p>
              <p className="text-sm text-slate-400 italic">
                — Sin chamuyo, solo números que cierran
              </p>
            </motion.div>
          </section>

          {/* Features */}
          <section className="mt-20">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 text-center mb-12">
              Para Quién Es Esto
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Electricistas",
                  desc: "Laburás solo, trabajás muchas horas, pero no te sobra plata al final del mes."
                },
                {
                  title: "Fotógrafos",
                  desc: "Hacés trabajos, cobrás, pero los números no cierran como esperabas."
                },
                {
                  title: "Técnicos",
                  desc: "Laburás todo el día, pero al final no te queda nada. Algo está mal."
                },
                {
                  title: "Freelancers",
                  desc: "Tenés clientes, facturás, pero no crecés. Los números no te dan."
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  className="bg-white border border-slate-200 rounded-xl p-6 hover:border-red-300 hover:shadow-md transition-all"
                >
                  <h3 className="text-lg font-black text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Final CTA */}
          <section className="mt-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-3xl p-12"
            >
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                ¿Listo para saber la verdad?
              </h2>
              <p className="text-xl text-red-100 mb-8">
                En 3 minutos te decimos si tu negocio está bien armado o solo te estás matando.
              </p>
              <Link href="/chequeo-real">
                <Button size="lg" className="h-14 px-10 text-lg font-black bg-white text-red-600 hover:bg-slate-100 rounded-xl">
                  Hacer Chequeo Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-slate-50 py-12 mt-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-lg">🤝</span>
                </div>
                <span className="text-xl font-black text-slate-900">Chequeo Real</span>
              </div>
              <p className="text-sm text-slate-600">
                La verdad que tu negocio necesita escuchar.
              </p>
            </div>
            <div className="flex gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Producto</span>
                <Link href="/chequeo-real" className="text-sm text-slate-600 hover:text-slate-900">
                  Hacer Chequeo
                </Link>
                <Link href="/pricing" className="text-sm text-slate-600 hover:text-slate-900">
                  Planes
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Legal</span>
                <Link href="/legal/terms" className="text-sm text-slate-600 hover:text-slate-900">
                  Términos
                </Link>
                <Link href="/legal/privacy" className="text-sm text-slate-600 hover:text-slate-900">
                  Privacidad
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-slate-500">
            © 2025 Chequeo Real. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
