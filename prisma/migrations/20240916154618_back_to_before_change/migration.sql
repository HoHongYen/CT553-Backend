-- CreateTable
CREATE TABLE "product_discounts" (
    "product_discount_id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "discount_type" TEXT NOT NULL,
    "discount_value" DOUBLE PRECISION NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_discounts_pkey" PRIMARY KEY ("product_discount_id")
);

-- CreateTable
CREATE TABLE "product_image_embeddings" (
    "product_image_embedding_id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "image_id" INTEGER NOT NULL,
    "embedding" vector NOT NULL,

    CONSTRAINT "product_image_embeddings_pkey" PRIMARY KEY ("product_image_embedding_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_image_embeddings_image_id_key" ON "product_image_embeddings"("image_id");

-- AddForeignKey
ALTER TABLE "product_discounts" ADD CONSTRAINT "product_discounts_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_image_embeddings" ADD CONSTRAINT "product_image_embeddings_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_image_embeddings" ADD CONSTRAINT "product_image_embeddings_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "uploaded_images"("image_id") ON DELETE RESTRICT ON UPDATE CASCADE;
