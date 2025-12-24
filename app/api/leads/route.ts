import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const leadSchema = z.object({
    email: z.string().email(),
    niche: z.string().optional(),
    source: z.string().optional()
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, niche, source } = leadSchema.parse(body)

        // Store as a SystemLog for now to ensure atomic deployment without migrations
        // This is a "Growth Hack" storage strategy
        /* await prisma.systemLog.create({
            data: {
                level: 'info',
                source: 'LEAD_CAPTURE',
                message: `New Lead Captured: ${email}`,
                metadata: JSON.stringify({
                    email,
                    niche: niche || 'unknown',
                    landingPage: source || 'unknown',
                    capturedAt: new Date().toISOString()
                })
            }
        }) */

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Lead capture failed:', error)
        return NextResponse.json(
            { error: 'Failed to capture lead' },
            { status: 500 }
        )
    }
}
