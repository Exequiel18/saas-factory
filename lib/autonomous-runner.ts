import { prisma } from "./prisma"
import { B2BHunterAgent } from "./agents/B2B_Hunter"
import { GrowthHackerAgent } from "./agents/Growth_Hacker"

export interface AgentResult {
    success: boolean
    message: string
    data?: any
}

export interface Agent {
    name: string
    description: string
    execute(): Promise<AgentResult>
}

export class AutonomousRunner {
    private agents: Map<string, Agent> = new Map()

    constructor() {
        this.registerAgents()
    }

    private registerAgents() {
        this.addAgent(new B2BHunterAgent())
        this.addAgent(new GrowthHackerAgent())
    }

    addAgent(agent: Agent) {
        this.agents.set(agent.name, agent)
    }

    async executeAgent(name: string): Promise<AgentResult> {
        const agent = this.agents.get(name)
        if (!agent) {
            return { success: false, message: `Agent ${name} not found` }
        }

        console.log(`🤖 Executing agent: ${name}...`)
        try {
            const result = await agent.execute()

            await prisma.systemLog.create({
                data: {
                    level: result.success ? "info" : "error",
                    message: `Agent ${name} executed: ${result.message}`,
                    metadata: JSON.stringify({
                        agent: name,
                        result: result.data,
                        timestamp: new Date().toISOString()
                    }),
                    source: "autonomous_runner"
                }
            })

            return result
        } catch (error: any) {
            console.error(`❌ Agent ${name} failed:`, error.message)
            return { success: false, message: error.message }
        }
    }

    getAgents() {
        return Array.from(this.agents.values()).map(a => ({
            name: a.name,
            description: a.description
        }))
    }

    async getAgentStatus(name: string) {
        const lastLog = await prisma.systemLog.findFirst({
            where: {
                source: "autonomous_runner",
                message: { contains: `Agent ${name} executed` }
            },
            orderBy: { createdAt: 'desc' }
        })

        return {
            lastRun: lastLog?.createdAt || null,
            status: lastLog?.level === "info" ? "idle" : lastLog?.level === "error" ? "failed" : "never_run"
        }
    }
}

export const globalAgentRunner = new AutonomousRunner()
