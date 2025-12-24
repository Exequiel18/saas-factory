import { Button } from "@/components/ui/button"
import { CheckCircle2, Rocket, TrendingUp, DollarSign, Shield, Zap, Globe } from "lucide-react"

// Variantes de prueba A/B
const VARIANTS = {
    "v1-speed": {
        headline: "Deja de Programar el Login. Empieza a Cobrar.",
        subhead: "Ahorra 200 horas de desarrollo con nuestra plantilla SaaS.",
        color: "blue",
        cta: "Obtener Acceso",

        price: "$29"
    },
    "v2-enterprise": {
        headline: "Infraestructura SaaS de Grado Militar.",
        subhead: "Escala a millones de usuarios. Seguridad, Multi-tenancy y Compliance listos.",
        color: "slate",
        cta: "Contactar Ventas",
        price: "$999"
    },
    "v3-viral": {
        headline: "Lanza tu Startup Gratis Hoy Mismo.",
        subhead: "Únete a 10,000 fundadores. Paga solo cuando crezcas.",
        color: "green",
        cta: "Empezar Gratis",
        price: "$0"
    }
}

export default function CampaignPage({ params, searchParams }: { params: { variant: string }, searchParams: { trait?: string } }) {
    const variantKey = params.variant as keyof typeof VARIANTS
    const content = VARIANTS[variantKey] || VARIANTS["v1-speed"]

    // Mutación Genética (Trait System)
    const trait = searchParams.trait || "standard"

    // Mapeo Estático para Tailwind JIT (La Intuición del Compilador)
    const COLOR_MAP = {
        blue: {
            bg: "bg-blue-600",
            border: "border-blue-500",
            hover: "hover:bg-blue-700",
            lightBg: "bg-blue-50",
            text: "text-blue-800",
            lightBorder: "border-blue-200",
            textAccent: "text-blue-600"
        },
        slate: {
            bg: "bg-slate-900",
            border: "border-slate-700",
            hover: "hover:bg-slate-800",
            lightBg: "bg-slate-50",
            text: "text-slate-800",
            lightBorder: "border-slate-200",
            textAccent: "text-slate-600"
        },
        green: {
            bg: "bg-green-600",
            border: "border-green-500",
            hover: "hover:bg-green-700",
            lightBg: "bg-green-50",
            text: "text-green-800",
            lightBorder: "border-green-200",
            textAccent: "text-green-600"
        }
    }

    const theme = COLOR_MAP[content.color as keyof typeof COLOR_MAP] || COLOR_MAP.blue

    const getTraitStyle = () => {
        if (trait === "bold") return "bg-yellow-400 text-black border-4 border-black rotate-1 scale-105" // Aggressive Breach
        if (trait === "pivot") return "bg-purple-900 text-pink-200 font-serif italic" // Artistic Pivot
        return `${theme.lightBg} ${theme.text} ${theme.lightBorder}` // Standard DNA
    }

    const getButtonStyle = () => {
        if (trait === "bold") return "bg-black text-yellow-400 hover:bg-gray-900 border-4 border-yellow-400 font-black tracking-widest uppercase text-2xl"
        if (trait === "pivot") return "bg-pink-500 text-white hover:bg-pink-600 rounded-full font-serif"
        return `${theme.bg} ${theme.border} text-white ${theme.hover}`
    }

    return (
        <div className={`min-h-screen font-sans transition-all duration-1000 ${trait === 'pivot' ? 'bg-purple-50' : 'bg-white'}`}>
            <div className={`text-center text-xs py-2 font-mono uppercase tracking-widest ${trait === 'bold' ? 'bg-yellow-400 text-black font-bold' : 'bg-black text-white'}`}>
                🔴 LIVE WEB VIEW: {params.variant.toUpperCase()} {trait !== 'standard' && `| MUTATION: ${trait.toUpperCase()}`}
            </div>

            {/* Navbar Minimal */}
            <nav className="p-6 flex justify-between items-center border-b">
                <h1 className="font-bold text-xl tracking-tighter">SaaS<span className={theme.textAccent}>Factory</span></h1>
                <Button variant="outline" size="sm" className="hidden sm:flex">Login</Button>
            </nav>

            {/* Hero */}
            <main className="container mx-auto px-4 py-24 text-center">
                <div className={`inline-flex items-center rounded-full border px-3 py-1 text-sm mb-8 font-medium transition-all duration-500 ${getTraitStyle()}`}>
                    <Zap className="w-4 h-4 mr-2" />
                    {trait === "bold" ? "⚠️ PROTOCOLO AGRESIVO ACTIVADO" : trait === "pivot" ? "✨ PIVOTE ARTÍSTICO DETECTADO" : `Versión Activa: ${params.variant}`}
                </div>

                <h1 className={`text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight transition-all ${trait === 'bold' ? 'text-black uppercase scale-110' : 'text-slate-900'}`}>
                    {content.headline}
                </h1>

                <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                    {content.subhead}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button size="lg" className={`text-lg px-12 py-8 h-auto font-bold shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${getButtonStyle()}`}>
                        {content.cta} <span className="ml-2 font-mono opacity-80">({content.price})</span>
                    </Button>
                    <span className="text-xs text-slate-400 mt-4 sm:mt-0 sm:ml-4">
                        Sin tarjeta de crédito requerida
                    </span>
                </div>
            </main>

            {/* Social Proof Banner */}
            <div className="border-y bg-slate-50 py-12">
                <div className="container mx-auto px-4 flex flex-wrap justify-center gap-12 opacity-50 grayscale">
                    <span className="text-2xl font-bold flex items-center gap-2"><Globe /> ACME Corp</span>
                    <span className="text-2xl font-bold flex items-center gap-2"><Shield /> SecureAI</span>
                    <span className="text-2xl font-bold flex items-center gap-2"><Rocket /> RocketGrowth</span>
                </div>
            </div>
        </div>
    )
}
