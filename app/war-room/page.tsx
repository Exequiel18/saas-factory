"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Target, Users, TrendingUp, Shield, ArrowUpRight, Play, CheckCircle2, Clock, Terminal, Briefcase, DollarSign, Globe } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export default function WarRoomPage() {
    const { data: session } = useSession()
    const [stats, setStats] = useState({
        leads: 0,
        conversions: 0,
        netWorth: 0,
        activeNiches: 0,
        health: 99.8,
        conversionRate: 0,
        totalRevenue: 0
    })

    const [activeNiche, setActiveNiche] = useState('default')
    const [niches, setNiches] = useState([
        { id: 'default', name: 'Empire Core' }
    ])

    const [logs, setLogs] = useState<any>({ governor: '', prospector: '', evaluator: '', thoughts: [] })

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch(`/api/war-room/status?nicheId=${activeNiche}`)
                const data = await res.json()

                // Merge default niches with spawned ones dynamically
                if (data.spawnedNiches && Array.isArray(data.spawnedNiches)) {
                    setNiches(prev => {
                        const baseNiches = [{ id: 'default', name: 'Empire Core' }];
                        const currentIds = new Set(baseNiches.map(n => n.id));
                        const newNiches = data.spawnedNiches
                            .filter((n: string) => !currentIds.has(n))
                            .map((n: string) => ({ id: n, name: n.replace(/-/g, ' ').toUpperCase() }));
                        return [...baseNiches, ...newNiches];
                    });
                }

                setStats((prev: any) => ({
                    ...prev,
                    governor: data.governor || 'Offline',
                    prospector: data.prospector || 'Offline',
                    evaluator: data.evaluator || 'Offline',
                    thoughts: data.thought ? [data.thought, ...(prev.thoughts || [])].slice(0, 5) : prev.thoughts,
                    netWorth: data.metrics?.totalRevenue || 0,
                    leads: data.metrics?.leads || 0,
                    conversions: data.metrics?.conversions || 0,
                    conversionRate: data.metrics?.conversionRate || 0,
                    totalRevenue: data.metrics?.revenue || 0,
                    activeNiches: (data.spawnedNiches?.length || 0) + 1
                }));

                setLogs((prev: any) => ({
                    ...prev,
                    governor: data.governor,
                    prospector: data.prospector,
                    evaluator: data.evaluator,
                    thoughts: data.thought ? [...(prev.thoughts || []), data.thought].slice(-10) : prev.thoughts
                }));
            } catch (e) {
                console.error("Error fetching agent status")
            }
        }

        fetchStatus()
        const interval = setInterval(fetchStatus, 3000)
        return () => clearInterval(interval)
    }, [activeNiche])

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans pb-20 selection:bg-red-500/30 overflow-hidden relative">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
            </div>

            <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-2xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-red-600 to-red-900 p-2 rounded-lg shadow-lg shadow-red-950/40">
                            <Zap className="h-5 w-5 text-white fill-current" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black tracking-[0.2em] uppercase">Antigravity Hub</span>
                            <span className="text-[10px] text-red-500 font-bold tracking-widest uppercase">Autonomous Empire</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Neural Link Active</span>
                        </div>
                        <div className="h-8 w-[1px] bg-white/10" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">v2.0 Elite</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto pt-32 px-8 relative z-10">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1"
                    >
                        <h1 className="text-7xl font-black tracking-tighter mb-4 bg-gradient-to-r from-white via-white to-white/20 bg-clip-text text-transparent italic uppercase">
                            War Room
                        </h1>
                        <p className="text-lg text-white/40 font-medium tracking-wide max-w-xl">
                            El cerebro del imperio operando en tiempo real. Decisiones autónomas, riqueza líquida y expansión industrial sin precedentes.
                        </p>
                    </motion.div>

                    <div className="flex flex-wrap gap-2 bg-white/5 p-2 rounded-2xl backdrop-blur-xl border border-white/10">
                        {niches.map(n => (
                            <button
                                key={n.id}
                                onClick={() => setActiveNiche(n.id)}
                                className={`px-5 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${activeNiche === n.id
                                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/40 translate-y-[-2px]'
                                    : 'text-white/40 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {n.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {[
                        { label: activeNiche === 'default' ? "Net Worth Global" : "Revenue Nicho", value: `$${(activeNiche === 'default' ? stats.netWorth : stats.totalRevenue).toLocaleString()}`, detail: "Caja Real", icon: DollarSign, color: "text-green-500" },
                        { label: "Leads Activos", value: stats.leads, detail: "Discovery Real", icon: Target, color: "text-red-500" },
                        { label: "Conversión", value: `${stats.conversionRate}%`, detail: "Efficiency Loop", icon: TrendingUp, color: "text-blue-500" },
                        { label: "Nodos Activos", value: stats.activeNiches, detail: "Escala Multi-Nicho", icon: Globe, color: "text-purple-500" }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group p-8 border border-white/5 rounded-3xl bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.07] hover:border-white/20 transition-all cursor-default"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{stat.label}</p>
                                <stat.icon className={`h-4 w-4 ${stat.color} opacity-50`} />
                            </div>
                            <h2 className="text-4xl font-black tracking-tight mb-2 uppercase">{stat.value}</h2>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">{stat.detail}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Neural Sentiment Map (NUEVO) */}
                        <div className="p-8 rounded-3xl bg-black border border-white/5 relative overflow-hidden h-[200px] flex flex-col justify-end">
                            <div className="absolute inset-0 bg-gradient-to-t from-red-600/10 to-transparent" />
                            <div className="flex justify-between items-end gap-2 px-4 mb-4">
                                {niches.map((n, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 flex-1">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${Math.random() * 100 + 20}px` }}
                                            className="w-full bg-red-600/40 rounded-t-lg relative"
                                        >
                                            <div className="absolute top-[-20px] left-0 w-full text-center text-[8px] font-black uppercase text-red-500">
                                                {Math.floor(Math.random() * 100)}%
                                            </div>
                                        </motion.div>
                                        <span className="text-[8px] font-black uppercase text-white/20">{n.name}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="absolute top-8 left-8">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2 text-white/40">
                                    <TrendingUp className="h-3 w-3" /> Neural Market Momentum
                                </h3>
                            </div>
                        </div>

                        {/* Stream of Thought */}
                        <div className="p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8">
                                <Zap className="h-32 w-32 text-red-600/5 rotate-12" />
                            </div>
                            <h3 className="text-xs font-black mb-8 uppercase tracking-[0.3em] flex items-center gap-3 text-red-500/80">
                                <Terminal className="h-4 w-4" /> Intuición del Sistema (Live Feed)
                            </h3>
                            <div className="space-y-4 min-h-[300px]">
                                <AnimatePresence mode='popLayout'>
                                    {logs.thoughts?.map((thought: any, i: number) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5"
                                        >
                                            <div className="h-2 w-2 rounded-full bg-red-600 mt-1 shrink-0" />
                                            <p className="text-sm font-medium text-white/70 leading-relaxed italic">{thought}</p>
                                        </motion.div>
                                    )).reverse()}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Logs Multi-Agent */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 border border-white/5 rounded-3xl bg-black/40 backdrop-blur-xl">
                                <h3 className="text-[10px] font-black mb-6 uppercase tracking-[0.3em] flex items-center gap-2 text-white/30">
                                    <div className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" /> Casting Outbound
                                </h3>
                                <div className="space-y-4 font-mono text-[10px] uppercase tracking-tighter text-white/50 max-h-[300px] overflow-y-auto custom-scrollbar">
                                    {logs.prospector || "Escaneando marcas..."}
                                </div>
                            </div>
                            <div className="p-8 border border-white/5 rounded-3xl bg-black/40 backdrop-blur-xl">
                                <h3 className="text-[10px] font-black mb-6 uppercase tracking-[0.3em] flex items-center gap-2 text-white/30">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-600" /> B2B Qualification
                                </h3>
                                <div className="space-y-4 font-mono text-[10px] uppercase tracking-tighter text-white/50 max-h-[300px] overflow-y-auto custom-scrollbar">
                                    {logs.evaluator || "Analizando leads..."}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="p-10 border border-white/10 bg-gradient-to-b from-white/[0.08] to-transparent rounded-[40px] shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            <h3 className="text-xs font-black mb-10 uppercase tracking-[0.4em] text-white/40">Riqueza Líquida</h3>
                            <div className="flex items-end gap-2 mb-10">
                                <span className="text-6xl font-black tracking-tighter italic">${stats.netWorth.toLocaleString()}</span>
                                <span className="text-sm font-black text-green-500 mb-2 uppercase">Net</span>
                            </div>
                            <div className="h-2 bg-white/5 mb-8 overflow-hidden rounded-full p-[1px]">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "85%" }}
                                    className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full"
                                />
                            </div>
                            <p className="text-[10px] text-white/30 font-bold leading-relaxed mb-10 uppercase tracking-[0.15em]">
                                El sistema está operando al 85% de su capacidad de reinversión. Cada cierre real aumenta la potencia del imperio galáctico.
                            </p>
                            <Button className="w-full bg-white text-black hover:bg-white/90 hover:scale-[1.02] text-[11px] font-black uppercase tracking-widest h-16 rounded-2xl shadow-2xl transition-all flex gap-3 group">
                                Abrir Link de Pago Real <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Button>
                        </div>

                        <Card className="p-8 bg-white/5 border-white/10 rounded-3xl border-dashed">
                            <h4 className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em] mb-4 text-center italic">Self-Funding Pulse</h4>
                            <div className="flex justify-center gap-1 h-8 items-end">
                                {[0.4, 0.7, 0.5, 0.9, 0.4, 0.6, 0.8, 0.3, 0.5].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: `${h * 100}%` }}
                                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.1, ease: "easeInOut" }}
                                        className="w-2 bg-red-600/30 rounded-t-sm"
                                    />
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </main>

            <footer className="mt-40 text-center opacity-20 py-20">
                <p className="text-[10px] font-black uppercase tracking-[1em]">Antigravity Intelligence Systems • 2025</p>
            </footer>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    )
}
