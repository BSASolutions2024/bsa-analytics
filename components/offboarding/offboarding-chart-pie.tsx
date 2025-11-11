"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart"
import { separationColorMap } from "@/lib/utils"
import { Label, Pie, PieChart } from "recharts"
import { Skeleton } from "../ui/skeleton"

const chartConfig = {
    count: {
        label: "Count",
    },
    voluntary: {
        label: "Voluntary",
        color: "var(--chart-1)",
    },
    involuntary: {
        label: "Involuntary",
        color: "var(--chart-2)",
    },
    transfer: {
        label: "Transfer",
        color: "var(--chart-3)",
    },
} satisfies ChartConfig

interface OffboardingPieProps<TData, TValue> {
    data: TData[]
    isLoading: boolean,
}

export function OffboardingChartPieInteractive<TData, TValue>({
    data,
    isLoading,
}: OffboardingPieProps<TData, TValue>) {

    // ✅ Define your target categories (always included)
    const baseCategories = ["voluntary", "involuntary", "transfer"]


    const separationCategory = useMemo(() => {
        if (!data || data.length === 0) return []

        const counts = data.reduce((acc: any, curr: any) => {
            const category = curr.separation_category?.toLowerCase()?.trim() || "unassigned"
            acc[category] = (acc[category] || 0) + 1
            return acc
        }, {})

        return baseCategories.map((category) => ({
            separation_category: category,
            count: counts[category] || 0,
            fill: separationColorMap[category],
        }))
    }, [data])


    return (
        <Card className="flex flex-col">
            <CardHeader className="flex-row items-start space-y-0 pb-0">
                <div className="grid gap-1">
                    <CardTitle>Separation Category</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex flex-1 justify-center pb-0 min-h-[250px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-8">
                        <Skeleton className="h-[200px] w-[200px] rounded-full" />
                        <div className="flex flex-row gap-4">
                            <Skeleton className="h-5 w-[100px]" />
                            <Skeleton className="h-5 w-[100px]" />
                            <Skeleton className="h-5 w-[100px]" />
                        </div>
                    </div>
                ) : data.length === 0 ? (
                    <p className="text-muted-foreground text-center mt-8">
                        No separation records found.
                    </p>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square w-full max-w-[300px] min-h-[200px]"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={separationCategory}
                                dataKey="count"
                                nameKey="separation_category"
                                innerRadius={60}
                                strokeWidth={5}
                            >
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-foreground text-3xl font-bold"
                                                    >
                                                        {data.length.toLocaleString()}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 24}
                                                        className="fill-muted-foreground"
                                                    >
                                                        Total Separation
                                                    </tspan>
                                                </text>
                                            )
                                        }
                                    }}
                                />
                            </Pie>

                            <ChartLegend
                                content={<ChartLegendContent
                                />}
                            />
                        </PieChart>
                    </ChartContainer>
                )}
            </CardContent>

        </Card>
    )
}