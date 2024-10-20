-- CreateTable
CREATE TABLE "home_banners" (
    "home_banner_id" SERIAL NOT NULL,
    "image_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_banners_pkey" PRIMARY KEY ("home_banner_id")
);

-- AddForeignKey
ALTER TABLE "home_banners" ADD CONSTRAINT "home_banners_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "uploaded_images"("image_id") ON DELETE CASCADE ON UPDATE CASCADE;
