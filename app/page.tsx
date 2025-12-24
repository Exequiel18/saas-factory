"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  ArrowRight, Sparkles, Target, Zap, TrendingUp,
  CheckCircle2, Clock, Shield, Heart, Star
} from "lucide-react"
import { SuenoPromesa } from "@/components/sueno-promesa"
import { ConfianzaSeguridad } from "@/components/confianza-seguridad"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-amber-600/20 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:50px_50px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 bg-gradient-to-br from-red-600 to-amber-600 rounded-xl flex items-center justify-center shadow-2xl"
            >
              <span className="text-white font-black text-2xl">🤝</span>
            </motion.div>
            <span className="text-2xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Chequeo Real
            </span>
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/chequeo-real" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">
              Hacer Chequeo
            </Link>
            <Link href="/pricing" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">
              Planes
            </Link>
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm" className="font-bold text-white hover:bg-white/10">
                Login
              </Button>
            </Link>
            <Link href="/chequeo-real">
              <Button size="sm" className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-black shadow-2xl">
                Empezar
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-40 pb-32 px-6 relative">
        <div className="container mx-auto max-w-7xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-red-600/20 to-amber-600/20 border border-red-500/30 backdrop-blur-xl">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <span className="text-sm font-black uppercase tracking-widest text-amber-400">
                Algo Único en el Mercado
              </span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-16"
          >
            <h1 className="text-7xl md:text-9xl font-black mb-8 leading-[0.9] tracking-tight">
              <span className="block text-white">Si laburás</span>
              <span className="block bg-gradient-to-r from-red-600 via-amber-500 to-red-600 bg-clip-text text-transparent animate-gradient">
                solo,
              </span>
              <span className="block text-white mt-4">esto es</span>
              <span className="block bg-gradient-to-r from-amber-500 via-red-600 to-amber-500 bg-clip-text text-transparent">
                para vos
              </span>
            </h1>

            <p className="text-2xl md:text-3xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
              En 3 minutos te decimos si estás bien o solo te estás matando.
              <span className="text-white font-bold"> Sin humo, sin promesas.</span>
            </p>
            <p className="text-xl md:text-2xl text-amber-400 font-bold mb-6">
              Si me lo permitís, te ayudo a que funcione.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-2 text-slate-400 mb-16"
            >
              <Shield className="h-5 w-5 text-green-400" />
              <span className="font-semibold">100% seguro • Personas reales • Sin bots</span>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link href="/chequeo-real">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="h-20 px-16 text-xl font-black bg-gradient-to-r from-red-600 via-red-500 to-amber-600 hover:from-red-700 hover:via-red-600 hover:to-amber-700 text-white rounded-2xl shadow-2xl border-2 border-amber-500/30">
                    Hacer Chequeo Gratis
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="h-20 px-16 text-xl font-bold border-2 border-white/20 hover:border-white/40 rounded-2xl bg-white/5 backdrop-blur-sm">
                  Ver Planes
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-8 mt-16"
            >
              {[
                { icon: Clock, text: "3 minutos", color: "text-red-400" },
                { icon: Shield, text: "100% gratis", color: "text-green-400" },
                { icon: CheckCircle2, text: "Sin registro", color: "text-blue-400" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                  <span className="font-bold text-white">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Stats Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto mb-32"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 shadow-2xl">
              <div className="grid grid-cols-3 gap-12">
                {[
                  { number: "6", label: "Preguntas", color: "text-red-400" },
                  { number: "3 min", label: "Tiempo", color: "text-amber-400" },
                  { number: "100%", label: "Honesto", color: "text-green-400" }
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className={`text-6xl font-black mb-4 ${stat.color}`}>{stat.number}</div>
                    <div className="text-lg font-bold text-slate-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* How It Works */}
          <section className="mb-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  Cómo
                </span>
                <span className="block bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
                  Funciona
                </span>
              </h2>
              <p className="text-2xl text-slate-400 max-w-2xl mx-auto font-medium">
                Simple, directo, sin vueltas
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Respondés 6 preguntas",
                  desc: "Sobre tu negocio. Sin complicaciones. En 2 minutos.",
                  icon: Target,
                  gradient: "from-blue-500 to-cyan-500"
                },
                {
                  step: "02",
                  title: "Te decimos la verdad",
                  desc: "Sin humo. Sin promesas. Solo números que cierran o no.",
                  icon: TrendingUp,
                  gradient: "from-red-500 to-pink-500"
                },
                {
                  step: "03",
                  title: "Te ayudo a ordenarlo",
                  desc: "Si querés, te doy el diagnóstico completo y te ayudo a que funcione.",
                  icon: Zap,
                  gradient: "from-amber-500 to-orange-500"
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative"
                >
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 hover:border-amber-500/50 hover:bg-white/10 transition-all h-full">
                    <div className={`text-7xl font-black bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent mb-8`}>
                      {item.step}
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`p-5 bg-gradient-to-br ${item.gradient} rounded-2xl shadow-2xl group-hover:scale-110 transition-transform`}>
                        <item.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-black text-white">{item.title}</h3>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-lg font-medium">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Promesa Única */}
          <div className="mb-32">
            <SuenoPromesa />
          </div>

          {/* Confianza y Seguridad */}
          <div className="mb-32">
            <ConfianzaSeguridad />
          </div>

          {/* Features - Para Quién Es Esto */}
          <section className="mb-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  Para Quién
                </span>
                <span className="block bg-gradient-to-r from-amber-500 to-red-600 bg-clip-text text-transparent">
                  Es Esto
                </span>
              </h2>
              <p className="text-2xl text-slate-400 max-w-2xl mx-auto font-medium">
                Si laburás solo y los números no te dan, esto es para vos
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Electricistas",
                  desc: "Laburás solo, trabajás muchas horas, pero no te sobra plata al final del mes.",
                  emoji: "⚡"
                },
                {
                  title: "Fotógrafos",
                  desc: "Hacés trabajos, cobrás, pero los números no cierran como esperabas.",
                  emoji: "📸"
                },
                {
                  title: "Técnicos",
                  desc: "Laburás todo el día, pero al final no te queda nada. Algo está mal.",
                  emoji: "🔧"
                },
                {
                  title: "Freelancers",
                  desc: "Tenés clientes, facturás, pero no crecés. Los números no te dan.",
                  emoji: "💼"
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-amber-500/50 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-5xl group-hover:scale-110 transition-transform">{item.emoji}</div>
                    <div>
                      <h3 className="text-2xl font-black text-white mb-3">{item.title}</h3>
                      <p className="text-slate-300 leading-relaxed text-lg font-medium">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Final CTA */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-red-600 via-red-500 to-amber-600 text-white rounded-3xl p-16 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:64px_64px]" />
              <div className="relative z-10">
                <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">
                  ¿Listo para saber<br />
                  <span className="text-black">la verdad?</span>
                </h2>
                <p className="text-2xl text-red-50 mb-12 max-w-3xl mx-auto font-medium">
                  En 3 minutos te decimos si tu negocio está bien armado o solo te estás matando.
                </p>
                <Link href="/chequeo-real">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="lg" className="h-20 px-16 text-xl font-black bg-black text-white hover:bg-slate-900 rounded-2xl shadow-2xl border-2 border-white/20">
                      Hacer Chequeo Gratis
                      <ArrowRight className="ml-3 h-6 w-6" />
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/50 backdrop-blur-sm py-16 mt-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-amber-600 rounded-xl flex items-center justify-center shadow-2xl">
                  <span className="text-white font-black text-2xl">🤝</span>
                </div>
                <span className="text-2xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Chequeo Real
                </span>
              </div>
              <p className="text-slate-400 font-medium max-w-sm">
                La verdad que tu negocio necesita escuchar.
              </p>
            </div>
            <div className="flex gap-16">
              <div className="flex flex-col gap-3">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Producto</span>
                <Link href="/chequeo-real" className="text-sm text-slate-300 hover:text-white font-bold transition-colors">
                  Hacer Chequeo
                </Link>
                <Link href="/pricing" className="text-sm text-slate-300 hover:text-white font-bold transition-colors">
                  Planes
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Legal</span>
                <Link href="/legal/terms" className="text-sm text-slate-300 hover:text-white font-bold transition-colors">
                  Términos
                </Link>
                <Link href="/legal/privacy" className="text-sm text-slate-300 hover:text-white font-bold transition-colors">
                  Privacidad
                </Link>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-sm text-slate-500 font-bold">
            © 2025 Chequeo Real. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
