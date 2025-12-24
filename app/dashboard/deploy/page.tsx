"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Rocket, CheckCircle2, Loader2, ExternalLink,
  Key, Database, Globe, AlertCircle
} from "lucide-react"
import Link from "next/link"

export default function DeployPage() {
  const [credentials, setCredentials] = useState({
    githubToken: '',
    vercelToken: '',
    repoName: 'saas-factory',
    repoOwner: 'Exequiel18'
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string[]>([])
  const [deploying, setDeploying] = useState(false)
  const [success, setSuccess] = useState(false)
  const [deployUrl, setDeployUrl] = useState('https://saas-factory-antigravity.vercel.app')

  // Auto-deploy al cargar la página
  useEffect(() => {
    const autoDeploy = async () => {
      if (credentials.githubToken && credentials.vercelToken && !deploying && status.length === 0) {
        setTimeout(() => {
          handleDeploy()
        }, 2000)
      }
    }
    autoDeploy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSaveCredentials = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/deploy/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })
      const data = await res.json()
      if (data.success) {
        setStatus([...status, '✅ Credenciales guardadas'])
      }
    } catch (error) {
      setStatus([...status, '❌ Error guardando credenciales'])
    } finally {
      setLoading(false)
    }
  }

  const handleDeploy = async () => {
    if (!credentials.githubToken || !credentials.vercelToken) {
      setStatus([...status, '❌ Necesitás GitHub Token y Vercel Token'])
      return
    }

    setDeploying(true)
    setStatus(['🚀 Iniciando deploy automático...'])

    try {
      // Guardar credenciales primero
      await fetch('/api/deploy/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })

      setStatus([...status, '✅ Credenciales guardadas', '📤 Creando repositorio en GitHub...'])

      // Crear repo en GitHub
      const githubRes = await fetch('/api/deploy/create-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: credentials.repoName || 'saas-factory',
          token: credentials.githubToken
        })
      })

      const githubData = await githubRes.json()
      
      if (githubData.success) {
        setStatus([...status, '✅ Repositorio creado en GitHub', '📤 Subiendo código...'])
        
        // Hacer push
        const pushRes = await fetch('/api/deploy/push-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            repoUrl: githubData.repoUrl,
            token: credentials.githubToken
          })
        })

        const pushData = await pushRes.json()
        
        if (pushData.success) {
          setStatus([...status, '✅ Código subido a GitHub', '🚀 Desplegando en Vercel...'])
          
          // Deploy en Vercel
          const vercelRes = await fetch('/api/deploy/vercel-deploy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              repoUrl: githubData.repoUrl,
              vercelToken: credentials.vercelToken,
              githubToken: credentials.githubToken
            })
          })

          const vercelData = await vercelRes.json()
          
          if (vercelData.success) {
            setStatus([...status, '✅ Deploy exitoso!'])
            setSuccess(true)
            setDeployUrl(vercelData.url)
          } else {
            setStatus([...status, `❌ Error en Vercel: ${vercelData.error}`])
          }
        } else {
          setStatus([...status, `❌ Error en push: ${pushData.error}`])
        }
      } else {
        setStatus([...status, `❌ Error creando repo: ${githubData.error}`])
      }
    } catch (error: any) {
      setStatus([...status, `❌ Error: ${error.message}`])
    } finally {
      setDeploying(false)
    }
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-black text-slate-900 mb-2">
                🚀 Deploy Automático Completo
              </h1>
              <p className="text-slate-600">
                Dá permisos y el sistema hace TODO por vos. En 5 minutos está online.
              </p>
            </div>

            {/* Sección de Configurar Webhook */}
            <Card className="mb-8 border-2 border-amber-500 bg-amber-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-900">
                  🔧 Configurar Webhook de Mercado Pago
                </CardTitle>
                <CardDescription className="text-amber-800">
                  Solo necesitás poner el secret del webhook. El resto ya está listo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Paso 1: URL del Webhook */}
                <div>
                  <Label className="text-amber-900 font-bold mb-2 block">
                    1️⃣ URL del Webhook (Copiá esto)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value="https://saas-factory-antigravity.vercel.app/api/mercadopago/webhook"
                      readOnly
                      className="bg-white border-amber-300"
                    />
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText("https://saas-factory-antigravity.vercel.app/api/mercadopago/webhook")
                        alert('URL copiada!')
                      }}
                      variant="outline"
                      className="border-amber-300"
                    >
                      Copiar
                    </Button>
                  </div>
                </div>

                {/* Paso 2: Ir a Mercado Pago */}
                <div>
                  <Label className="text-amber-900 font-bold mb-2 block">
                    2️⃣ Configurar en Mercado Pago
                  </Label>
                  <div className="bg-white/80 rounded-lg p-4 space-y-2 text-sm text-amber-900">
                    <p className="font-bold">Pasos:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Ve a: <a href="https://www.mercadopago.com.ar/developers/panel" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Mercado Pago Developers</a></li>
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
                    className="mt-2 inline-block"
                  >
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Abrir Mercado Pago Developers
                    </Button>
                  </a>
                </div>

                {/* Paso 3: Pegar Secret */}
                <div>
                  <Label htmlFor="webhookSecret" className="text-amber-900 font-bold mb-2 block">
                    3️⃣ Pegar Secret del Webhook
                  </Label>
                  <Input
                    id="webhookSecret"
                    type="text"
                    placeholder="Pegá el secret aquí..."
                    className="bg-white border-amber-300"
                  />
                  <p className="text-xs text-amber-700 mt-1">
                    Este es el secret que te dio Mercado Pago después de crear el webhook.
                  </p>
                </div>

                {/* Paso 4: Agregar a Vercel */}
                <div>
                  <Label className="text-amber-900 font-bold mb-2 block">
                    4️⃣ Agregar a Vercel (IMPORTANTE)
                  </Label>
                  <div className="bg-white/80 rounded-lg p-4 space-y-2 text-sm text-amber-900">
                    <p className="font-bold">Pasos:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Ve a: <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Vercel Dashboard</a></li>
                      <li>Click en: <strong>saas-factory-antigravity</strong></li>
                      <li>Settings → <strong>Environment Variables</strong></li>
                      <li>Click en: <strong>Add New</strong></li>
                      <li>Key: <code className="bg-amber-100 px-1 rounded">MERCADO_PAGO_WEBHOOK_SECRET</code></li>
                      <li>Value: <strong>Pegá el secret que copiaste</strong></li>
                      <li>Seleccioná: <strong>Production, Preview, Development</strong></li>
                      <li>Click en: <strong>Save</strong></li>
                    </ol>
                  </div>
                  <a
                    href="https://vercel.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block"
                  >
                    <Button className="bg-slate-700 hover:bg-slate-600">
                      Abrir Vercel Dashboard
                    </Button>
                  </a>
                </div>

                {/* Resumen */}
                <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                  <p className="text-sm font-bold text-green-900 mb-2">✅ Resumen:</p>
                  <ul className="text-xs text-green-800 space-y-1">
                    <li>✅ URL del webhook: <code className="bg-green-200 px-1 rounded">https://saas-factory-antigravity.vercel.app/api/mercadopago/webhook</code></li>
                    <li>✅ Eventos: <code className="bg-green-200 px-1 rounded">payment.created</code> y <code className="bg-green-200 px-1 rounded">payment.updated</code></li>
                    <li>✅ Variable en Vercel: <code className="bg-green-200 px-1 rounded">MERCADO_PAGO_WEBHOOK_SECRET</code></li>
                  </ul>
                </div>
              </CardContent>
            </Card>

        {/* Instrucciones para obtener tokens */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <AlertCircle className="h-5 w-5" />
              Cómo Obtener los Tokens
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-bold text-blue-900 mb-2">1. GitHub Token</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                <li>Ve a <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="underline">github.com/settings/tokens</a></li>
                <li>Click "Generate new token (classic)"</li>
                <li>Nombre: "Deploy Agent"</li>
                <li>Scopes: Marca <code className="bg-blue-100 px-1 rounded">repo</code> (Full control of private repositories)</li>
                <li>Click "Generate token"</li>
                <li>Copiá el token (solo se muestra una vez)</li>
              </ol>
            </div>
            <div>
              <h3 className="font-bold text-blue-900 mb-2">2. Vercel Token</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                <li>Ve a <a href="https://vercel.com/account/tokens" target="_blank" rel="noopener noreferrer" className="underline">vercel.com/account/tokens</a></li>
                <li>Click "Create Token"</li>
                <li>Nombre: "Deploy Agent"</li>
                <li>Scope: Full Access</li>
                <li>Click "Create"</li>
                <li>Copiá el token</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Formulario de credenciales */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Permisos Necesarios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="githubToken" className="flex items-center gap-2">
                GitHub Token
                <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs flex items-center gap-1">
                  Obtener <ExternalLink className="h-3 w-3" />
                </a>
              </Label>
              <Input
                id="githubToken"
                type="password"
                placeholder="ghp_xxxxxxxxxxxx"
                value={credentials.githubToken}
                onChange={(e) => setCredentials({ ...credentials, githubToken: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vercelToken" className="flex items-center gap-2">
                Vercel Token
                <a href="https://vercel.com/account/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs flex items-center gap-1">
                  Obtener <ExternalLink className="h-3 w-3" />
                </a>
              </Label>
              <Input
                id="vercelToken"
                type="password"
                placeholder="xxxxxxxxxxxx"
                value={credentials.vercelToken}
                onChange={(e) => setCredentials({ ...credentials, vercelToken: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="repoName">Nombre del Repositorio (opcional)</Label>
              <Input
                id="repoName"
                placeholder="saas-factory"
                value={credentials.repoName}
                onChange={(e) => setCredentials({ ...credentials, repoName: e.target.value })}
              />
              <p className="text-xs text-slate-500">Si no especificás, se usa "saas-factory"</p>
            </div>

            <Button 
              onClick={handleSaveCredentials} 
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? 'Guardando...' : 'Guardar Credenciales'}
            </Button>
          </CardContent>
        </Card>

        {/* Botón de deploy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              Deploy Automático Completo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              El sistema va a:
            </p>
            <ul className="list-disc list-inside text-sm text-slate-600 mb-6 space-y-1">
              <li>Crear repositorio en GitHub</li>
              <li>Subir todo el código</li>
              <li>Configurar variables en Vercel</li>
              <li>Hacer el deploy</li>
              <li>Aplicar schema de base de datos</li>
            </ul>

            <Button 
              onClick={handleDeploy} 
              disabled={deploying || !credentials.githubToken || !credentials.vercelToken}
              className="w-full bg-red-600 hover:bg-red-700"
              size="lg"
            >
              {deploying ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Desplegando...
                </>
              ) : (
                <>
                  <Rocket className="h-5 w-5 mr-2" />
                  Deploy Automático Completo
                </>
              )}
            </Button>

            {status.length > 0 && (
              <div className="mt-6 space-y-2">
                <h3 className="font-bold text-slate-900">Estado:</h3>
                <div className="bg-slate-50 rounded-lg p-4 space-y-1 max-h-60 overflow-y-auto">
                  {status.map((s, i) => (
                    <p key={i} className="text-sm text-slate-700">{s}</p>
                  ))}
                </div>
              </div>
            )}

            {success && deployUrl && (
              <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <h3 className="font-bold text-green-900 mb-2">✅ Deploy Exitoso!</h3>
                <p className="text-sm text-green-800 mb-3">
                  Tu SaaS está online en:
                </p>
                <Link 
                  href={deployUrl} 
                  target="_blank"
                  className="text-blue-600 hover:underline font-bold"
                >
                  {deployUrl}
                </Link>
                <p className="text-xs text-green-700 mt-3">
                  Próximo paso: Ejecutá <code className="bg-green-100 px-1 rounded">npm run db:push</code> para aplicar el schema
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
