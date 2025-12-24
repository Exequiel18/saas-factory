"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Rocket, CheckCircle2, XCircle, Loader2, 
  ExternalLink, Key, Database, Globe
} from "lucide-react"

interface Credential {
  name: string
  description: string
  howToGet: string
  required: boolean
}

interface DeployStatus {
  step: string
  status: 'pending' | 'running' | 'success' | 'error'
  message: string
}

export default function DeployPage() {
  const [credentials, setCredentials] = useState<Record<string, Credential>>({})
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<DeployStatus[]>([])
  const [deploying, setDeploying] = useState(false)

  // Cargar credenciales necesarias
  useEffect(() => {
    fetch('/api/deploy/credentials')
      .then(res => res.json())
      .then(data => {
        if (data.credentials) {
          setCredentials(data.credentials)
        }
      })
  }, [])

  // Cargar estado del deploy
  useEffect(() => {
    if (deploying) {
      const interval = setInterval(() => {
        fetch('/api/deploy/execute')
          .then(res => res.json())
          .then(data => {
            if (data.status) {
              setStatus(data.status)
              if (data.status.some((s: DeployStatus) => s.status === 'success' && s.step === 'Deploy completado')) {
                setDeploying(false)
                clearInterval(interval)
              }
            }
          })
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [deploying])

  const handleSaveCredentials = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/deploy/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success) {
        alert('✅ Credenciales guardadas')
      }
    } catch (error) {
      alert('❌ Error guardando credenciales')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/deploy/verify', { method: 'POST' })
      const data = await res.json()
      if (data.status) {
        setStatus(data.status)
      }
    } catch (error) {
      alert('❌ Error verificando sistema')
    } finally {
      setLoading(false)
    }
  }

  const handleDeploy = async () => {
    if (!confirm('¿Estás seguro de hacer el deploy? Esto va a subir tu código a producción.')) {
      return
    }

    setDeploying(true)
    setStatus([])
    
    try {
      const res = await fetch('/api/deploy/execute', { method: 'POST' })
      const data = await res.json()
      if (data.status) {
        setStatus(data.status)
      }
    } catch (error) {
      alert('❌ Error en deploy')
      setDeploying(false)
    }
  }

  const getStatusIcon = (status: DeployStatus['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'running':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
    }
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2">
            🚀 Deploy Automático
          </h1>
          <p className="text-slate-600">
            El agente central hace el deploy por vos. Solo dale permisos.
          </p>
        </div>

        {/* Credenciales */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Credenciales Necesarias
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(credentials).map(([key, cred]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="flex items-center gap-2">
                  {cred.name}
                  {cred.required && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id={key}
                  type="password"
                  placeholder={cred.description}
                  value={formData[key] || ''}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                />
                <p className="text-xs text-slate-500">
                  {cred.howToGet && (
                    <a 
                      href={cred.howToGet} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      Cómo obtener <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </p>
              </div>
            ))}
            <Button 
              onClick={handleSaveCredentials} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Guardando...' : 'Guardar Credenciales'}
            </Button>
          </CardContent>
        </Card>

        {/* Verificar Sistema */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Verificar Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleVerify} 
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? 'Verificando...' : 'Verificar que Todo Esté Listo'}
            </Button>
          </CardContent>
        </Card>

        {/* Estado del Deploy */}
        {status.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Estado del Deploy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {status.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    {getStatusIcon(s.status)}
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{s.step}</p>
                      <p className="text-sm text-slate-600">{s.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botón de Deploy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              Ejecutar Deploy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              El agente central va a:
            </p>
            <ul className="list-disc list-inside text-sm text-slate-600 mb-4 space-y-1">
              <li>Verificar que todo esté listo</li>
              <li>Conectar con Vercel</li>
              <li>Configurar variables de entorno</li>
              <li>Crear base de datos si es necesario</li>
              <li>Hacer el deploy</li>
              <li>Aplicar schema de base de datos</li>
            </ul>
            <Button 
              onClick={handleDeploy} 
              disabled={deploying || loading}
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
                  Deploy Automático
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

