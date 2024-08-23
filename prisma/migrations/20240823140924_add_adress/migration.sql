/*
  Warnings:

  - You are about to drop the column `isGoogleLogin` on the `accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "isGoogleLogin",
ADD COLUMN     "is_google_login" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "addresses" (
    "address_id" SERIAL NOT NULL,
    "province_name" TEXT NOT NULL,
    "province_id" INTEGER NOT NULL,
    "district_name" TEXT NOT NULL,
    "district_id" INTEGER NOT NULL,
    "ward_name" TEXT NOT NULL,
    "ward_code" TEXT NOT NULL,
    "contact_name" TEXT NOT NULL,
    "contact_phone" TEXT NOT NULL,
    "detail_address" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "account_id" INTEGER NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("address_id")
);

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("account_id") ON DELETE RESTRICT ON UPDATE CASCADE;
