"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Zap, Activity, DollarSign, Globe, ShieldCheck, Cpu } from "lucide-react"

export default function SovereignWarRoom() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/metrics/sovereign")
            .then((res) => res.json())
            .then((data) => {
                setData(data)
                setLoading(false)
            })
            .catch((err) => console.error(err))
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="space-y-4 text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
                    />
                    <p className="text-blue-400 font-mono tracking-[0.3em] text-sm">ENCRYPTING NEURAL LINK...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#020202] text-white p-6 md:p-12 font-sans selection:bg-purple-500/30 overflow-x-hidden">
            {/* Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
            </div>

            <header className="relative z-10 mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-sm flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                            <Cpu size={18} className="text-black" />
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter text-white">
                            ANTIGRAVITY <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">SOVEREIGN</span>
                        </h1>
                    </div>
                    <p className="text-gray-500 tracking-[0.2em] text-[10px] uppercase font-bold ml-11">Autonomous Empire Control Unit v1.0</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-4"
                >
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-gray-500 font-mono">CONNECTION STRENGTH</span>
                        <div className="flex gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className={`h-3 w-1.5 rounded-full ${i <= 4 ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-gray-800'}`} />)}
                        </div>
                    </div>
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/5 px-6 py-3 text-sm rounded-full backdrop-blur-md">
                        <Activity size={14} className="mr-2 animate-pulse" />
                        SYSTEM: {data.forestStatus}
                    </Badge>
                </motion.div>
            </header>

            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 relative z-10">
                {[
                    { label: "EMPIRE REVENUE", value: `$${data.totalEmpireRevenue.toLocaleString()}`, sub: "ARS TOTAL", icon: <DollarSign className="text-green-400" />, color: "from-green-500/20" },
                    { label: "CASH VELOCITY", value: `+$${data.dailyVelocity.toLocaleString()}`, sub: "ARS / 24H", icon: <Zap className="text-blue-400" />, color: "from-blue-500/20" },
                    { label: "ACTIVE NODES", value: Object.keys(data.revenueByNiche).length, sub: "SOVEREIGN NICHES", icon: <Globe className="text-purple-400" />, color: "from-purple-500/20" }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -5 }}
                    >
                        <Card className={`bg-[#0A0A0A]/80 border-white/5 backdrop-blur-xl rounded-2xl overflow-hidden relative group`}>
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                            <CardHeader className="relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    {stat.icon}
                                </div>
                                <CardDescription className="text-gray-500 font-mono text-[10px] tracking-widest">{stat.label}</CardDescription>
                                <CardTitle className="text-5xl font-black tracking-tight text-white mt-1">
                                    {stat.value}
                                </CardTitle>
                                <p className="text-xs text-gray-600 mt-2 font-bold tracking-widest">{stat.sub}</p>
                            </CardHeader>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                {/* Niche Dominance Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-6 w-1.5 bg-blue-500 rounded-full" />
                        <h2 className="text-2xl font-bold tracking-tight">NICHE DOMINANCE</h2>
                    </div>
                    <div className="grid gap-4">
                        {Object.entries(data.revenueByNiche).map(([niche, revenue]: [string, any], i) => (
                            <motion.div
                                key={niche}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 + (i * 0.1) }}
                                className="group bg-[#0D0D0D] p-1 rounded-2xl border border-white/5 transition-all hover:border-blue-500/30"
                            >
                                <div className="p-5 flex justify-between items-center bg-[#070707] rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-xl font-black text-blue-400">
                                            {niche[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold capitalize text-white group-hover:text-blue-400 transition-colors">{niche.replace('-', ' ')}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Node Operational</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-black text-white">${revenue.toLocaleString()}</span>
                                        <div className="w-32 h-1.5 bg-gray-900 rounded-full mt-2 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(revenue / data.totalEmpireRevenue * 100)}%` }}
                                                className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Neural Traffic Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-6 w-1.5 bg-purple-500 rounded-full" />
                        <h2 className="text-2xl font-bold tracking-tight">NEURAL FLOW ANALYTICS</h2>
                    </div>
                    <div className="bg-[#0D0D0D] rounded-2xl border border-white/5 overflow-hidden backdrop-blur-md">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/[0.02] border-b border-white/5">
                                    <th className="px-6 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Niche Relay</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status Pulse</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Volume</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                <AnimatePresence>
                                    {data.leadsByNiche.map((l: any, idx: number) => (
                                        <motion.tr
                                            key={idx}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-white/[0.02] transition-colors group"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                                                    <span className="font-bold text-gray-300 capitalize text-sm">{l.niche || 'Empire Core'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`text-[10px] px-3 py-1 rounded-full uppercase font-black tracking-widest ${l.status === 'converted' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                    l.status === 'contacted' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                        l.status === 'ready_for_outreach' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                                            'bg-gray-500/10 text-gray-500 border border-white/5'
                                                    }`}>
                                                    {l.status.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <span className="font-mono text-gray-200 font-bold group-hover:text-purple-400 transition-colors">{l._count._all}</span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                        <div className="p-6 bg-white/[0.01] flex justify-between items-center">
                            <div className="flex gap-1">
                                {[1, 2, 3].map(i => <div key={i} className="w-4 h-1 bg-blue-500/50 rounded-full" />)}
                            </div>
                            <p className="text-[10px] text-gray-600 font-mono">NEURAL SYNC STABLE</p>
                        </div>
                    </div>
                </motion.section>
            </div>

            <footer className="mt-32 border-t border-white/5 pt-12 text-center relative z-10">
                <div className="flex justify-center gap-12 text-gray-600 mb-8">
                    <div className="flex items-center gap-2"><ShieldCheck size={14} /> <span className="text-[10px] uppercase font-bold tracking-widest">Sovereign Encryption</span></div>
                    <div className="flex items-center gap-2"><Activity size={14} /> <span className="text-[10px] uppercase font-bold tracking-widest">Real-time Pulse</span></div>
                </div>
                <p className="text-gray-800 text-[10px] font-black uppercase tracking-[0.5em]">Antigravity Autonomous Conglomerate © 2025</p>
            </footer>
        </div>
    )
}
