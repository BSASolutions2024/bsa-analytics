"use client"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useMemo, useState } from "react"

const chartConfig = {
    wfh: {
        label: "WFH",
        color: "var(--chart-1)",
    },
    onsite: {
        label: "On-Site",
        color: "var(--chart-2)",
    },
    hybrid: {
        label: "Hybrid",
        color: "var(--chart-3)",
    },
} satisfies ChartConfig

interface WorkArrangementLineProps<TData, TValue> {
    data: TData[]
    isLoading: boolean,
}

export default function WorkArrangementLineChart<TData, TValue>({
    data,
    isLoading
}: WorkArrangementLineProps<TData, TValue>) {
    // Get the last two months
    const trendPercentage = useMemo(() => {
        if (!data || data.length === 0) return []
        const prev: any = data[data.length - 2];
        const current: any = data[data.length - 1];

        const overallCombinedTrend = (
            ((current.wfh + current.hybrid + current.onsite) -
                (prev.wfh + prev.hybrid + prev.onsite)) /
            (prev.wfh + prev.hybrid + prev.onsite) * 100
        ).toFixed(2) + '%';

        return overallCombinedTrend
    }, [data])


    return (
        <Card>
            <CardHeader>
                <CardTitle>Work Arrangment Trend</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="w-full h-[200px]">
                    <LineChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            top: 20,
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Line
                            dataKey="onsite"
                            type="monotone"
                            stroke="var(--color-onsite)"
                            strokeWidth={1}
                            dot={{
                                fill: "var(--color-onsite)",
                            }}
                        >
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Line>
                        <Line
                            dataKey="wfh"
                            type="monotone"
                            stroke="var(--color-wfh)"
                            strokeWidth={1}
                            dot={{
                                fill: "var(--color-wfh)",
                            }}
                        >
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Line>
                        <Line
                            dataKey="hybrid"
                            type="monotone"
                            stroke="var(--color-hybrid)"
                            strokeWidth={1}
                            dot={{
                                fill: "var(--color-hybrid)",
                            }}
                        >
                            <LabelList
                                position="bottom"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Line>
                        <ChartLegend
                            content={<ChartLegendContent
                            />}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 leading-none font-medium">
                            Trending up by {trendPercentage} this month <TrendingUp className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}