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
                    ):(
                        <h1 className="text-6xl font-medium">{workflowPercentage} %</h1>
                    )}
                </CardContent>
            </Card>
            <Card className="h-full min-h-[200px] invisible">

            </Card>
            <Card className="h-full min-h-[200px] invisible">

            </Card>
            <Card className="h-full min-h-[200px] invisible">

            </Card>
        </div>
    )
}