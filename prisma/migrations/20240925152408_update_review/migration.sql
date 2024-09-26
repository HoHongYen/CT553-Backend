/*
  Warnings:

  - You are about to drop the column `content` on the `reviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "content";

-- CreateTable
CREATE TABLE "review_images" (
    "product_image_id" SERIAL NOT NULL,
    "image_id" INTEGER NOT NULL,
    "review_id" INTEGER NOT NULL,

    CONSTRAINT "review_images_pkey" PRIMARY KEY ("product_image_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "review_images_image_id_review_id_key" ON "review_images"("image_id", "review_id");

-- AddForeignKey
ALTER TABLE "review_images" ADD CONSTRAINT "review_images_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "uploaded_images"("image_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_images" ADD CONSTRAINT "review_images_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("review_id") ON DELETE CASCADE ON UPDATE CASCADE;
