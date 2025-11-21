"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useMemo } from "react"
import { Skeleton } from "../ui/skeleton"
import { daysBetween, formatDate } from "@/lib/utils"

interface OffboardingCardProps<TData, TValue> {
    data: TData[]
    isLoading: boolean,
}

export function OffboardingAnalyticsCard<TData, TValue>({
    data,
    isLoading,
}: OffboardingCardProps<TData, TValue>) {

    const workflowPercentage = useMemo(() => {
        if (!data || data.length === 0) return 0

        const completedFlowCount = data.filter((i: any) => i.pending_workflow.length == 0).length
        const percentage = (completedFlowCount / data.length) * 100

        return Number(percentage.toFixed(2))
    }, [data])

    // Delayed last pay release count
    const delayedCount = useMemo(() => {
        if (!data || data.length === 0) return 0;

        return data.filter((i: any) => {
            const lastPay = i.date_of_last_pay_release === "No Data" ? formatDate(new Date()) : i.date_of_last_pay_release;
            const diff = daysBetween(lastPay, i.last_working_day);

            // More than 16 days delayed
            return diff * -1 > 16;
        }).length;
    }, [data]);

    return (
        <div className="grid grid-cols-2 gap-4">
            <Card className="h-full min-h-[200px]">
                <CardHeader>
                    <CardTitle className="text-xl font-medium">Workflow Completion Rate</CardTitle>
                    <CardDescription>Percentage rate of the total workflow</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <Skeleton className="h-[70px] w-[200px] rounded-2xl" />
                    ) : (
                        <h1 className="text-6xl font-medium">{workflowPercentage} %</h1>
                    )}
                </CardContent>
            </Card>
            <Card className="h-full min-h-[200px] invisible">

            </Card>
            <Card className="h-full min-h-[200px] visible">
                <CardHeader>
                    <CardTitle className="text-xl font-medium">Delayed Last Pay Release</CardTitle>
                    <CardDescription>Number of employees whose last pay release exceeded 16 days from LWD</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <Skeleton className="h-[70px] w-[200px] rounded-2xl" />
                    ) : (
                        <h1 className="text-6xl font-medium">{delayedCount} </h1>
                    )}
                </CardContent>
            </Card>
            <Card className="h-full min-h-[200px] invisible">

            </Card>
        </div>
    )
}