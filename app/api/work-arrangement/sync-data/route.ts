import { fetchDarwinboxReport } from "@/lib/darwinbox";
import { prisma } from "@/lib/prisma";
import { allMonthsFrom, isSameMonth, parseDMY } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log("Work Arrangement Data Syncing ...")
        const {
            requestId: workArrangementRequestId,
            reportData: workArrangementReportData
        } = await fetchDarwinboxReport("5afd08e4d7daf4");
        const {
            requestId: changeArrangementRequestId,
            reportData: changeArrangementReportData
        } = await fetchDarwinboxReport("28d7cbd0ae2d4d");

        const workArrangementData = workArrangementReportData?.response?.data
        const changeArrangementData = changeArrangementReportData?.response?.data

        const monthlyTrend: any = {};

        // Normalize employees
        const employees = workArrangementData.map((e: any) => ({
            id: e["Employee Id"],
            name: e["Full Name"],
            joinDate: parseDMY(e["Date Of Joining"]),
            initialArrangement: e["Base Work Arrangement"] || e["Current Work Arrangement"] || "Onsite"
        }));

        // Normalize change requests
        const changes = changeArrangementData.map((c: any) => ({
            employeeId: c["Subject Employee Id"],
            date: c["Initation Date"],
            // ⚠️ You MUST map this based on actual request type (Hybrid? WFH?)
            // For now assuming Hybrid/WFH requests always become Hybrid
            newArrangement: c["Current Work Arrangement"]
        }));

        // Build trend month-by-month
        employees.forEach((emp: any) => {
            let currentArrangement = emp.initialArrangement;

            const months = allMonthsFrom(emp.joinDate, new Date());

            months.forEach(month => {
                // Check if request happened this month
                const change = changes.find((c: any) =>
                    c.employeeId === emp.id && isSameMonth(c.date, month)
                );

                if (change) {
                    currentArrangement = change.newArrangement;
                }

                // Add to trend record
                if (!monthlyTrend[month]) {
                    monthlyTrend[month] = {
                        WFH: 0,
                        Hybrid: 0,
                        "Work On-site": 0
                    };
                }

                monthlyTrend[month][currentArrangement]++;
            });
        });

        const res = await prisma.workArrangementAnalytics.create({
            data: {
                work_arrangement_report_request_id: workArrangementRequestId,
                work_arrangement_report_json: workArrangementReportData,
                change_arrangement_report_request_id: changeArrangementRequestId,
                change_arrangement_report_request_json: changeArrangementReportData,
                data: monthlyTrend
            }
        })

        return NextResponse.json({ success: true, res })
    } catch (error: any) {
        console.error("Darwinbox error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}