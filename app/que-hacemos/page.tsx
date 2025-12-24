"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Zap } from "lucide-react"

export default function QueHacemosPage() {
    const solutions = [
        {
            id: "docentes",
            title: "Soy Docente",
            desc: "Dejá de llevarte laburo a casa los domingos. Te armamos clases y rúbricas en minutos.",
            icon: "🍎",
            href: "/regalo-mama",
            status: "LISTO"
        },
        {
            id: "comercio",
            title: "Tengo un Comercio",
            desc: "Dejá de enterrar plata en stock que no se mueve. Te decimos qué comprar y qué no.",
            icon: "🏪",
            href: "/comercio",
            status: "LISTO"
        },
        {
            id: "ceo",
            title: "Soy Director o Dueño",
            desc: "Dejá de perseguir planillas. Te damos la visión clara de tu negocio en 1 minuto.",
            icon: "📈",
            href: "/ceo-assistant",
            status: "LISTO"
        },
        {
            id: "salud",
            title: "Sector Salud",
            desc: "Dejá de leer carpetas infinitas. Te damos el resumen clave del paciente en segundos.",
            icon: "🩺",
            href: "/medico",
            status: "LISTO"
        }
    ]

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 py-24 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-bold mb-6">
                        <Zap className="h-3 w-3 fill-current" /> SIMPLE & HUMANO
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900">
                        ¿A qué te <span className="text-red-600">dedicás</span>?
                    </h1>
                    <p className="text-lg text-slate-500 max-w-xl mx-auto">
                        No adaptamos tu negocio a la tecnología. Adaptamos la tecnología a lo que hacés todos los días.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {solutions.map((sol) => (
                        <a key={sol.id} href={sol.href} className="block group no-underline">
                            <Card className={`p-8 h-full transition-all flex flex-col cursor-pointer rounded-[2rem] border-2 ${sol.status === 'LISTO' ? 'border-slate-100 hover:border-red-500/30 hover:shadow-xl' : 'border-slate-50 opacity-60 pointer-events-none'}`}>
                                <div className="mb-6 text-4xl bg-slate-100 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
                                    {sol.icon}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-slate-900">{sol.title}</h3>
                                        {sol.status !== 'LISTO' && (
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-500">
                                                {sol.status}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                                        {sol.desc}
                                    </p>
                                </div>
                                {sol.status === 'LISTO' && (
                                    <div className="flex items-center font-bold text-sm text-red-600 group-hover:translate-x-2 transition-transform">
                                        Probar ahora <ChevronRight className="h-4 w-4 ml-1" />
                                    </div>
                                )}
                            </Card>
                        </a>
                    ))}
                </div>

                {/* Support Section */}
                <div className="mt-20 p-10 rounded-[2.5rem] bg-slate-900 text-white text-center relative overflow-hidden">
                    <h2 className="text-2xl font-bold mb-4 italic">&quot;No te vendo espejitos de colores.&quot;</h2>
                    <p className="text-slate-400 mb-8 max-w-lg mx-auto text-sm">
                        Si tu nicho no está acá, escribinos. Diseñamos soluciones que de verdad sacan laburo de encima.
                    </p>
                    <Button className="bg-white text-slate-950 hover:bg-slate-200 font-bold px-8 h-12 rounded-full">
                        Contactar por WhatsApp
                    </Button>
                </div>

                <div className="mt-12 text-center text-xs text-slate-400 font-medium">
                    Hecho con ❤️ para gente que labura.
                </div>
            </div>
        </div>
    )
}
