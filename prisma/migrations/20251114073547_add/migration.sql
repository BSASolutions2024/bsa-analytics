-- CreateTable
CREATE TABLE "WorkArrangementAnalytics" (
    "id" UUID NOT NULL,
    "work_arrangement_report_request_id" TEXT NOT NULL,
    "work_arrangement_report_json" JSONB NOT NULL,
    "change_arrangement_report_request_id" TEXT NOT NULL,
    "change_arrangement_report_request_json" JSONB NOT NULL,
    "data" JSONB NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkArrangementAnalytics_pkey" PRIMARY KEY ("id")
);
