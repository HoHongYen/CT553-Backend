-- CreateTable
CREATE TABLE "rating_recommendations" (
    "rating_recommendation_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "rating_recommendations_pkey" PRIMARY KEY ("rating_recommendation_id")
);

-- AddForeignKey
ALTER TABLE "rating_recommendations" ADD CONSTRAINT "rating_recommendations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "accounts"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating_recommendations" ADD CONSTRAINT "rating_recommendations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;
