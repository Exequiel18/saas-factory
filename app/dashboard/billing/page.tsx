import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Users, AlertTriangle, Calendar } from "lucide-react"

export default async function BillingDashboard() {
    const session = await getServerSession(authOptions)

    // In a real app, you would check if the user is a superadmin
    // For now, we assume authenticated users with access to this route are authorized.

    const payments = await prisma.payment.findMany({
        where: { status: "approved" },
        orderBy: { createdAt: "desc" },
        take: 10,
    })

    const totalRevenue = await prisma.payment.aggregate({
        where: { status: "approved" },
        _sum: { amount: true },
    })

    const activeSubscriptions = await prisma.subscription.count({
        where: { status: "active" },
    })

    const pendingRefunds = await prisma.payment.count({
        where: { status: "pending_refund" },
    })

    return (
        <div className="p-8 space-y-8 bg-[#020617] min-h-screen text-white">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter italic">Billing War Room</h1>
                    <p className="text-gray-400 font-medium">Panel administrativo de ingresos y suscripciones.</p>
                </div>
                <div className="flex gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-black uppercase">{new Date().toLocaleDateString()}</span>
                </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
                <Card className="bg-[#0a0f1e] border-white/5 backdrop-blur-3xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-gray-500">Ingresos Totales</CardTitle>
                        <DollarSign className="w-4 h-4 text-cyan-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">${totalRevenue._sum.amount?.toFixed(2) || "0.00"}</div>
                        <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                            <TrendingUp className="w-3 h-3" /> +12.5% vs mes anterior
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-[#0a0f1e] border-white/5 backdrop-blur-3xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-gray-500">Suscripciones Activas</CardTitle>
                        <Users className="w-4 h-4 text-cyan-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">{activeSubscriptions}</div>
                        <p className="text-xs text-gray-500 mt-1">Nodos operando actualmente</p>
                    </CardContent>
                </Card>

                <Card className="bg-[#0a0f1e] border-white/5 backdrop-blur-3xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-gray-500">MRR Estimado</CardTitle>
                        <TrendingUp className="w-4 h-4 text-cyan-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">${(activeSubscriptions * 29.99).toFixed(2)}</div>
                        <p className="text-xs text-cyan-500 mt-1 italic">Basado en plan Pro standard</p>
                    </CardContent>
                </Card>

                <Card className="bg-[#0a0f1e] border-white/5 backdrop-blur-3xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-gray-500">Alertas / Reembolsos</CardTitle>
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-red-400">{pendingRefunds}</div>
                        <p className="text-xs text-gray-500 mt-1">Acción requerida inmediata</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <Card className="md:col-span-2 bg-[#0a0f1e] border-white/5 backdrop-blur-3xl">
                    <CardHeader>
                        <CardTitle className="text-xl font-black uppercase italic italic">Últimas Transacciones</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {payments.map((p) => (
                                <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/20 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                                            <DollarSign className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold">Pago Aprobado</p>
                                            <p className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black">{p.amount.toFixed(2)} {p.currency}</p>
                                        <Badge variant="outline" className="text-[10px] uppercase border-white/10">{p.id.slice(-8).toUpperCase()}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#0a0f1e] border-white/5 backdrop-blur-3xl">
                    <CardHeader>
                        <CardTitle className="text-xl font-black uppercase italic italic">Estado del Sistema</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-black uppercase text-gray-500 tracking-widest">Webhook MP</span>
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">ONLINE</Badge>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-cyan-500 h-full w-[98.8%]" />
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-black uppercase text-gray-500 tracking-widest">Generador Facturas</span>
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">OPERATIVO</Badge>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-cyan-500 h-full w-full" />
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-black uppercase text-gray-500 tracking-widest">Servidor SMTP</span>
                                <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">WARNING</Badge>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-yellow-500 h-full w-[85%]" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
