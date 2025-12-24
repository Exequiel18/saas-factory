import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogoutButton } from "@/components/logout-button"
import { OrganizationDetails } from "@/components/organization-details"
import { OrganizationMembers } from "@/components/organization-members"
import { SubscriptionCard } from "@/components/subscription-card"

export default async function OrganizationPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { success?: string; canceled?: string; pending?: string; error?: string; provider?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const organization = await prisma.organization.findUnique({
    where: { id: params.id },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      subscriptions: true,
    },
  })

  if (!organization) {
    redirect("/dashboard")
  }

  const isMember = organization.members.some(
    (m) => m.userId === session.user.id
  )

  if (!isMember) {
    redirect("/dashboard")
  }

  const currentMember = organization.members.find(
    (m) => m.userId === session.user.id
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                ← Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">{organization.name}</h1>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-600">{session.user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {searchParams.success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">
              ¡Suscripción activada exitosamente! {searchParams.provider === "mercadopago" && "Gracias por tu pago con Mercado Pago."}
            </p>
          </div>
        )}

        {searchParams.pending && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">
              Tu pago está pendiente. Te notificaremos cuando sea aprobado.
            </p>
          </div>
        )}

        {searchParams.canceled && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">El proceso de pago fue cancelado.</p>
          </div>
        )}

        {searchParams.error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">
              Hubo un error con el pago. Por favor, intenta nuevamente.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <OrganizationDetails
            organization={organization}
            currentMember={currentMember!}
          />
          <SubscriptionCard
            organization={organization}
            subscription={organization.subscriptions[0]}
            canManage={currentMember?.role === "owner" || currentMember?.role === "admin"}
          />
        </div>

        <div className="mt-6">
          <OrganizationMembers
            organizationId={organization.id}
            members={organization.members}
            currentMember={currentMember!}
          />
        </div>
      </main>
    </div>
  )
}

