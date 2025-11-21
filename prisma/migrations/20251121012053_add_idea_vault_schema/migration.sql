-- CreateTable
CREATE TABLE "IdeaVaultAnalytics" (
    "id" UUID NOT NULL,
    "iv_report_request_id" TEXT NOT NULL,
    "iv_report_json" JSONB NOT NULL,
    "iv_response_request_id" TEXT NOT NULL,
    "iv_response_json" JSONB NOT NULL,
    "data" JSONB NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IdeaVaultAnalytics_pkey" PRIMARY KEY ("id")
);
