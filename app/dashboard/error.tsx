'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCcw } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full border-red-200 shadow-xl">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-red-100 p-3 rounded-full w-fit mb-4">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl text-red-700">Algo salió mal</CardTitle>
                    <CardDescription>
                        No pudimos cargar el dashboard. Es posible que el sistema se esté reiniciando.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center text-sm text-gray-600 bg-gray-50 py-4 border-y">
                    <p className="font-mono text-xs break-all text-red-500">
                        {error.message || "Unknown error"}
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center pt-6">
                    <Button onClick={() => reset()} className="gap-2 bg-red-600 hover:bg-red-700">
                        <RefreshCcw className="w-4 h-4" />
                        Intentar de nuevo
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
