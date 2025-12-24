"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Rocket, CheckCircle2, XCircle, Loader2 } from "lucide-react"

export default function ForzarDeployPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleDeploy = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/vercel/force-deploy', {
        method: 'POST'
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto pt-20">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-black flex items-center gap-3">
              <Rocket className="h-8 w-8 text-amber-400" />
              Forzar Deploy en Vercel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
              <h3 className="font-black text-xl mb-4">Información del Deploy</h3>
              <div className="space-y-2 text-slate-300">
                <p><span className="font-bold">Proyecto:</span> saas-factory-antigravity</p>
                <p><span className="font-bold">Branch:</span> nuevo-diseno</p>
                <p><span className="font-bold">Repo:</span> Exequiel18/saas-factory</p>
              </div>
            </div>

            <Button
              onClick={handleDeploy}
              disabled={loading}
              size="lg"
              className="w-full h-16 text-xl font-black bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                  Forzando Deploy...
                </>
              ) : (
                <>
                  <Rocket className="h-6 w-6 mr-3" />
                  Forzar Deploy Ahora
                </>
              )}
            </Button>

            {result && (
              <div className={`p-6 rounded-xl border-2 ${
                result.success 
                  ? 'bg-green-900/30 border-green-500' 
                  : 'bg-red-900/30 border-red-500'
              }`}>
                <div className="flex items-start gap-4">
                  {result.success ? (
                    <CheckCircle2 className="h-8 w-8 text-green-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-400 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h3 className={`font-black text-xl mb-3 ${
                      result.success ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {result.success ? 'Deployment Iniciado' : 'Error'}
                    </h3>
                    
                    {result.success ? (
                      <div className="space-y-3 text-slate-300">
                        <p><span className="font-bold">URL:</span> {result.deployment?.url}</p>
                        <p><span className="font-bold">Branch:</span> {result.deployment?.branch}</p>
                        <p><span className="font-bold">Estado:</span> {result.deployment?.state}</p>
                        <p className="pt-4 text-green-400 font-bold">
                          ⏳ Esperá 2-3 minutos para que termine el build
                        </p>
                        <p className="text-sm text-slate-400">
                          Podés ver el progreso en: <a href={result.vercelUrl} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">Vercel Dashboard</a>
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 text-red-300">
                        <p className="font-bold">{result.error}</p>
                        {result.details && (
                          <pre className="text-xs bg-black/50 p-4 rounded overflow-auto">
                            {typeof result.details === 'string' ? result.details : JSON.stringify(result.details, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-amber-900/20 border border-amber-500/30 p-6 rounded-xl">
              <h3 className="font-black text-amber-400 mb-3">💡 Nota</h3>
              <p className="text-slate-300 text-sm">
                Este deploy forzará que Vercel use el branch <span className="font-bold">nuevo-diseno</span> que contiene 
                el nuevo diseño de "Chequeo Real de Negocio". Después del deploy, la web en 
                <span className="font-bold"> https://saas-factory-antigravity.vercel.app</span> mostrará el nuevo diseño.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

