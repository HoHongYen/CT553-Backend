-- CreateTable
CREATE TABLE "uploaded_images" (
    "image_id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "uploaded_images_pkey" PRIMARY KEY ("image_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uploaded_images_filename_key" ON "uploaded_images"("filename");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "uploaded_images"("image_id") ON DELETE SET NULL ON UPDATE CASCADE;
