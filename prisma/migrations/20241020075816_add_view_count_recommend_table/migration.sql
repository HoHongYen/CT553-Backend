-- CreateTable
CREATE TABLE "view_count_recommendations" (
    "view_count_recommendation_id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "view_count_recommendations_pkey" PRIMARY KEY ("view_count_recommendation_id")
);

-- AddForeignKey
ALTER TABLE "view_count_recommendations" ADD CONSTRAINT "view_count_recommendations_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "view_count_recommendations" ADD CONSTRAINT "view_count_recommendations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;
