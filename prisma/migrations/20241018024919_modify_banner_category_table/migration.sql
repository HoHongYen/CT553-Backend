/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `banner_categories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "banner_categories_name_key" ON "banner_categories"("name");
