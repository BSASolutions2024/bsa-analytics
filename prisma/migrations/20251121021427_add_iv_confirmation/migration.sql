/*
  Warnings:

  - Added the required column `iv_confirmation_json` to the `IdeaVaultAnalytics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iv_confirmation_request_id` to the `IdeaVaultAnalytics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IdeaVaultAnalytics" ADD COLUMN     "iv_confirmation_json" JSONB NOT NULL,
ADD COLUMN     "iv_confirmation_request_id" TEXT NOT NULL;
