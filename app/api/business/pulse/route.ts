import { NextResponse } from "next/server"
import { getActionPulse } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function GET() {
    try {
        const pulses = await getActionPulse(10)

        // Fallback if empty
        if (pulses.length === 0) {
            return NextResponse.json([
                { id: "f1", text: "El sistema está listo y esperando su primera acción." },
                { id: "f2", text: "Docentes IA: Optimizando el tiempo de los educadores." }
            ])
        }

        return NextResponse.json(pulses)
    } catch (error) {
        return NextResponse.json({ error: "Pulse failed" }, { status: 500 })
    }
}
