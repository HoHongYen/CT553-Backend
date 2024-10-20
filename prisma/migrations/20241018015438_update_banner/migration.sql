/*
  Warnings:

  - You are about to drop the `home_banners` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "home_banners" DROP CONSTRAINT "home_banners_image_id_fkey";

-- DropTable
DROP TABLE "home_banners";

-- CreateTable
CREATE TABLE "banner_categories" (
    "banner_category_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banner_categories_pkey" PRIMARY KEY ("banner_category_id")
);

-- CreateTable
CREATE TABLE "banners" (
    "banner_id" SERIAL NOT NULL,
    "image_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "banner_category_id" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("banner_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "banners_banner_category_id_priority_key" ON "banners"("banner_category_id", "priority");

-- AddForeignKey
ALTER TABLE "banners" ADD CONSTRAINT "banners_banner_category_id_fkey" FOREIGN KEY ("banner_category_id") REFERENCES "banner_categories"("banner_category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banners" ADD CONSTRAINT "banners_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "uploaded_images"("image_id") ON DELETE CASCADE ON UPDATE CASCADE;
