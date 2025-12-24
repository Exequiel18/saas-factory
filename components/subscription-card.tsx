"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface SubscriptionCardProps {
  organization: {
    id: string
    name: string
  }
  subscription?: {
    id: string
    plan: string
    status: string
    stripeCurrentPeriodEnd: Date | null
  } | null
  canManage: boolean
}

const PLANS = {
  free: {
    name: "Free",
    price: "$0",
    features: ["Basic features", "1 organization", "Community support"],
  },
  pro: {
    name: "Pro",
    price: "$29",
    features: ["All features", "Unlimited organizations", "Priority support"],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "price_pro",
  },
  enterprise: {
    name: "Enterprise",
    price: "Custom",
    features: ["Everything in Pro", "Custom integrations", "Dedicated support"],
  },
}

export function SubscriptionCard({
  organization,
  subscription,
  canManage,
}: SubscriptionCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const currentPlan = subscription?.plan || "free"
  const planDetails = PLANS[currentPlan as keyof typeof PLANS] || PLANS.free

  const handleCheckout = async (priceId: string, provider: "stripe" | "mercadopago" = "mercadopago") => {
    if (!canManage) {
      toast({
        title: "Error",
        description: "You don't have permission to manage subscriptions",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const endpoint = provider === "mercadopago" 
        ? "/api/mercadopago/checkout"
        : "/api/stripe/checkout"
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: organization.id,
          priceId: provider === "stripe" ? priceId : undefined,
          planId: provider === "mercadopago" ? priceId : undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create checkout session")
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const handlePortal = async () => {
    if (!canManage) {
      toast({
        title: "Error",
        description: "You don't have permission to manage subscriptions",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: organization.id,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create portal session")
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
        <CardDescription>Manage your subscription plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">{planDetails.name}</h3>
            <span className="text-2xl font-bold">{planDetails.price}</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Status: <span className="capitalize">{subscription?.status || "active"}</span>
          </p>
          {subscription?.stripeCurrentPeriodEnd && (
            <p className="text-sm text-gray-600">
              Renews: {new Date(subscription.stripeCurrentPeriodEnd).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Features:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {planDetails.features.map((feature, i) => (
              <li key={i}>• {feature}</li>
            ))}
          </ul>
        </div>

        {canManage && (
          <div className="space-y-2 pt-4 border-t">
            {subscription?.stripeSubscriptionId ? (
              <Button
                onClick={handlePortal}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Loading..." : "Manage Subscription"}
              </Button>
            ) : (
              <div className="space-y-2">
                <Button
                  onClick={() => handleCheckout(PLANS.pro.priceId!, "mercadopago")}
                  disabled={loading || !PLANS.pro.priceId}
                  className="w-full"
                >
                  {loading ? "Cargando..." : "Actualizar a Pro"}
                </Button>
                <p className="text-xs text-center text-gray-500">
                  Pago seguro con Mercado Pago
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

