/*
  Warnings:

  - You are about to drop the column `user_id` on the `rating_recommendations` table. All the data in the column will be lost.
  - Added the required column `account_id` to the `rating_recommendations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "rating_recommendations" DROP CONSTRAINT "rating_recommendations_user_id_fkey";

-- AlterTable
ALTER TABLE "rating_recommendations" DROP COLUMN "user_id",
ADD COLUMN     "account_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "rating_recommendations" ADD CONSTRAINT "rating_recommendations_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;
