"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Zap, TrendingUp, Brain, Clock } from 'lucide-react'
import { useBehavioralTracking } from '@/hooks/use-intuition-tracking'

export default function LifetimeDealPage() {
    const intent = useBehavioralTracking('lifetime-deal')
    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 30 })
    const [spotsLeft, setSpotsLeft] = useState(247)

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
                if (prev.minutes > 0) return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 }
                if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
                return prev
            })
        }, 1000)

        const spotsTimer = setInterval(() => {
            if (Math.random() > 0.7) setSpotsLeft(prev => Math.max(100, prev - 1))
        }, 30000)

        return () => {
            clearInterval(timer)
            clearInterval(spotsTimer)
        }
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="container mx-auto px-4 py-16">
                {/* Hero */}
                <div className="text-center mb-16">
                    <div className="inline-block bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full mb-4 animate-pulse">
                        🔥 LIMITED TIME OFFER - Only {spotsLeft} spots left
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                        Lifetime Access
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-600">
                            $149 One-Time
                        </span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Get lifetime access to our autonomous SaaS platform that reads user psychology
                        and generates revenue while you sleep.
                    </p>

                    {/* Countdown */}
                    <div className="flex justify-center gap-4 mb-8">
                        <div className="bg-slate-800 px-6 py-4 rounded-lg">
                            <div className="text-3xl font-bold text-white">{timeLeft.hours}</div>
                            <div className="text-sm text-gray-400">Hours</div>
                        </div>
                        <div className="bg-slate-800 px-6 py-4 rounded-lg">
                            <div className="text-3xl font-bold text-white">{timeLeft.minutes}</div>
                            <div className="text-sm text-gray-400">Minutes</div>
                        </div>
                        <div className="bg-slate-800 px-6 py-4 rounded-lg">
                            <div className="text-3xl font-bold text-white">{timeLeft.seconds}</div>
                            <div className="text-sm text-gray-400">Seconds</div>
                        </div>
                    </div>

                    <Button
                        size="lg"
                        className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white px-12 py-6 text-xl"
                        onClick={() => window.location.href = '/pricing?plan=lifetime'}
                    >
                        🚀 Claim Your Lifetime Deal
                    </Button>
                    <p className="text-sm text-gray-400 mt-4">
                        Regular price: $360/year • You save: $211 (58% off)
                    </p>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                            <Brain className="h-12 w-12 text-purple-400 mb-4" />
                            <CardTitle className="text-white">Behavioral Psychology</CardTitle>
                            <CardDescription>Reads user intent with 85%+ accuracy</CardDescription>
                        </CardHeader>
                        <CardContent className="text-gray-300">
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2">
                                    <Check className="h-5 w-5 text-green-400 mt-0.5" />
                                    <span>Detects purchase intent in real-time</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="h-5 w-5 text-green-400 mt-0.5" />
                                    <span>Converts 3x better than normal SaaS</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                            <Zap className="h-12 w-12 text-orange-400 mb-4" />
                            <CardTitle className="text-white">6 Autonomous Agents</CardTitle>
                            <CardDescription>Work 24/7 optimizing revenue</CardDescription>
                        </CardHeader>
                        <CardContent className="text-gray-300">
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2">
                                    <Check className="h-5 w-5 text-green-400 mt-0.5" />
                                    <span>Revenue optimizer</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="h-5 w-5 text-green-400 mt-0.5" />
                                    <span>Creative intuition (generates ideas)</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                            <TrendingUp className="h-12 w-12 text-green-400 mb-4" />
                            <CardTitle className="text-white">Predictive Analytics</CardTitle>
                            <CardDescription>Forecasts revenue and prevents churn</CardDescription>
                        </CardHeader>
                        <CardContent className="text-gray-300">
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2">
                                    <Check className="h-5 w-5 text-green-400 mt-0.5" />
                                    <span>Predicts churn 15 days early</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="h-5 w-5 text-green-400 mt-0.5" />
                                    <span>Dynamic pricing optimization</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Social Proof */}
                <div className="text-center mb-16">
                    <p className="text-gray-400 mb-4">Join 1,247 founders who already claimed their lifetime deal</p>
                    <div className="flex justify-center gap-1 flex-wrap max-w-2xl mx-auto">
                        {[...Array(50)].map((_, i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-600" />
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center bg-gradient-to-r from-orange-500/20 to-pink-600/20 border border-orange-500/50 rounded-2xl p-12">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Don&apos;t Miss This Opportunity
                    </h2>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                        This lifetime deal won&apos;t last forever. Once we hit 500 users,
                        we&apos;re switching to monthly pricing at $29.99/month.
                    </p>
                    <Button
                        size="lg"
                        className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white px-12 py-6 text-xl"
                        onClick={() => window.location.href = '/pricing?plan=lifetime'}
                    >
                        🔥 Get Lifetime Access Now - $149
                    </Button>
                </div>
            </div>
        </div>
    )
}
