import { prisma } from "./prisma"

export const metrics = {
    get: async () => {
        const totalRevenue = await prisma.payment.aggregate({
            _sum: { amount: true },
            where: { status: 'approved' }
        })
        const totalCustomers = await prisma.lead.count({
            where: { status: 'converted' }
        })
        return {
            revenue: totalRevenue._sum.amount || 0,
            customers: totalCustomers
        }
    },
    calculate: () => ({ score: 100 })
}

export const getBusinessMetrics = async (orgId: string) => {
    const orgRevenue = await prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
            status: 'approved',
            subscription: { organizationId: orgId }
        }
    })

    return [
        { label: "Revenue Real", value: `$${(orgRevenue._sum.amount || 0).toLocaleString()} ARS` },
        { label: "Leads Convertidos", value: await prisma.lead.count({ where: { niche: orgId, status: 'converted' } }) }
    ]
}

export default metrics
