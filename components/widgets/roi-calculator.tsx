'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

export function ROICalculator() {
    const [devs, setDevs] = useState(5);
    const [hourlyRate, setHourlyRate] = useState(50);

    // Asumimos que SaaS Factory ahorra 20h/mes por dev
    const savedHours = devs * 20;
    const savedMoney = savedHours * hourlyRate;
    const investment = 149; // Precio del plan
    const roi = ((savedMoney - investment) / investment) * 100;

    return (
        <Card className="bg-emerald-950/30 border-emerald-900 text-white backdrop-blur shadow-xl">
            <CardHeader>
                <CardTitle className="text-emerald-400">Calculadora de Eficiencia DevOps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Tamaño del Equipo: {devs} devs</label>
                    <Slider value={devs} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDevs(Number(e.target.value))} min={1} max={50} step={1} className="py-2" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Costo Hora Promedio: ${hourlyRate}</label>
                    <Slider value={hourlyRate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHourlyRate(Number(e.target.value))} min={10} max={200} step={5} className="py-2" />
                </div>

                <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-xs text-slate-400">Ahorro Mensual</div>
                        <div className="text-2xl font-bold text-white">${savedMoney.toLocaleString()}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-400">ROI Esperado</div>
                        <div className="text-2xl font-bold text-emerald-400">+{roi.toFixed(0)}%</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
