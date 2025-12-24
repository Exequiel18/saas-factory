"use client"

import { motion } from "framer-motion"
import { Shield, Lock, CheckCircle2, Users, Heart, Award, Phone, Mail } from "lucide-react"

export function ConfianzaSeguridad() {
  return (
    <div className="relative py-20 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              No Somos
            </span>
            <span className="block bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
              una Página Bot
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-medium">
            Hay personas reales detrás de esto. Te mostramos quiénes somos y por qué podés confiar.
          </p>
        </motion.div>

        {/* Elementos de Confianza */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Users,
              title: "Personas Reales",
              desc: "No somos una IA. Somos emprendedores que entendemos tu situación porque la vivimos.",
              color: "from-blue-500 to-cyan-500"
            },
            {
              icon: Shield,
              title: "100% Seguro",
              desc: "Tus datos están protegidos. No vendemos información. No compartimos nada.",
              color: "from-green-500 to-emerald-500"
            },
            {
              icon: Lock,
              title: "Pago Seguro",
              desc: "Usamos Mercado Pago. Tus pagos están protegidos. Podés confiar.",
              color: "from-purple-500 to-pink-500"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-amber-500/50 hover:bg-white/10 transition-all"
            >
              <div className={`inline-flex p-4 bg-gradient-to-br ${item.color} rounded-2xl mb-6 shadow-lg`}>
                <item.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4">{item.title}</h3>
              <p className="text-slate-300 leading-relaxed text-lg font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Quiénes Somos */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 mb-16"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-white mb-1">Quiénes Somos</h3>
              <p className="text-slate-400">Personas reales, no bots</p>
            </div>
          </div>
          
          <div className="space-y-6 text-lg leading-relaxed text-slate-300">
            <p>
              Somos emprendedores que laburamos solos. Sabemos lo que es matarse y que no te quede nada al final del mes.
              Sabemos lo que es sentir que algo está mal pero no saber qué.
            </p>
            <p>
              <span className="text-white font-bold">No vendemos cursos.</span> No vendemos humo. Vendemos la verdad sobre tus números.
            </p>
            <p>
              Por eso creamos esto. Para darte la verdad. Sin chamuyo. Solo números que cierran.
            </p>
            <div className="pt-6 border-t border-white/10">
              <p className="text-amber-400 font-bold text-xl">
                Si me lo permitís, te ayudo a que funcione.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Garantías */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {[
            {
              icon: CheckCircle2,
              title: "Sin Compromiso",
              desc: "El chequeo es gratis. No te pedimos tarjeta. No hay trucos.",
              color: "text-green-400"
            },
            {
              icon: Award,
              title: "Resultados Reales",
              desc: "No prometemos millones. Prometemos la verdad sobre tus números.",
              color: "text-amber-400"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
            >
              <div className="flex items-start gap-4">
                <item.icon className={`h-8 w-8 ${item.color} flex-shrink-0`} />
                <div>
                  <h4 className="text-xl font-black text-white mb-2">{item.title}</h4>
                  <p className="text-slate-300 font-medium">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contacto */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-red-600/20 to-amber-600/20 border border-red-500/30 rounded-3xl p-12 text-center"
        >
          <h3 className="text-3xl font-black text-white mb-6">¿Tenés Dudas?</h3>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Somos personas reales. Si tenés alguna pregunta, escribinos. Te respondemos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-xl border border-white/20">
              <Mail className="h-5 w-5 text-amber-400" />
              <span className="text-white font-bold">hola@chequeoreal.com</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-xl border border-white/20">
              <Phone className="h-5 w-5 text-amber-400" />
              <span className="text-white font-bold">Contacto directo</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

