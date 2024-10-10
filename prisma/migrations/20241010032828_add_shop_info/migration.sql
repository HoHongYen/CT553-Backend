-- CreateTable
CREATE TABLE "shop_infos" (
    "shop_info_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "logo_id" INTEGER NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "business_code" TEXT NOT NULL,
    "working_time" TEXT NOT NULL,
    "province_name" TEXT NOT NULL,
    "province_id" INTEGER NOT NULL,
    "district_name" TEXT NOT NULL,
    "district_id" INTEGER NOT NULL,
    "ward_name" TEXT NOT NULL,
    "ward_code" TEXT NOT NULL,
    "detail_address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shop_infos_pkey" PRIMARY KEY ("shop_info_id")
);

-- AddForeignKey
ALTER TABLE "shop_infos" ADD CONSTRAINT "shop_infos_logo_id_fkey" FOREIGN KEY ("logo_id") REFERENCES "uploaded_images"("image_id") ON DELETE CASCADE ON UPDATE CASCADE;
