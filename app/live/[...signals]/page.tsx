import { IntuitionEngine } from "@/lib/intuition";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveRight, Zap, CheckCircle2 } from "lucide-react";
import { CryptoTicker } from "@/components/widgets/crypto-ticker";
import { ROICalculator } from "@/components/widgets/roi-calculator";
import { LeadCapture } from "@/components/lead-capture";

// Esto habilita la generación dinámica pura
export const dynamic = "force-dynamic";

export default function LivePage({ params }: { params: { signals: string[] } }) {
    // 1. El Cerebro percibe la intención
    const content = IntuitionEngine.perceive(params.signals || ["default"]);

    // Mapeo dinámico de estilos (Tailwind no permite interpolación completa, usamos clases seguras)
    const bgClasses = {
        dark: "bg-slate-950 text-white",
        light: "bg-white text-slate-900",
        glass: "bg-indigo-900 text-white backdrop-blur-xl"
    };

    const currentBg = bgClasses[content.theme.background as keyof typeof bgClasses] || bgClasses.light;

    return (
        <div className={`min-h-screen flex flex-col ${currentBg} font-${content.theme.font}`}>
            {/* Navbar Contextual */}
            <nav className="p-6 flex justify-between items-center border-b border-white/10">
                <div className="font-bold text-2xl tracking-tighter flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full bg-${content.theme.accent}`}></span>
                    SaaS Factory <span className="opacity-50">/ {content.product.name}</span>
                </div>
                <Link href="/dashboard/metrics-calculator">
                    <Button variant="ghost" className="hover:bg-white/10">Login</Button>
                </Link>
            </nav>

            {/* Hero Section Mutante */}
            <main className="flex-1 container mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-8">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border bg-${content.theme.primary}/10 border-${content.theme.primary}/20 text-${content.theme.primary}`}>
                        <Zap className="w-4 h-4 mr-2 fill-current" />
                        Detectado: Interés Alto en {params.signals.join(" / ")}
                    </div>

                    <h1 className="text-6xl md:text-7xl font-black leading-tight tracking-tight">
                        {content.copy.headline}
                    </h1>

                    <p className="text-xl md:text-2xl opacity-80 leading-relaxed max-w-2xl">
                        {content.copy.subheadline}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link href={`/api/mercadopago/checkout?plan=${content.product.planId}&price=${content.product.price}`}>
                            <Button size="lg" className={`text-xl h-16 px-8 rounded-full bg-${content.theme.primary} hover:opacity-90 transition-all shadow-xl shadow-${content.theme.primary}/20`}>
                                {content.copy.cta} (${content.product.price}) <MoveRight className="ml-2 w-6 h-6" />
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="text-xl h-16 px-8 rounded-full border-2">
                            Ver Demo
                        </Button>
                    </div>

                    <div className="pt-8 flex items-center gap-6 text-sm opacity-60">
                        <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Cancelación inmediata</span>
                        <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Garantía de Satisfacción</span>
                    </div>

                    {/* WIDGET DINÁMICO DE UTILIDAD REAL */}
                    {content.widget && (
                        <div className="pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                            {content.widget.type === 'crypto-ticker' && <CryptoTicker />}
                            {content.widget.type === 'roi-calculator' && <ROICalculator />}
                        </div>
                    )}
                </div>

                <div className="flex-1 relative w-full aspect-square md:aspect-auto md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                    {/* Imagen externa dinámica */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
                        style={{ backgroundImage: `url(${content.assets.heroImage})` }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-${content.theme.secondary} to-transparent opacity-60`} />

                    <div className="absolute bottom-8 left-8 right-8">
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                <span className="text-red-500">⚠</span> Problema Detectado
                            </h3>
                            <p className="opacity-90">{content.copy.painPoint}</p>
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                    <span className="text-green-400">✓</span> Solución IA
                                </h3>
                                <p className="opacity-90">{content.copy.solution}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* SECCIÓN DE CAPTURA DE LEADS REAL */}
            <section className="container mx-auto px-4 py-12 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                <LeadCapture
                    niche={content.product.name}
                    title={`Unlock Exclusive ${content.product.name} Strategies`}
                    description={`Join 1,200+ professionals using AI to dominate the ${content.product.name} market. Get weekly alerts.`}
                    buttonText="Get Early Access & Save 20%"
                />
            </section>
        </div>
    );
}
