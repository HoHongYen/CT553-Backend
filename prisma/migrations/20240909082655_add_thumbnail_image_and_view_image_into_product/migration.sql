/*
  Warnings:

  - You are about to drop the column `avatarId` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `paymentStatusId` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[avatar_id]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[thumbnail_image_id]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[view_image_id]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `payment_status_id` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail_image_id` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `view_image_id` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_avatarId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_paymentStatusId_fkey";

-- DropIndex
DROP INDEX "accounts_avatarId_key";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "avatarId",
ADD COLUMN     "avatar_id" INTEGER;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "paymentStatusId",
ADD COLUMN     "payment_status_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "thumbnail_image_id" INTEGER NOT NULL,
ADD COLUMN     "view_image_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "accounts_avatar_id_key" ON "accounts"("avatar_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_thumbnail_image_id_key" ON "products"("thumbnail_image_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_view_image_id_key" ON "products"("view_image_id");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "uploaded_images"("image_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_thumbnail_image_id_fkey" FOREIGN KEY ("thumbnail_image_id") REFERENCES "uploaded_images"("image_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_view_image_id_fkey" FOREIGN KEY ("view_image_id") REFERENCES "uploaded_images"("image_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_payment_status_id_fkey" FOREIGN KEY ("payment_status_id") REFERENCES "payment_statuses"("payment_status_id") ON DELETE RESTRICT ON UPDATE CASCADE;
