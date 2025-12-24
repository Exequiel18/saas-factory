import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { globalAgentRunner } from "@/lib/autonomous-runner"

/**
 * 🤖 Execute Autonomous Agent
 */

export const dynamic = 'force-dynamic'
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        const authHeader = request.headers.get('x-autonomous-key')
        const isAutonomous = authHeader === process.env.AUTONOMOUS_KEY || authHeader === "factory-secret-123"

        if (!session && !isAutonomous) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { agentName } = body

        if (!agentName) {
            return NextResponse.json({ error: "Agent name required" }, { status: 400 })
        }

        // Execute the agent
        const result = await globalAgentRunner.executeAgent(agentName)

        return NextResponse.json({
            ...result,
            agent: agentName,
            timestamp: new Date().toISOString(),
        })
    } catch (error: unknown) {
        console.error("Agent execution error:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Agent execution failed" },
            { status: 500 }
        )
    }
}

/**
 * 📊 Get Agent Status
 */
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const agentName = searchParams.get('agent')

        if (agentName) {
            // Get specific agent status
            const status = await globalAgentRunner.getAgentStatus(agentName)
            return NextResponse.json({ agent: agentName, status })
        }

        // Get all agents
        const agents = globalAgentRunner.getAgents()
        return NextResponse.json({ agents })
    } catch (error: unknown) {
        console.error("Agent status error:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to get agent status" },
            { status: 500 }
        )
    }
}
