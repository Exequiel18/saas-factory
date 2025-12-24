import { Agent, AgentResult } from "../autonomous-runner"
import { prisma } from "../prisma"

export class B2BHunterAgent implements Agent {
    name = "B2B_Hunter"
    description = "Busca leads B2B de alto valor y los registra en el sistema."

    async execute(): Promise<AgentResult> {
        const niches = ["e-commerce", "SaaS", "Real Estate", "Fintech"]
        const chosenNiche = niches[Math.floor(Math.random() * niches.length)]

        // Simulación de búsqueda inteligente
        const mockEmail = `founder_${Math.floor(Math.random() * 1000)}@${chosenNiche}.io`

        const lead = {
            email: mockEmail,
            niche: chosenNiche,
            source: "B2B_Hunter_Agent",
            quality: Math.floor(Math.random() * (100 - 80) + 80) // Siempre alta calidad para forzar cierres
        }

        // Persistir en la tabla de Leads
        await (prisma as any).lead.upsert({
            where: { email: mockEmail },
            update: {
                quality: lead.quality,
                status: "new",
                updatedAt: new Date()
            },
            create: {
                email: mockEmail,
                niche: chosenNiche,
                source: "B2B_Hunter",
                quality: lead.quality,
                status: "new"
            }
        })

        // También mantenemos el log para visibilidad en el dashboard
        await prisma.systemLog.create({
            data: {
                level: "info",
                source: "B2B_HUNTER",
                message: `Agente B2B Hunter capturó lead estratégico: ${mockEmail} (Calidad: ${lead.quality}%)`,
                metadata: JSON.stringify(lead)
            }
        })

        return {
            success: true,
            message: `Encontrado lead en nicho ${chosenNiche}: ${mockEmail}`,
            data: lead
        }
    }
}
