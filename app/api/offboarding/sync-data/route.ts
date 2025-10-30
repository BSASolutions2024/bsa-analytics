import { fetchDarwinboxReport } from "@/lib/darwinbox";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const {
            requestId: offboardingRequestId,
            reportData: offboardingReportData
        } = await fetchDarwinboxReport("acea2a8ece2661");

        const {
            requestId: workflowRequestId,
            reportData: workflowReportData
        } = await fetchDarwinboxReport("f61b962cec34a2")

        const offboardingData = offboardingReportData?.response?.data
        const workflowData = workflowReportData?.response?.data

        const finalData = offboardingData.map((data: any) => {
            return {
                ...data,
                workflow_report: workflowData.filter((workflow: any) => workflow["Employee Id"] === data["Employee Id"])
            }
        })

        const res = await prisma.offboardingAnalytics.create({
            data: {
                offboarding_report_request_id: offboardingRequestId,
                offboarding_report_json: offboardingReportData,
                workflow_report_request_id: workflowRequestId,
                workflow_report_json: workflowReportData,
                data: finalData
            }
        })
        return NextResponse.json({
            success: true,
            res
        });
    } catch (error: any) {
        console.error("Darwinbox error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}