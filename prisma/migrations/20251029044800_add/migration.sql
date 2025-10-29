/*
  Warnings:

  - You are about to drop the `OffboardingAnalytic` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."OffboardingAnalytic";

-- CreateTable
CREATE TABLE "OffboardingAnalytics" (
    "id" UUID NOT NULL,
    "source" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "offboarding_report_request_id" TEXT NOT NULL,
    "offboarding_report_json" JSONB NOT NULL,
    "workflow_report_request_id" TEXT NOT NULL,
    "workflow_report_json" JSONB NOT NULL,
    "data" JSONB NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OffboardingAnalytics_pkey" PRIMARY KEY ("id")
);
