"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Brain, TrendingUp, Lock, Zap, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { useBehavioralTracking } from "@/hooks/use-intuition-tracking";

// Define the 10 metrics
const METRICS = [
    { id: "margin", name: "Margen de Beneficio Neto", type: "percent", free: true },
    { id: "breakeven", name: "Punto de Equilibrio", type: "currency", free: true },
    { id: "conversion", name: "Tasa de Conversión", type: "percent", free: true },
    { id: "cac", name: "Costo Adquisición (CAC)", type: "currency", free: false },
    { id: "ltv", name: "Valor de Vida (LTV)", type: "currency", free: false },
    { id: "roi_ia", name: "ROI por IA", type: "percent", free: false },
    { id: "cashflow", name: "Flujo de Caja", type: "currency", free: false },
    { id: "productivity", name: "Índice Productividad", type: "number", free: false },
    { id: "nps", name: "Satisfacción (NPS)", type: "number", free: false },
    { id: "retention", name: "Tasa de Retención", type: "percent", free: false },
];

export default function BusinessMetricsPage() {
    // 🧠 Behavioral Tracking
    const intent = useBehavioralTracking();

    // State
    const [inputs, setInputs] = useState<Record<string, number>>({});
    const [calculated, setCalculated] = useState<Record<string, number>>({});
    const [unlocked, setUnlocked] = useState(false);
    const [showOpportunityModal, setShowOpportunityModal] = useState(false);
    const [simulatedGain, setSimulatedGain] = useState(0);

    // Initial state for simulation
    const [simBoost, setSimBoost] = useState([20]); // 20% improvement

    const calculateMetrics = () => {
        // Simplified calculation logic for demo purposes
        // In a real app, these would follow the formulas in METRICAS_NEGOCIO_IA.md
        const revenue = inputs.revenue || 10000;
        const costs = inputs.costs || 8000;
        const gain = revenue - costs;

        const newCalculated = {
            margin: (gain / revenue) * 100,
            breakeven: (inputs.fixedCosts || 5000) / (1 - ((inputs.variableCosts || 3000) / revenue)),
            conversion: ((inputs.sales || 10) / (inputs.leads || 100)) * 100,
            // Mocking others for the simulation if data missing
            cac: inputs.marketingSpend ? inputs.marketingSpend / (inputs.newCustomers || 1) : 150,
            ltv: (inputs.ticket || 100) * (inputs.freq || 12) * (inputs.retentionYears || 3),
            // ... add others
        };
        setCalculated(newCalculated);
    };

    // Auto-calculate simulation
    useEffect(() => {
        if (Object.keys(inputs).length > 2) {
            calculateMetrics();

            // Check for inefficiency (Trigger Requirement #3)
            const currentMargin = ((inputs.revenue || 0) - (inputs.costs || 0)) / (inputs.revenue || 1);
            if (currentMargin < 0.15 && !showOpportunityModal && !unlocked) {
                // If margin < 15%, show alert about leaving money on table
                const potential = (inputs.revenue || 10000) * 0.10; // 10% more
                setSimulatedGain(potential);
                setTimeout(() => setShowOpportunityModal(true), 3000); // Delay slightly for effect
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputs]);

    const progress = (Object.keys(inputs).length / 3) * 100; // Cap at 3 for free users
    const displayProgress = unlocked ? (Object.keys(inputs).length / 10) * 100 : Math.min(progress, 33);

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-slate-900">Calculadora de Salud del Negocio</h1>
                    <p className="text-xl text-slate-600">Mide tus números. Optimiza con IA. Deja de perder dinero.</p>
                </div>

                {/* 1. Gamified Progress */}
                <Card className="border-blue-200 bg-blue-50/50">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-blue-900">
                                {unlocked ? "Progreso de Auditoría IA" : "Progreso Gratuito (3/10)"}
                            </span>
                            <span className="font-bold text-blue-700">{Math.round(displayProgress)}%</span>
                        </div>
                        <Progress value={displayProgress} className="h-3" />
                        {!unlocked && (
                            <p className="text-sm text-blue-600 mt-2 flex items-center gap-2">
                                <Lock className="w-4 h-4" /> Te faltan 7 métricas clave para el diagnóstico completo.
                                <span className="underline cursor-pointer font-bold" onClick={() => setShowOpportunityModal(true)}>Desbloquear ahora.</span>
                            </p>
                        )}
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-8">

                    {/* Inputs Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Datos del Negocio</CardTitle>
                            <CardDescription>Ingresa tus números mensuales estimados</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Ingresos Totales ($)</label>
                                    <Input
                                        type="number"
                                        placeholder="10000"
                                        onChange={(e) => setInputs(prev => ({ ...prev, revenue: Number(e.target.value) }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Costos Totales ($)</label>
                                    <Input
                                        type="number"
                                        placeholder="8000"
                                        onChange={(e) => setInputs(prev => ({ ...prev, costs: Number(e.target.value) }))}
                                    />
                                </div>
                                {/* More inputs would go here for a full implementation */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Leads Mensuales</label>
                                    <Input
                                        type="number"
                                        placeholder="100"
                                        onChange={(e) => setInputs(prev => ({ ...prev, leads: Number(e.target.value) }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Ventas Mensuales</label>
                                    <Input
                                        type="number"
                                        placeholder="10"
                                        onChange={(e) => setInputs(prev => ({ ...prev, sales: Number(e.target.value) }))}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. & 5. Results & Actionable Advice */}
                    <div className="space-y-6">
                        {METRICS.slice(0, unlocked ? 10 : 3).map((metric) => (
                            <Card key={metric.id} className={metric.id === 'margin' && (calculated.margin || 0) < 15 ? "border-red-300 bg-red-50" : ""}>
                                <CardContent className="p-4 flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-slate-700">{metric.name}</span>
                                        <span className="text-2xl font-bold">
                                            {calculated[metric.id] ?
                                                (metric.type === 'percent' ? `${calculated[metric.id].toFixed(1)}%` : `$${calculated[metric.id].toFixed(0)}`)
                                                : '-'}
                                        </span>
                                    </div>

                                    {/* Action Advice */}
                                    {calculated[metric.id] !== undefined && (
                                        <div className="mt-2 text-sm bg-white/50 p-2 rounded border border-slate-100 flex gap-2">
                                            <Brain className="w-4 h-4 text-purple-600 shrink-0" />
                                            <span className="text-slate-600">
                                                {metric.id === 'margin' && calculated.margin < 20
                                                    ? "Tu margen es bajo. La IA sugiere renegociar costos fijos o implementar dynamic pricing."
                                                    : "Métrica saludable. Escala este canal."}
                                            </span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}

                        {!unlocked && (
                            <div className="relative p-6 border-2 border-dashed border-slate-300 rounded-xl text-center space-y-4 bg-slate-50/50">
                                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-0" />
                                <div className="relative z-10">
                                    <Lock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                    <h3 className="font-semibold text-slate-900">7 Métricas Premium Bloqueadas</h3>
                                    <p className="text-slate-500 text-sm">CAC, LTV, ROI por IA y más...</p>
                                    <Button className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" onClick={() => setShowOpportunityModal(true)}>
                                        Desbloquear Reporte Completo
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. AI Simulation Scenario */}
                <Card className="bg-slate-900 text-white border-slate-800">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Zap className="text-yellow-400 w-6 h-6" />
                            <CardTitle>Simulador de Impacto IA</CardTitle>
                        </div>
                        <CardDescription className="text-slate-400">
                            ¿Qué pasaría si usaras nuestros agentes para optimizar tu negocio?
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Optimización general con IA</span>
                                <span className="font-bold text-yellow-400">{simBoost}%</span>
                            </div>
                            <Slider
                                defaultValue={20}
                                max={50}
                                step={1}
                                onChange={(e) => setSimBoost([Number(e.target.value)])}
                                className="py-4"
                            />
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                                <div className="p-4 bg-slate-800 rounded-lg">
                                    <p className="text-xs text-slate-400">Margen Actual</p>
                                    <p className="text-xl font-bold">{calculated.margin ? calculated.margin.toFixed(1) : 0}%</p>
                                </div>
                                <div className="p-4 bg-slate-800 rounded-lg">
                                    <p className="text-xs text-slate-400">Margen con IA</p>
                                    <p className="text-xl font-bold text-green-400">
                                        {calculated.margin ? (calculated.margin * (1 + simBoost[0] / 100)).toFixed(1) : 0}%
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-800 rounded-lg col-span-2 border border-green-500/30">
                                    <p className="text-xs text-green-400">Dinero Extra Mensual</p>
                                    <p className="text-2xl font-bold text-green-400">
                                        +${((inputs.revenue || 0) * (simBoost[0] / 100) * 0.2).toFixed(0)} USD
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Automatic Opportunity Modal */}
                <Dialog open={showOpportunityModal} onOpenChange={setShowOpportunityModal}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <div className="mx-auto bg-amber-100 p-3 rounded-full w-fit mb-4">
                                <AlertTriangle className="h-8 w-8 text-amber-600" />
                            </div>
                            <DialogTitle className="text-center text-2xl font-bold">
                                Estás perdiendo dinero
                            </DialogTitle>
                            <DialogDescription className="text-center pt-2 text-lg">
                                Detectamos que podrías estar generando <span className="font-bold text-green-600">+${simulatedGain.toFixed(0)} adicionales</span> optimizando solo 2 métricas clave.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="bg-slate-50 p-4 rounded-lg space-y-3 my-2">
                            <div className="flex gap-3 text-sm">
                                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                                <span>Acceso a las 10 métricas avanzadas</span>
                            </div>
                            <div className="flex gap-3 text-sm">
                                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                                <span>Playbook de optimización con IA</span>
                            </div>
                            <div className="flex gap-3 text-sm">
                                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                                <span>Reporte en PDF personalizado</span>
                            </div>
                        </div>
                        <DialogFooter className="flex-col sm:flex-col gap-2">
                            <Button className="w-full text-lg py-6 bg-green-600 hover:bg-green-700" onClick={() => window.location.href = '/api/mercadopago/checkout?plan=report'}>
                                Desbloquear Reporte ($3,000 ARS)
                            </Button>
                            <Button variant="ghost" className="w-full text-slate-400" onClick={() => setShowOpportunityModal(false)}>
                                No, prefiero perder dinero
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    );
}
