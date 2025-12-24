import { NextResponse } from "next/server"
import { globalAutoActivation } from "@/lib/auto-activation"

/**
 * 🚀 AUTO-PROCESS CONTROL API
 */
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { action } = body

        let result

        switch (action) {
            case 'activate':
                result = await globalAutoActivation.activateAll()
                break

            case 'pause':
                globalAutoActivation.pauseAll()
                result = { message: 'All processes paused' }
                break

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            result,
            timestamp: new Date().toISOString()
        })
    } catch (error: unknown) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed' },
            { status: 500 }
        )
    }
}

/**
 * 📊 Get auto-process status
 */
export async function GET() {
    const status = globalAutoActivation.getStatus()

    return NextResponse.json({
        success: true,
        ...status,
        message: status.active
            ? `${status.count} autonomous processes running`
            : 'Auto-processes inactive',
        timestamp: new Date().toISOString()
    })
}
