'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"

export function CryptoTicker() {
    const [prices, setPrices] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulamos fetch real para demo rápida sin API KEY, pero estructura lista para CoinGecko
        const fetchPrices = async () => {
            // En producción: await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true')
            // Simulamos datos vivos:
            setLoading(true);
            await new Promise(r => setTimeout(r, 1000));

            setPrices({
                bitcoin: { usd: 64230 + Math.random() * 100, change: 2.4 },
                ethereum: { usd: 3450 + Math.random() * 50, change: -1.2 },
                solana: { usd: 145 + Math.random() * 5, change: 5.7 }
            });
            setLoading(false);
        };

        fetchPrices();
        const interval = setInterval(fetchPrices, 10000); // Actualizar cada 10s
        return () => clearInterval(interval);
    }, []);

    if (loading && !prices) return <div className="animate-pulse bg-white/10 h-32 rounded-xl"></div>

    return (
        <Card className="bg-slate-900 border-slate-800 text-white shadow-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm text-slate-400">
                    <DollarSign className="w-4 h-4 text-emerald-400" /> LIVE MARKET DATA
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
                {Object.entries(prices).map(([coin, data]: [string, any]) => (
                    <div key={coin} className="text-center">
                        <div className="font-bold text-lg uppercase">{coin}</div>
                        <div className="text-xl">${data.usd.toFixed(2)}</div>
                        <div className={`text-xs ${data.change > 0 ? 'text-emerald-400' : 'text-red-400'} flex justify-center items-center`}>
                            {data.change > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                            {data.change}%
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
