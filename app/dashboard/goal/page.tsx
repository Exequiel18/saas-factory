"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, Target, Users, Zap } from "lucide-react";
import { useBehavioralTracking } from "@/hooks/use-intuition-tracking";


interface RevenueData {
    current: number;
    goal: number;
    subscribers: number;
    avgRevenue: number;
    growth: number;
}

export default function GoalPage() {
    // [EJECUCIÓN] Tracking intuitivo de microconversiones
    useBehavioralTracking('dashboard/goal');

    const [revenue, setRevenue] = useState<RevenueData>({
        current: 0,
        goal: 20000,
        subscribers: 0,
        avgRevenue: 0,
        growth: 0,
    });

    useEffect(() => {
        // Fetch real revenue data from API
        fetch("/api/stats")
            .then((res) => res.json())
            .then((data) => {
                setRevenue({
                    current: data.totalRevenue || 0,
                    goal: 20000,
                    subscribers: data.activeSubscribers || 0,
                    avgRevenue: data.averageRevenue || 0,
                    growth: data.growthRate || 0,
                });
            })
            .catch(() => {
                // Fallback to mock data
                setRevenue({
                    current: 0,
                    goal: 20000,
                    subscribers: 0,
                    avgRevenue: 0,
                    growth: 0,
                });
            });
    }, []);

    const progressPercentage = (revenue.current / revenue.goal) * 100;
    const remaining = revenue.goal - revenue.current;

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Revenue Goal</h1>
                    <p className="text-muted-foreground mt-2">
                        Track your progress towards $20,000 USD
                    </p>
                </div>
                <Target className="h-12 w-12 text-primary" />
            </div>

            {/* Main Goal Card */}
            <Card className="border-2 border-primary">
                <CardHeader>
                    <CardTitle className="text-2xl">Goal Progress</CardTitle>
                    <CardDescription>Your journey to $20,000 USD</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Current Revenue</span>
                            <span className="font-bold text-2xl text-primary">
                                ${revenue.current.toLocaleString()}
                            </span>
                        </div>
                        <Progress value={progressPercentage} className="h-4" />
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                {progressPercentage.toFixed(1)}% Complete
                            </span>
                            <span className="font-semibold">${revenue.goal.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Remaining</p>
                            <p className="text-2xl font-bold text-orange-600">
                                ${remaining.toLocaleString()}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Estimated Time</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {revenue.growth > 0
                                    ? `${Math.ceil(remaining / revenue.growth)} months`
                                    : "TBD"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{revenue.subscribers}</div>
                        <p className="text-xs text-muted-foreground">
                            Paying customers
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Revenue/User</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${revenue.avgRevenue.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Per subscriber
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${revenue.growth.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Average per month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Action Items */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        Next Steps to Reach Your Goal
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                            <span className="text-primary font-bold">1.</span>
                            <span>
                                <strong>Share your referral code</strong> - Earn $50-$100 per referred subscriber
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary font-bold">2.</span>
                            <span>
                                <strong>Create valuable content</strong> - Use the blog to attract organic traffic
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary font-bold">3.</span>
                            <span>
                                <strong>Optimize conversion</strong> - Test pricing and features to maximize signups
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary font-bold">4.</span>
                            <span>
                                <strong>Engage your users</strong> - Happy customers stay longer and refer others
                            </span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
