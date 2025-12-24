"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  ArrowRight, Sparkles, Target, Zap, TrendingUp,
  CheckCircle2, Clock, Shield, Heart, Star, 
  BarChart3, Users, Rocket, Award, TrendingDown
} from "lucide-react"
import { SuenoPromesa } from "@/components/sueno-promesa"
import { ConfianzaSeguridad } from "@/components/confianza-seguridad"

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 0.95])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background - Mejorado */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-black" />
        {/* Gradientes animados */}
        <motion.div 
          className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-red-600/30 rounded-full blur-[150px]"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-[900px] h-[900px] bg-amber-600/30 rounded-full blur-[150px]"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {/* Grid pattern más sutil */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:60px_60px]" />
        {/* Partículas flotantes */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation - Mejorado */}
      <motion.nav 
        className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/60 backdrop-blur-2xl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-14 h-14 bg-gradient-to-br from-red-600 via-red-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              <span className="text-white font-black text-2xl relative z-10">🤝</span>
            </motion.div>
            <div>
              <span className="text-2xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent block">
                Chequeo Real
              </span>
              <span className="text-xs text-amber-400 font-bold">Sin Chamuyo</span>
            </div>
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/chequeo-real" className="text-sm font-bold text-slate-300 hover:text-white transition-colors relative group">
              Hacer Chequeo
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="/pricing" className="text-sm font-bold text-slate-300 hover:text-white transition-colors relative group">
              Planes
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm" className="font-bold text-white hover:bg-white/10">
                Login
              </Button>
            </Link>
            <Link href="/chequeo-real">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm" className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-black shadow-2xl relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="relative z-10">Empezar</span>
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Ultra Mejorado */}
      <main className="pt-40 pb-32 px-6 relative">
        <div className="container mx-auto max-w-7xl">
          {/* Badge - Mejorado */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-12"
          >
            <motion.div 
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-red-600/30 via-amber-600/30 to-red-600/30 border-2 border-amber-500/40 backdrop-blur-xl relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <Sparkles className="h-6 w-6 text-amber-400 relative z-10" />
              <span className="text-sm font-black uppercase tracking-widest text-amber-400 relative z-10">
                Algo Único en el Mercado
              </span>
            </motion.div>
          </motion.div>

          {/* Main Headline - Ultra Mejorado */}
          <motion.div
            style={{ opacity, scale }}
            className="text-center mb-16"
          >
            <motion.h1 
              className="text-7xl md:text-9xl lg:text-[12rem] font-black mb-8 leading-[0.85] tracking-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <motion.span 
                className="block text-white"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Si laburás
              </motion.span>
              <motion.span 
                className="block bg-gradient-to-r from-red-600 via-amber-500 to-red-600 bg-clip-text text-transparent bg-[length:200%_100%]"
                animate={{
                  backgroundPosition: ['0%', '200%']
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                solo,
              </motion.span>
              <motion.span 
                className="block text-white mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                esto es
              </motion.span>
              <motion.span 
                className="block bg-gradient-to-r from-amber-500 via-red-600 to-amber-500 bg-clip-text text-transparent bg-[length:200%_100%]"
                animate={{
                  backgroundPosition: ['0%', '200%']
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                para vos
              </motion.span>
            </motion.h1>

            <motion.p 
              className="text-2xl md:text-4xl text-slate-300 mb-8 max-w-5xl mx-auto leading-relaxed font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              En <span className="text-white font-black">3 minutos</span> te decimos si estás bien o solo te estás matando.
              <br />
              <span className="text-white font-bold text-3xl"> Sin humo, sin promesas.</span>
            </motion.p>
            
            <motion.p 
              className="text-xl md:text-3xl text-amber-400 font-black mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Si me lo permitís, te ayudo a que funcione.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-center gap-3 text-slate-400 mb-16"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Shield className="h-6 w-6 text-green-400" />
              </motion.div>
              <span className="font-bold text-lg">100% seguro • Personas reales • Sin bots</span>
            </motion.div>

            {/* CTA - Ultra Mejorado */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link href="/chequeo-real">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-600 to-amber-600 rounded-2xl blur-xl opacity-50"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <Button size="lg" className="h-24 px-20 text-2xl font-black bg-gradient-to-r from-red-600 via-red-500 to-amber-600 hover:from-red-700 hover:via-red-600 hover:to-amber-700 text-white rounded-2xl shadow-2xl border-2 border-amber-500/50 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="relative z-10 flex items-center gap-3">
                      Hacer Chequeo Gratis
                      <ArrowRight className="h-7 w-7" />
                    </span>
                  </Button>
                </motion.div>
              </Link>
              <Link href="/pricing">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="h-24 px-20 text-2xl font-bold border-2 border-white/30 hover:border-white/60 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10">
                    Ver Planes
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Trust Indicators - Mejorado */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap justify-center gap-6 mt-20"
            >
              {[
                { icon: Clock, text: "3 minutos", color: "text-red-400", bg: "bg-red-500/10" },
                { icon: Shield, text: "100% gratis", color: "text-green-400", bg: "bg-green-500/10" },
                { icon: CheckCircle2, text: "Sin registro", color: "text-blue-400", bg: "bg-blue-500/10" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className={`flex items-center gap-3 ${item.bg} backdrop-blur-sm px-8 py-4 rounded-full border border-white/20`}
                >
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                  <span className="font-black text-white text-lg">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Stats Preview - Mejorado */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto mb-32"
          >
            <div className="bg-white/5 backdrop-blur-2xl border-2 border-white/10 rounded-3xl p-16 shadow-2xl relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-amber-600/10 to-red-600/10"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 10, repeat: Infinity }}
              />
              <div className="grid grid-cols-3 gap-16 relative z-10">
                {[
                  { number: "6", label: "Preguntas", color: "text-red-400", icon: Target },
                  { number: "3 min", label: "Tiempo", color: "text-amber-400", icon: Clock },
                  { number: "100%", label: "Honesto", color: "text-green-400", icon: CheckCircle2 }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="text-center"
                  >
                    <div className="flex justify-center mb-4">
                      <stat.icon className={`h-12 w-12 ${stat.color} mb-4`} />
                    </div>
                    <div className={`text-7xl font-black mb-4 ${stat.color}`}>{stat.number}</div>
                    <div className="text-xl font-bold text-slate-300">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* How It Works - Mejorado */}
          <section className="mb-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tight">
                <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent block">
                  Cómo
                </span>
                <span className="block bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
                  Funciona
                </span>
              </h2>
              <p className="text-3xl text-slate-400 max-w-3xl mx-auto font-medium">
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
                  gradient: "from-blue-500 to-cyan-500",
                  bgGradient: "from-blue-500/20 to-cyan-500/20"
                },
                {
                  step: "02",
                  title: "Te decimos la verdad",
                  desc: "Sin humo. Sin promesas. Solo números que cierran o no.",
                  icon: TrendingUp,
                  gradient: "from-red-500 to-pink-500",
                  bgGradient: "from-red-500/20 to-pink-500/20"
                },
                {
                  step: "03",
                  title: "Te ayudo a ordenarlo",
                  desc: "Si querés, te doy el diagnóstico completo y te ayudo a que funcione.",
                  icon: Zap,
                  gradient: "from-amber-500 to-orange-500",
                  bgGradient: "from-amber-500/20 to-orange-500/20"
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative"
                >
                  <div className={`bg-gradient-to-br ${item.bgGradient} backdrop-blur-xl border-2 border-white/10 rounded-3xl p-12 hover:border-amber-500/50 transition-all h-full relative overflow-hidden`}>
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10`}
                      transition={{ duration: 0.3 }}
                    />
                    <div className={`text-8xl font-black bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent mb-8 relative z-10`}>
                      {item.step}
                    </div>
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                      <motion.div 
                        className={`p-6 bg-gradient-to-br ${item.gradient} rounded-2xl shadow-2xl`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <item.icon className="h-10 w-10 text-white" />
                      </motion.div>
                      <h3 className="text-3xl font-black text-white">{item.title}</h3>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-xl font-medium relative z-10">{item.desc}</p>
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

          {/* Features - Para Quién Es Esto - Mejorado */}
          <section className="mb-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tight">
                <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent block">
                  Para Quién
                </span>
                <span className="block bg-gradient-to-r from-amber-500 to-red-600 bg-clip-text text-transparent">
                  Es Esto
                </span>
              </h2>
              <p className="text-3xl text-slate-400 max-w-3xl mx-auto font-medium">
                Si laburás solo y los números no te dan, esto es para vos
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Electricistas",
                  desc: "Laburás solo, trabajás muchas horas, pero no te sobra plata al final del mes.",
                  emoji: "⚡",
                  color: "from-yellow-500/20 to-yellow-600/20",
                  borderColor: "border-yellow-500/30"
                },
                {
                  title: "Fotógrafos",
                  desc: "Hacés trabajos, cobrás, pero los números no cierran como esperabas.",
                  emoji: "📸",
                  color: "from-purple-500/20 to-purple-600/20",
                  borderColor: "border-purple-500/30"
                },
                {
                  title: "Técnicos",
                  desc: "Laburás todo el día, pero al final no te queda nada. Algo está mal.",
                  emoji: "🔧",
                  color: "from-blue-500/20 to-blue-600/20",
                  borderColor: "border-blue-500/30"
                },
                {
                  title: "Freelancers",
                  desc: "Tenés clientes, facturás, pero no crecés. Los números no te dan.",
                  emoji: "💼",
                  color: "from-green-500/20 to-green-600/20",
                  borderColor: "border-green-500/30"
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className={`bg-gradient-to-br ${item.color} backdrop-blur-xl border-2 ${item.borderColor} rounded-3xl p-10 hover:border-amber-500/50 transition-all group relative overflow-hidden`}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-amber-500/0 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="flex items-start gap-6 relative z-10">
                    <motion.div 
                      className="text-6xl"
                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      {item.emoji}
                    </motion.div>
                    <div>
                      <h3 className="text-3xl font-black text-white mb-4">{item.title}</h3>
                      <p className="text-slate-300 leading-relaxed text-xl font-medium">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Final CTA - Ultra Mejorado */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-red-600 via-red-500 to-amber-600 text-white rounded-3xl p-20 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:64px_64px]"
                animate={{ x: [0, 64], y: [0, 64] }}
                transition={{ duration: 20, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              <div className="relative z-10">
                <h2 className="text-6xl md:text-8xl lg:text-9xl font-black mb-10 tracking-tight">
                  ¿Listo para saber<br />
                  <span className="text-black drop-shadow-2xl">la verdad?</span>
                </h2>
                <p className="text-3xl text-red-50 mb-16 max-w-4xl mx-auto font-medium">
                  En 3 minutos te decimos si tu negocio está bien armado o solo te estás matando.
                </p>
                <Link href="/chequeo-real">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block"
                  >
                    <Button size="lg" className="h-24 px-20 text-2xl font-black bg-black text-white hover:bg-slate-900 rounded-2xl shadow-2xl border-4 border-white/30 relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="relative z-10 flex items-center gap-3">
                        Hacer Chequeo Gratis
                        <ArrowRight className="h-7 w-7" />
                      </span>
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Footer - Mejorado */}
      <footer className="border-t border-white/10 bg-black/80 backdrop-blur-xl py-20 mt-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-white font-black text-2xl">🤝</span>
                </div>
                <div>
                  <span className="text-2xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent block">
                    Chequeo Real
                  </span>
                  <span className="text-xs text-amber-400 font-bold">Sin Chamuyo</span>
                </div>
              </div>
              <p className="text-slate-400 font-medium max-w-sm text-lg">
                La verdad que tu negocio necesita escuchar.
              </p>
            </div>
            <div className="flex gap-16">
              <div className="flex flex-col gap-4">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Producto</span>
                <Link href="/chequeo-real" className="text-sm text-slate-300 hover:text-white font-bold transition-colors">
                  Hacer Chequeo
                </Link>
                <Link href="/pricing" className="text-sm text-slate-300 hover:text-white font-bold transition-colors">
                  Planes
                </Link>
              </div>
              <div className="flex flex-col gap-4">
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
