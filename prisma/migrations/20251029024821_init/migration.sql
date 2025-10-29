-- CreateTable
CREATE TABLE "OffboardingAnalytic" (
    "id" UUID NOT NULL,
    "source" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OffboardingAnalytic_pkey" PRIMARY KEY ("id")
);
