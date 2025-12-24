import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react"

interface MetricCardProps {
    name: string
    value: number
    unit: string
    status: "good" | "neutral" | "bad"
    description?: string
}

export function MetricCard({ name, value, unit, status, description }: MetricCardProps) {
    const formatValue = (val: number, unit: string) => {
        if (unit === "currency") return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
        if (unit === "percentage") return `${val.toFixed(2)}%`
        return val.toLocaleString()
    }

    const getStatusColor = (s: string) => {
        switch (s) {
            case "good": return "text-green-500"
            case "bad": return "text-red-500"
            default: return "text-gray-500"
        }
    }

    const getStatusIcon = (s: string) => {
        switch (s) {
            case "good": return <ArrowUpIcon className="h-4 w-4 text-green-500" />
            case "bad": return <ArrowDownIcon className="h-4 w-4 text-red-500" />
            default: return <MinusIcon className="h-4 w-4 text-gray-500" />
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {name}
                </CardTitle>
                {getStatusIcon(status)}
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${getStatusColor(status)}`}>
                    {formatValue(value, unit)}
                </div>
                {description && (
                    <p className="text-xs text-muted-foreground">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
