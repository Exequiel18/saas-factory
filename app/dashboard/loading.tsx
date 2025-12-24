import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="border-b bg-white">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Skeleton className="h-8 w-32" />
                    <div className="flex gap-4">
                        <Skeleton className="h-9 w-24" />
                        <Skeleton className="h-9 w-24" />
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8 space-y-2">
                    <Skeleton className="h-10 w-96" />
                    <Skeleton className="h-5 w-64" />
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i}>
                            <CardHeader className="pb-2">
                                <Skeleton className="h-4 w-32 mb-2" />
                                <Skeleton className="h-8 w-16" />
                            </CardHeader>
                        </Card>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="h-96">
                        <CardHeader>
                            <Skeleton className="h-6 w-48 mb-2" />
                            <Skeleton className="h-4 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-4 border rounded-lg flex justify-between">
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                    <Skeleton className="h-6 w-16" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <Card className="h-96">
                        <CardHeader>
                            <Skeleton className="h-6 w-48 mb-2" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
