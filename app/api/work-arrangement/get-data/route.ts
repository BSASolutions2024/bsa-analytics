import { prisma } from "@/lib/prisma";
import { ApiReportResponse } from "@/lib/types";
import { allMonthsFrom, isSameMonth, monthNames, parseDMY } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    try {
        const res = await prisma.workArrangementAnalytics.findFirst({
            orderBy: {
                fetchedAt: 'desc', // latest first
            },
        })

        const filterByDateRange = (data: any, from: string, to: string) => {
            return Object.fromEntries(
                Object.entries(data).filter(([date]) => date >= from && date <= to)
            );
        };

        const result = filterByDateRange(res?.data, "2025-01", "2025-12");

        const convertToChartData = (data: any) => {
            return Object.entries(data).map(([ym, stats]: any) => {
                const [year, month] = ym.split("-");
                const monthIndex = Number(month) - 1;

                return {
                    month: monthNames[monthIndex],
                    wfh: stats.WFH,
                    hybrid: stats.Hybrid,
                    onsite: stats["Work On-site"],
                };
            });
        };

        const chartData = convertToChartData(result);

        return NextResponse.json({
            success: true,
            fetchedAt: res?.fetchedAt,
            response: res?.data,
            filtered: chartData
        })

    } catch (error: any) {
        console.error("Darwinbox error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}