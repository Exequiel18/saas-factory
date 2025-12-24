"use client"

import { motion } from "framer-motion"
import { Sparkles, Heart, Target, CheckCircle2 } from "lucide-react"

export function SuenoPromesa() {
  return (
    <div className="relative py-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-amber-600/10 to-red-600/10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-amber-500/30 mb-8 shadow-lg">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">
              Algo Único en el Mercado
            </span>
          </div>
          
          <h2 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
            Te Cumplimos<br />
            <span className="bg-gradient-to-r from-red-600 via-amber-500 to-red-600 bg-clip-text text-transparent">
              Tu Sueño
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed">
            No vendemos cursos. No vendemos humo. Vendemos resultados reales.
            <span className="text-white font-bold"> Si me lo permitís, te ayudo a que tu negocio funcione solo.</span>
          </p>
        </motion.div>

        {/* Promesa Visual */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Heart,
              title: "Compromiso Real",
              desc: "No promesas vacías. Solo números que cierran.",
              color: "from-red-500 to-pink-500"
            },
            {
              icon: Target,
              title: "Resultados Concretos",
              desc: "Tu negocio funcionando solo, sin que te mates.",
              color: "from-amber-500 to-orange-500"
            },
            {
              icon: CheckCircle2,
              title: "Sin Chamuyo",
              desc: "La verdad que tu negocio necesita escuchar.",
              color: "from-green-500 to-emerald-500"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              <div className="bg-white/90 backdrop-blur-xl border-2 border-slate-200 rounded-3xl p-10 hover:border-red-300 hover:shadow-2xl transition-all h-full">
                <div className={`inline-flex p-5 bg-gradient-to-br ${item.color} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-white mb-4">{item.title}</h3>
                <p className="text-slate-300 text-lg leading-relaxed font-medium">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Carta Personal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="bg-gradient-to-br from-slate-900/90 via-black to-slate-900/90 text-white rounded-3xl p-12 md:p-16 relative overflow-hidden border border-white/10"
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />
            
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-3xl">🤝</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-1">Mi Promesa</h3>
                  <p className="text-slate-400 text-sm">Algo único en el mercado</p>
                </div>
              </div>
              
              <div className="space-y-6 text-lg leading-relaxed">
                <p className="text-xl font-semibold text-red-200">
                  "Si me lo permitís, te ayudo a cumplir el sueño de que tu negocio funcione solo."
                </p>
                
                <p className="text-slate-300">
                  No te voy a vender un curso. No te voy a prometer que vas a ganar millones. 
                  Te voy a decir la verdad sobre tus números y, si querés, te ayudo a ordenarlos.
                </p>
                
                <p className="text-slate-300">
                  Porque sé lo que es laburar solo. Sé lo que es matarse y que no te quede nada. 
                  Sé lo que es sentir que algo está mal pero no saber qué.
                </p>
                
                <p className="text-slate-200 font-semibold text-xl">
                  Por eso creé esto. Para darte la verdad. Sin chamuyo. Solo números que cierran.
                </p>
                
                <div className="pt-6 border-t border-white/10">
                  <p className="text-slate-400 italic text-base">
                    — Si me lo permitís, te ayudo a que funcione.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

