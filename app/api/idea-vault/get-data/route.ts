import { prisma } from "@/lib/prisma";
import { daysBetween, extractDate, formatDate } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await prisma.ideaVaultAnalytics.findFirst({
            orderBy: {
                fetchedAt: 'desc', // latest first
            },
        })

        const data = (response?.data as any[] ?? []).map((result: any) => {
            const submittedAtRaw = result?.iv_confirmation?.[0]?.["Form Submitted At"] ?? formatDate(new Date());

            // Extract only the date: "DD-MM-YYYY"
            const submittedAt = extractDate(submittedAtRaw);

            const today = formatDate(new Date()); // should return "DD-MM-YYYY"

            const totalRunningTime =
                result["Custom Flow Overall Status"] === "Completed"
                    ? daysBetween(result['Date'], submittedAt!)
                    : daysBetween(result['Date'], today);
            return {
                date_received: result['Date'],
                status: result["Custom Flow Overall Status"],
                category: result["Category"],
                suggestions: result["My Suggestion(S):"],
                suggestionWouldBenefit: result["My Suggestion(S) Would Benefit:"],
                otherSuggestion: result["Other Comments Or Suggestion(S) Would Benefit:"],
                response: result?.iv_response?.[0]?.["Response To Requester:"] ?? null,
                total_running_time: totalRunningTime,
                decision: result?.iv_response?.[0]?.["Management Decision"] ?? null,
                timeline: result?.iv_confirmation?.[0]?.["Agreed Deadline:"] ?? null,
                department_owner: result["Category"],
                completion_date: submittedAt
            }
        })

        return NextResponse.json({
            success: true,
            fetchedAt: response?.fetchedAt,
            response: data
        });

    } catch (error: any) {
        console.error("Error in fetching:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}