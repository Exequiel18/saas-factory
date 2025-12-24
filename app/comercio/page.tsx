"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Zap, ShoppingBag, TrendingUp, AlertCircle, Clock, CheckCircle2, ChevronLeft, Lock } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"

export default function ComercioLocalPage() {
    const { data: session } = useSession()
    const [step, setStep] = useState(1)
    const [inventoryData, setInventoryData] = useState({
        item: "",
        weeklySales: "",
        currentStock: ""
    })
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [paywall, setPaywall] = useState(false)

    const handleAnalyze = async () => {
        setLoading(true)
        setPaywall(false)
        try {
            const response = await fetch("/api/business/evaluate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "commerce_analysis",
                    data: {
                        industry: "Comercio Local",
                        item: inventoryData.item,
                        metrics: {
                            weeklySales: inventoryData.weeklySales,
                            currentStock: inventoryData.currentStock
                        }
                    },
                    userId: session?.user?.id
                })
            })

            if (response.status === 402) {
                setPaywall(true)
                setStep(4) // New step for paywall
                return
            }

            const data = await response.json()
            if (data.success) {
                setResult(data)
                setStep(3)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpgrade = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/mercadopago/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ planId: "pro" })
            })
            const { url } = await res.json()
            window.location.href = url
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <Link href="/que-hacemos" className="inline-flex items-center gap-2 text-slate-400 font-bold hover:text-red-600 transition-colors mb-8 group">
                    <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Volver a industrias
                </Link>

                {/* Header Humano */}
                <div className="mb-12">
                    <div className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded inline-block mb-4">
                        HERRAMIENTA PARA COMERCIOS
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 mb-4 leading-none">
                        ¿Comprar más o <span className="text-red-600 underline">esperar</span>?
                    </h1>
                    <p className="text-xl text-slate-500 font-medium">
                        Cargá un producto y te decimos si estás enterrando plata en stock o si te vas a quedar sin nada para vender.
                    </p>
                </div>

                {step === 1 && (
                    <Card className="p-8 border-none shadow-2xl rounded-[2.5rem] bg-white animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-2xl font-black mb-6">¿Qué producto vamos a ver?</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Nombre del producto</label>
                                <Input
                                    className="h-16 text-xl font-bold border-none bg-slate-50 rounded-2xl px-6"
                                    placeholder="Ej: Yerba Mate 1kg"
                                    value={inventoryData.item}
                                    onChange={(e) => setInventoryData({ ...inventoryData, item: e.target.value })}
                                />
                            </div>
                            <Button
                                onClick={() => inventoryData.item && setStep(2)}
                                disabled={!inventoryData.item}
                                className="w-full h-16 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-red-100 transition-all active:scale-95"
                            >
                                Siguiente paso
                            </Button>
                        </div>
                    </Card>
                )}

                {step === 2 && (
                    <Card className="p-8 border-none shadow-2xl rounded-[2.5rem] bg-white animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-black mb-6">Contanos tus números</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Ventas esta semana (aprox)</label>
                                <Input
                                    type="number"
                                    className="h-16 text-xl font-bold border-none bg-slate-50 rounded-2xl px-6"
                                    placeholder="¿Cuántos vendiste?"
                                    value={inventoryData.weeklySales}
                                    onChange={(e) => setInventoryData({ ...inventoryData, weeklySales: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">¿Cuánto te queda en el estante?</label>
                                <Input
                                    type="number"
                                    className="h-16 text-xl font-bold border-none bg-slate-50 rounded-2xl px-6"
                                    placeholder="Stock actual"
                                    value={inventoryData.currentStock}
                                    onChange={(e) => setInventoryData({ ...inventoryData, currentStock: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-4">
                                <Button
                                    variant="ghost"
                                    onClick={() => setStep(1)}
                                    className="h-16 px-6 font-bold"
                                >
                                    Atrás
                                </Button>
                                <Button
                                    onClick={handleAnalyze}
                                    disabled={loading || !inventoryData.weeklySales || !inventoryData.currentStock}
                                    className="flex-1 h-16 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-red-100"
                                >
                                    {loading ? "Analizando..." : "Analizar producto"}
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {step === 3 && result && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8">
                        <Card className="p-10 border-none shadow-2xl rounded-[3rem] bg-slate-900 text-white">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-red-600 p-2 rounded-xl">
                                    <Zap className="h-6 w-6 fill-current" />
                                </div>
                                <h2 className="text-2xl font-black">Tu Diagnóstico para {inventoryData.item}</h2>
                            </div>

                            <div className="text-xl leading-relaxed mb-8 italic text-slate-200">
                                {result.output}
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-8">
                                <div className="p-4 rounded-2xl bg-slate-800/50">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">ROI ESTIMADO</div>
                                    <div className="text-xl font-black text-red-500">{result.roi?.message || "Recuperás tiempo"}</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-800/50">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">TIPO DE PLAN</div>
                                    <div className="text-xl font-black text-white">{result.niche}</div>
                                </div>
                            </div>
                        </Card>

                        <div className="grid gap-4">
                            <div className="bg-white p-6 rounded-[2rem] shadow-lg flex items-center gap-4 border border-slate-100">
                                <div className="bg-green-100 p-3 rounded-2xl text-green-600">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900">Seguí así de prolijo</h4>
                                    <p className="text-sm text-slate-500 font-medium">Cuidar el stock es cuidar tu bolsillo.</p>
                                </div>
                            </div>

                            <Button
                                onClick={() => {
                                    setStep(1)
                                    setInventoryData({ item: "", weeklySales: "", currentStock: "" })
                                }}
                                className="h-16 w-full border-2 border-slate-200 bg-transparent hover:bg-slate-50 text-slate-600 font-black rounded-2xl"
                            >
                                Analizar otro producto
                            </Button>
                        </div>

                        <div className="text-center pt-8">
                            <p className="text-slate-400 text-sm font-bold mb-4 italic">¿Querés automatizar todo tu inventario hoy?</p>
                            <a href="https://wa.me/something">
                                <Button className="h-14 px-8 bg-black text-white font-black rounded-xl hover:scale-105 transition-transform">
                                    Hablemos por WhatsApp
                                </Button>
                            </a>
                        </div>
                    </div>
                )}

                {step === 4 && paywall && (
                    <Card className="p-10 border-none shadow-2xl rounded-[3rem] bg-slate-900 text-white text-center animate-in zoom-in-95 duration-300 mt-8">
                        <div className="bg-red-600/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock className="h-10 w-10 text-red-600" />
                        </div>
                        <h2 className="text-3xl font-black mb-4">¿Querés seguir cuidando tu stock?</h2>
                        <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                            Ya analizaste tus primeros productos. Cientos de comerciantes ya recuperaron rentabilidad usando esta herramienta todos los días.
                            <br /><br />
                            Pasate a **PRO** y analizá todo tu inventario.
                        </p>
                        <Button
                            onClick={handleUpgrade}
                            disabled={loading}
                            className="w-full h-16 bg-red-600 hover:bg-red-700 text-white font-black text-xl rounded-2xl shadow-xl shadow-red-900/40 mb-4"
                        >
                            {loading ? "Preparando pago..." : "Convertirme en PRO ($9.99)"}
                        </Button>
                        <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Pago seguro con Mercado Pago</p>
                    </Card>
                )}
            </div>
        </div>
    )
}
