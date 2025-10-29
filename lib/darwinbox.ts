// lib/darwinbox.ts
export async function fetchDarwinboxReport(reportId: string) {
    const username = process.env.DBOX_USERNAME!;
    const password = process.env.DBOX_PASSWORD!;
    const credentials = Buffer.from(`${username}:${password}`).toString("base64");

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Basic ${credentials}`,
    };

    const generateReportApi = process.env.GENERATE_REPORT_API_KEY!;
    const reportDataApi = process.env.REPORT_DATA_API_KEY!;
    const baseUrl = process.env.DBOX_BASE_URL!;

    // Step 1: Generate report
    const generateReportRes = await fetch(`${baseUrl}/reportsbuilderapi/generatereport`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            api_key: generateReportApi,
            report_id: reportId,
        }),
    });

    if (!generateReportRes.ok) {
        throw new Error(`Failed to generate report: ${generateReportRes.statusText}`);
    }

    const generateReportData = await generateReportRes.json();
    const requestId = generateReportData?.response?.request_id;

    if (!requestId) throw new Error("No request_id returned from Darwinbox");

    // Wait 60 seconds before first poll
    await new Promise((resolve) => setTimeout(resolve, 60000));

    // Step 2: Poll function with retry limit
    async function pollReportStatus(retryCount = 0): Promise<any> {
        console.log(`Polling attempt ${retryCount + 1}...`);

        const reportDataRes = await fetch(`${baseUrl}/reportsbuilderapi/reportdatav2`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                api_key: reportDataApi,
                report_id: reportId,
                request_id: requestId,
            }),
        });

        const reportDataJson = await reportDataRes.json();

        const status = reportDataJson.response?.summary?.status;
        console.log(`Status: ${status}`);

        if (status === "IN_PROGRESS" && retryCount < 3) {
            // Wait 60s then retry
            await new Promise((resolve) => setTimeout(resolve, 60000));
            return pollReportStatus(retryCount + 1);
        }

        // If still not done after 3 tries, return error
        if (status === "IN_PROGRESS" && retryCount >= 3) {
            return {
                error: "Report is still in progress after 3 retries. Try again later.",
            };
        }

        return reportDataJson
    }

    const reportData = await pollReportStatus();

    return {
        requestId,
        reportData,
    };
}
