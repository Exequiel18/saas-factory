import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogoutButton } from "@/components/logout-button"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const organizations = await prisma.organizationMember.findMany({
    where: { userId: (session.user as any)?.id },
    include: {
      organization: {
        include: {
          subscriptions: true,
          members: true,
        },
      },
    },
  })

  const totalOrganizations = organizations?.length || 0
  const totalMembers = organizations?.reduce(
    (acc, org) => acc + (org.organization?.members?.length || 0),
    0
  ) || 0
  const activeSubscriptions = organizations?.filter(
    (org) => org.organization?.subscriptions?.[0]?.status === "active"
  ).length || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex gap-4 items-center">
            <Link href="/pricing">
              <Button variant="ghost" size="sm">
                Ver Planes
              </Button>
            </Link>
            <Link href="/dashboard/referrals">
              <Button variant="ghost" size="sm">
                Referidos
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button variant="ghost" size="sm">
                Analytics
              </Button>
            </Link>
            <Link href="/dashboard/command-center">
              <Button variant="ghost" size="sm" className="bg-cyan-500 text-white hover:bg-cyan-600 font-bold">
                🧠 Command Center
              </Button>
            </Link>
            <Link href="/dashboard/autonomous-marketing">
              <Button variant="ghost" size="sm" className="bg-cyan-50 text-cyan-700 hover:bg-cyan-100">
                Marketing Autónomo
              </Button>
            </Link>
            <Link href="/dashboard/deploy">
              <Button variant="ghost" size="sm" className="bg-red-50 text-red-700 hover:bg-red-100 font-bold">
                🚀 Deploy Automático
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="ghost" size="sm">
                Configuración
              </Button>
            </Link>
            <span className="text-sm text-gray-600">{session?.user?.email}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">¡Bienvenido de vuelta, {session?.user?.name || session?.user?.email}!</h2>
          <p className="text-gray-600">Gestiona tus organizaciones y suscripciones</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Organizaciones</CardDescription>
              <CardTitle className="text-3xl">{totalOrganizations}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Miembros</CardDescription>
              <CardTitle className="text-3xl">{totalMembers}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Suscripciones Activas</CardDescription>
              <CardTitle className="text-3xl">{activeSubscriptions}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Organizaciones</CardTitle>
              <CardDescription>Tus organizaciones</CardDescription>
            </CardHeader>
            <CardContent>
              {organizations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Aún no tienes organizaciones</p>
                  <Link href="/dashboard/organizations/new">
                    <Button>Crear Organización</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {organizations?.map((member) => {
                    const subscription = member.organization?.subscriptions?.[0]
                    return (
                      <Link
                        key={member.id}
                        href={`/dashboard/organizations/${member.organization.id}`}
                      >
                        <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{member.organization.name}</h3>
                              <p className="text-sm text-gray-600">Role: {member.role}</p>
                            </div>
                            {subscription && (
                              <span className={`text-xs px-2 py-1 rounded capitalize ${subscription.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                                }`}>
                                {subscription.plan}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                  <Link href="/dashboard/organizations/new">
                    <Button variant="outline" className="w-full mt-4">
                      Crear Nueva Organización
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Tareas comunes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard/organizations/new" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Crear Organización
                </Button>
              </Link>
              <Link href="/dashboard/referrals" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Referidos
                </Button>
              </Link>
              <Link href="/dashboard/credits" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Mis Créditos
                </Button>
              </Link>
              <Link href="/dashboard/analytics" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Analytics e Ingresos
                </Button>
              </Link>
              <Link href="/dashboard/payments" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Facturación y Pagos
                </Button>
              </Link>
              <Link href="/dashboard/integrations" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Integraciones
                </Button>
              </Link>
              <Link href="/dashboard/deploy" className="block">
                <Button variant="outline" className="w-full justify-start bg-red-50 text-red-700 hover:bg-red-100 font-bold">
                  🚀 Deploy Automático
                </Button>
              </Link>
              <Link href="/pricing" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Ver Planes
                </Button>
              </Link>
              <Link href="/dashboard/settings" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Configuración
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

