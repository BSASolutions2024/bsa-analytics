"use client"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
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

const chartData = [
    { month: "January", wfh: 186, onsite: 80, hybrid: 80},
    { month: "February", wfh: 305, onsite: 200, hybrid: 80 },
    { month: "March", wfh: 237, onsite: 120, hybrid: 80 },
    { month: "April", wfh: 73, onsite: 190, hybrid: 80 },
    { month: "May", wfh: 209, onsite: 130, hybrid: 80 },
    { month: "June", wfh: 214, onsite: 140, hybrid: 80 },
]
const chartConfig = {
    wfh: {
        label: "Work From Home",
        color: "var(--chart-1)",
    },
    onsite: {
        label: "On-Site",
        color: "var(--chart-2)",
    },
    hybrid: {
        label: "On-Site",
        color: "var(--chart-3)",
    },
} satisfies ChartConfig

export default function WorkArrangementLineChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Work Arrangment Trend</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="w-full h-[200px]">
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
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
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            dataKey="wfh"
                            type="monotone"
                            stroke="var(--color-wfh)"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            dataKey="hybrid"
                            type="monotone"
                            stroke="var(--color-hybrid)"
                            strokeWidth={2}
                            dot={false}
                        />
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
                            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="text-muted-foreground flex items-center gap-2 leading-none">
                            Showing total visitors for the last 6 months
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}