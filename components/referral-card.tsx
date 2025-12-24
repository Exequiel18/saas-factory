"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Copy, Share2, Check } from "lucide-react"

interface ReferralCardProps {
  referralCode: string
  referralUrl: string
}

export function ReferralCard({ referralCode, referralUrl }: ReferralCardProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const handleCopy = (text: string, type: "code" | "url") => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast({
      title: "Copiado",
      description: type === "code" ? "Código copiado al portapapeles" : "URL copiada al portapapeles",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Únete a SaaS Factory",
          text: `Únete a SaaS Factory usando mi código de referido: ${referralCode}`,
          url: referralUrl,
        })
      } catch (error) {
        // Usuario canceló el share
      }
    } else {
      handleCopy(referralUrl, "url")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tu Código de Referido</CardTitle>
        <CardDescription>
          Comparte este código con tus amigos y ambos ganan beneficios
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Código de Referido</label>
          <div className="flex gap-2">
            <Input
              value={referralCode}
              readOnly
              className="font-mono text-lg font-bold"
            />
            <Button
              onClick={() => handleCopy(referralCode, "code")}
              variant="outline"
              size="icon"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Enlace de Referido</label>
          <div className="flex gap-2">
            <Input
              value={referralUrl}
              readOnly
              className="text-sm"
            />
            <Button
              onClick={() => handleCopy(referralUrl, "url")}
              variant="outline"
              size="icon"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <Button onClick={handleShare} className="w-full" size="lg">
          <Share2 className="h-4 w-4 mr-2" />
          Compartir
        </Button>

        <div className="bg-primary/5 rounded-lg p-4">
          <p className="text-sm font-semibold mb-2">Beneficios del Programa:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• $10 de crédito por cada referido que se registre</li>
            <li>• $50 de crédito si tu referido se suscribe a un plan Pro</li>
            <li>• $100 de crédito si tu referido se suscribe a Enterprise</li>
            <li>• Sin límite de referidos</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}






