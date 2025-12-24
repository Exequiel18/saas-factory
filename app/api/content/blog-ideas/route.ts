import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const body = await request.json();

        console.log("📝 Recibidas nuevas ideas de blog desde n8n:", body);

        // En un sistema real, aquí guardaríamos en DB para mostrar en Dashboard
        // Por ahora validamos la recepción

        return NextResponse.json({
            success: true,
            received: true,
            message: "Ideas recibidas y agendadas para revisión"
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
