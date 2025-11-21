import { fetchDarwinboxReport } from "@/lib/darwinbox";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log("Data Syncing ...")
        const {
            requestId: ideaVaultRequestId,
            reportData: ideaVaultReportData
        } = await fetchDarwinboxReport("4ab43e3b155846");

        const {
            requestId: ideaVaultResponseRequestId,
            reportData: ideaVaultResponseReportData
        } = await fetchDarwinboxReport("e48b794c59a665");

        const {
            requestId: ideaVaultConfirmationRequestId,
            reportData: ideaVaultConfirmationReportData
        } = await fetchDarwinboxReport("cd5b09e1ddcff6");

        const ideaVaultData = ideaVaultReportData?.response?.data
        const ideaVaultResponseData = ideaVaultResponseReportData?.response?.data
        const ideaVaultConfirmationData = ideaVaultConfirmationReportData?.response?.data

        const finalData = ideaVaultData.map((iv: any) => {
            return {
                ...iv,
                iv_response: ideaVaultResponseData.filter((response: any) => response["Custom Flow Request Id"] === iv["Custom Flow Request Id"]),
                iv_confirmation: ideaVaultConfirmationData.filter((response: any) => response["Custom Flow Request Id"] === iv["Custom Flow Request Id"] &&
                    response["Action Taken By"] != "System")
            }
        })

        const res = await prisma.ideaVaultAnalytics.create({
            data: {
                iv_report_request_id: ideaVaultRequestId,
                iv_report_json: ideaVaultReportData,
                iv_response_request_id: ideaVaultResponseRequestId,
                iv_response_json: ideaVaultResponseReportData,
                iv_confirmation_request_id: ideaVaultConfirmationRequestId,
                iv_confirmation_json: ideaVaultConfirmationReportData,
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