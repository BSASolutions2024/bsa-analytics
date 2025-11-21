import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
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
                employee_id: result["Employee Id"],
                employee_name: result["Employee Name"],
                separation_category: result["Final Separation Category"],
                separation_reason: result["Final Separation Reason"],
                client_name: result["Client Name Cost Center Name"],
                department_manager: result["Direct Manager Name"],
                sla: result["SLA"],
                last_working_day: result["Final Last Working Day"],
                date_of_initiation: result["Date Of Initiation"],
                completed_workflow,
                pending_workflow,
                date_of_last_pay_release: dateOfLastPay["Task Status"] === "Completed" ? dateOfLastPay["Task Completion Date"] : "No Data"
            }
        }).sort((a, b) => {
            const parseDate = (d: string) => {
                if (!d) return 0;
                const [day, month, year] = d.split("-");
                return new Date(`${year}-${month}-${day}`).getTime();
            };

            return parseDate(b.last_working_day) - parseDate(a.last_working_day);
        });

        return NextResponse.json({
            success: true,
            fetchedAt: response?.fetchedAt,
            response: tableData
        });
    } catch (error: any) {
        console.error("Error in fetching:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}