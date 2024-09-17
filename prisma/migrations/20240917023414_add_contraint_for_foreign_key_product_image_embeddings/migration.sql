-- DropForeignKey
ALTER TABLE "product_embeddings" DROP CONSTRAINT "product_embeddings_product_id_fkey";

-- DropForeignKey
ALTER TABLE "product_image_embeddings" DROP CONSTRAINT "product_image_embeddings_image_id_fkey";

-- DropForeignKey
ALTER TABLE "product_image_embeddings" DROP CONSTRAINT "product_image_embeddings_product_id_fkey";

-- AddForeignKey
ALTER TABLE "product_embeddings" ADD CONSTRAINT "product_embeddings_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_image_embeddings" ADD CONSTRAINT "product_image_embeddings_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_image_embeddings" ADD CONSTRAINT "product_image_embeddings_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "uploaded_images"("image_id") ON DELETE CASCADE ON UPDATE CASCADE;
