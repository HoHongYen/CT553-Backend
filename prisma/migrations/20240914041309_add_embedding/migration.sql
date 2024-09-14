-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateTable
CREATE TABLE "product_embeddings" (
    "product_embedding_id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "embedding" vector NOT NULL,

    CONSTRAINT "product_embeddings_pkey" PRIMARY KEY ("product_embedding_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_embeddings_product_id_key" ON "product_embeddings"("product_id");

-- AddForeignKey
ALTER TABLE "product_embeddings" ADD CONSTRAINT "product_embeddings_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
