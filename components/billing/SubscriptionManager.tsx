"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/toast"
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react"

interface Subscription {
    status: string
    plan: string
    amount: number
    currency: string
    renewalDate?: string
}

interface SubscriptionManagerProps {
    subscription: Subscription
    organizationId: string
    onUpdate?: () => void
}

export function SubscriptionManager({ subscription, organizationId, onUpdate }: SubscriptionManagerProps) {
    const [loading, setLoading] = useState<string | null>(null)
    const { toast } = useToast()

    const handleCancel = async () => {
        setLoading("cancel")
        try {
            const response = await fetch("/api/billing/subscription/cancel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ organizationId }),
            })

            if (!response.ok) throw new Error("Failed to cancel subscription")

            toast({
                title: "Suscripción cancelada",
                description: "Tu suscripción ha sido cancelada exitosamente.",
            })
            if (onUpdate) onUpdate()
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        } finally {
            setLoading(null)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Activa</Badge>
            case "canceled":
                return <Badge variant="destructive">Cancelada</Badge>
            case "past_due":
                return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Mora</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    return (
        <Card className="bg-[#0a0f1e] border-white/5 backdrop-blur-3xl overflow-hidden">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-2xl font-black uppercase italic italic">Tu Plan</CardTitle>
                        <CardDescription className="text-gray-400">Gestiona tu suscripción y beneficios.</CardDescription>
                    </div>
                    {getStatusBadge(subscription.status)}
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-black uppercase tracking-widest text-gray-500">Plan Actual</p>
                        <p className="text-xl font-bold uppercase">{subscription.plan}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Costo Mensual</p>
                        <p className="text-2xl font-black">{subscription.amount} {subscription.currency}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Próxima Renovación</p>
                        <p className="text-lg font-bold">{subscription.renewalDate ? new Date(subscription.renewalDate).toLocaleDateString() : "N/A"}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="bg-black/20 border-t border-white/5 p-6 flex gap-4">
                <Button
                    variant="outline"
                    className="flex-1 rounded-xl border-white/10 hover:bg-white/5"
                    onClick={() => toast({ title: "Próximamente", description: "La gestión de upgrades estará disponible pronto." })}
                >
                    Mejorar Plan
                </Button>
                {subscription.status === "active" && (
                    <Button
                        variant="destructive"
                        className="flex-1 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border-red-500/20"
                        onClick={handleCancel}
                        disabled={loading === "cancel"}
                    >
                        {loading === "cancel" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cancelar"}
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
