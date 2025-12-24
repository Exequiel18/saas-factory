"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Copy, ExternalLink, AlertCircle } from "lucide-react"

export default function ConfigurarWebhookPage() {
  const [webhookSecret, setWebhookSecret] = useState("")
  const [copied, setCopied] = useState(false)

  const webhookUrl = "https://saas-factory-antigravity.vercel.app/api/mercadopago/webhook"

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto pt-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4">
            🔧 Configurar Webhook de Mercado Pago
          </h1>
          <p className="text-slate-300 text-lg">
            Solo necesitás poner el secret del webhook. El resto ya está listo.
          </p>
        </div>

        {/* Paso 1: URL del Webhook */}
        <Card className="mb-6 border-2 border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">1️⃣</span>
              URL del Webhook
            </CardTitle>
            <CardDescription className="text-slate-300">
              Copiá esta URL y usala en Mercado Pago
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={webhookUrl}
                readOnly
                className="bg-slate-800 border-slate-700 text-white"
              />
              <Button
                onClick={() => copyToClipboard(webhookUrl)}
                variant="outline"
                className="border-slate-700 hover:bg-slate-800"
              >
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-slate-400 mt-2">
              Esta URL ya está configurada. Solo copiala.
            </p>
          </CardContent>
        </Card>

        {/* Paso 2: Ir a Mercado Pago */}
        <Card className="mb-6 border-2 border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">2️⃣</span>
              Configurar en Mercado Pago
            </CardTitle>
            <CardDescription className="text-slate-300">
              Abrí el panel de Mercado Pago y creá el webhook
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-slate-200">Pasos:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-slate-300">
                <li>Ve a: <a href="https://www.mercadopago.com.ar/developers/panel" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Mercado Pago Developers</a></li>
                <li>Click en: <strong>Webhooks</strong></li>
                <li>Click en: <strong>Crear webhook</strong></li>
                <li>Pegá la URL de arriba</li>
                <li>Seleccioná eventos: <strong>payment.created</strong> y <strong>payment.updated</strong></li>
                <li>Click en: <strong>Crear</strong></li>
                <li>Copiá el <strong>secret del webhook</strong> (aparece después de crear)</li>
              </ol>
            </div>
            <a
              href="https://www.mercadopago.com.ar/developers/panel"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Abrir Mercado Pago Developers
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Paso 3: Pegar Secret */}
        <Card className="mb-6 border-2 border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">3️⃣</span>
              Pegar Secret del Webhook
            </CardTitle>
            <CardDescription className="text-slate-300">
              Pegá el secret que copiaste de Mercado Pago
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="webhookSecret" className="text-slate-200">
                Secret del Webhook
              </Label>
              <Input
                id="webhookSecret"
                type="text"
                placeholder="Pegá el secret aquí..."
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white mt-2"
              />
              <p className="text-sm text-slate-400 mt-2">
                Este es el secret que te dio Mercado Pago después de crear el webhook.
              </p>
            </div>

            {webhookSecret && (
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-green-400 mb-2">
                      Secret detectado
                    </p>
                    <p className="text-xs text-slate-300">
                      Guardá este secret en:
                    </p>
                    <ul className="list-disc list-inside text-xs text-slate-400 mt-1 space-y-1">
                      <li><code className="bg-slate-800 px-1 rounded">.env.local</code> como <code className="bg-slate-800 px-1 rounded">MERCADO_PAGO_WEBHOOK_SECRET</code></li>
                      <li>Vercel Dashboard → Settings → Environment Variables</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={async () => {
                if (!webhookSecret) {
                  alert('Por favor, pegá el secret primero')
                  return
                }

                // Guardar en localStorage para referencia
                localStorage.setItem('webhook_secret', webhookSecret)
                
                // Copiar al clipboard
                await copyToClipboard(webhookSecret)
                
                alert('Secret copiado. Agregalo a .env.local y a Vercel como MERCADO_PAGO_WEBHOOK_SECRET')
              }}
              className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700"
              disabled={!webhookSecret}
            >
              Copiar Secret
            </Button>
          </CardContent>
        </Card>

        {/* Paso 4: Agregar a Vercel */}
        <Card className="mb-6 border-2 border-amber-500/30 bg-amber-900/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-400">
              <span className="text-2xl">4️⃣</span>
              Agregar a Vercel (IMPORTANTE)
            </CardTitle>
            <CardDescription className="text-slate-300">
              Sin esto, el webhook no funcionará en producción
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold text-slate-200">Pasos:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-slate-300">
                <li>Ve a: <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Vercel Dashboard</a></li>
                <li>Click en: <strong>saas-factory-antigravity</strong></li>
                <li>Settings → <strong>Environment Variables</strong></li>
                <li>Click en: <strong>Add New</strong></li>
                <li>Key: <code className="bg-slate-900 px-1 rounded">MERCADO_PAGO_WEBHOOK_SECRET</code></li>
                <li>Value: <strong>Pegá el secret que copiaste</strong></li>
                <li>Seleccioná: <strong>Production, Preview, Development</strong></li>
                <li>Click en: <strong>Save</strong></li>
              </ol>
            </div>
            <a
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full bg-slate-700 hover:bg-slate-600">
                Abrir Vercel Dashboard
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Resumen */}
        <Card className="border-2 border-green-500/30 bg-green-900/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              Resumen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-slate-300">
              <p>✅ URL del webhook: <code className="bg-slate-800 px-1 rounded">{webhookUrl}</code></p>
              <p>✅ Eventos: <code className="bg-slate-800 px-1 rounded">payment.created</code> y <code className="bg-slate-800 px-1 rounded">payment.updated</code></p>
              <p>✅ Variable en Vercel: <code className="bg-slate-800 px-1 rounded">MERCADO_PAGO_WEBHOOK_SECRET</code></p>
              {webhookSecret && (
                <p className="text-green-400 font-bold mt-4">
                  ✅ Secret listo para agregar a Vercel
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

