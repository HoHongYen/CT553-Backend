-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "reply_to_review_id" INTEGER,
ALTER COLUMN "rating" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reply_to_review_id_fkey" FOREIGN KEY ("reply_to_review_id") REFERENCES "reviews"("review_id") ON DELETE SET NULL ON UPDATE CASCADE;
