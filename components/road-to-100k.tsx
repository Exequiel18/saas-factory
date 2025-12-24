import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Rocket } from "lucide-react"

interface RoadTo100kProps {
    currentRevenue: number;
}

export function RoadTo100k({ currentRevenue }: RoadTo100kProps) {
    const goal = 100000;
    const progress = Math.min((currentRevenue / goal) * 100, 100);

    return (
        <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-none shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium text-slate-200 flex items-center gap-2">
                    <Rocket className="text-yellow-400 w-5 h-5 animate-pulse" />
                    Road to $100k (Real Life)
                </CardTitle>
                <DollarSign className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold mb-4">
                    ${currentRevenue.toLocaleString()} <span className="text-sm font-normal text-slate-400">/ ${goal.toLocaleString()}</span>
                </div>
                <Progress value={progress} className="h-4 bg-slate-700" />
                <p className="text-xs text-slate-400 mt-2 text-right">
                    {progress.toFixed(2)}% Completado
                </p>
                {progress >= 1 && (
                    <div className="mt-4 p-2 bg-emerald-500/20 border border-emerald-500/50 rounded text-xs text-emerald-200">
                        🚀 ¡El sistema está generando ingresos reales! Sigue optimizando.
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
