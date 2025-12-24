"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Download, FileText, CreditCard } from "lucide-react"

interface Payment {
    id: string
    amount: number
    currency: string
    status: string
    createdAt: string
    paymentMethod: string
}

interface Invoice {
    id: string
    number: string
    issuedAt: string
    totalAmount: number
    currency: string
    pdfUrl?: string
}

interface PaymentHistoryProps {
    organizationId: string
}

export function PaymentHistory({ organizationId }: PaymentHistoryProps) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<{ payments: Payment[]; invoices: Invoice[] }>({ payments: [], invoices: [] })

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`/api/billing/history?organizationId=${organizationId}`)
                if (!response.ok) throw new Error("Failed to fetch history")
                const result = await response.json()
                setData(result)
            } catch (error) {
                console.error("Error fetching billing history:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [organizationId])

    const downloadInvoice = async (invoiceId: string, number: string) => {
        try {
            const response = await fetch(`/api/billing/invoice/${invoiceId}/download`)
            if (!response.ok) throw new Error("Download failed")

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `${number}.pdf`
            document.body.appendChild(a)
            a.click()
            a.remove()
        } catch (error) {
            console.error("Error downloading invoice:", error)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Invoices Section */}
            <Card className="bg-[#0a0f1e] border-white/5 backdrop-blur-3xl">
                <CardHeader>
                    <CardTitle className="text-xl font-black uppercase italic italic flex items-center gap-2">
                        <FileText className="w-5 h-5 text-cyan-400" />
                        Facturas Recientes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {data.invoices.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No hay facturas disponibles aún.</p>
                    ) : (
                        <div className="space-y-4">
                            {data.invoices.map((invoice) => (
                                <div key={invoice.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-white/5 text-gray-400">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold uppercase tracking-tight">{invoice.number}</p>
                                            <p className="text-xs text-gray-500">{new Date(invoice.issuedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="font-black">{invoice.totalAmount.toFixed(2)} {invoice.currency}</p>
                                        </div>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="rounded-full hover:bg-cyan-500/20 hover:text-cyan-400"
                                            onClick={() => downloadInvoice(invoice.id, invoice.number)}
                                        >
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Payments Section */}
            <Card className="bg-[#0a0f1e] border-white/5 backdrop-blur-3xl">
                <CardHeader>
                    <CardTitle className="text-xl font-black uppercase italic italic flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-cyan-400" />
                        Historial de Pagos
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {data.payments.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No se han registrado pagos todavía.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5 text-xs font-black uppercase tracking-widest text-gray-500">
                                        <th className="pb-4 pt-0">ID / Fecha</th>
                                        <th className="pb-4 pt-0">Método</th>
                                        <th className="pb-4 pt-0">Estado</th>
                                        <th className="pb-4 pt-0 text-right">Importe</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {data.payments.map((payment) => (
                                        <tr key={payment.id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="py-4">
                                                <p className="font-bold text-sm">#{payment.id.slice(-6).toUpperCase()}</p>
                                                <p className="text-[10px] text-gray-500">{new Date(payment.createdAt).toLocaleString()}</p>
                                            </td>
                                            <td className="py-4">
                                                <Badge variant="outline" className="text-[10px] uppercase font-black border-white/10 text-gray-400">
                                                    {payment.paymentMethod}
                                                </Badge>
                                            </td>
                                            <td className="py-4">
                                                <Badge className={`text-[10px] font-black uppercase ${payment.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                        payment.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                            'bg-red-500/10 text-red-500 border-red-500/20'
                                                    }`}>
                                                    {payment.status}
                                                </Badge>
                                            </td>
                                            <td className="py-4 text-right">
                                                <p className="font-black text-white">{payment.amount.toFixed(2)} {payment.currency}</p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
