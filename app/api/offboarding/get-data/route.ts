import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const response = await prisma.offboardingAnalytics.findFirst({
            orderBy: {
                fetchedAt: 'desc', // latest first
            },
        })

        const tableData = (response?.data as any[] ?? []).map((result: any) => {
            const completed_workflow = result?.workflow_report.filter((wr: any) => wr["Task Status"] === "Completed").map((wr: any) => wr["Task Name"]);
            const pending_workflow = result?.workflow_report.filter((wr: any) => wr["Task Status"] != "Completed").map((wr: any) => wr["Task Name"]);
            const dateOfLastPay = result?.workflow_report.find((wr: any) => wr["Task Name"] === "Full and Final Settlement")
            return {
                name: result["Employee Name"],
                department_manager: result["Direct Manager Name"],
                sla: result["SLA"],
                last_working_day: result["Final Last Working Day"],
                date_of_initiation: result["Date Of Initiation"],
                completed_workflow,
                pending_workflow,
                date_of_last_pay_release: dateOfLastPay["Task Status"] === "Completed" ? dateOfLastPay["Task Completion Date"] : "No Data"
            }
        })


        return NextResponse.json({
            success: true,
            response: tableData
        });
    } catch (error: any) {
        console.error("Error in fetching:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}