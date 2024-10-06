-- CreateTable
CREATE TABLE "payment_policies" (
    "payment_policy_id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_policies_pkey" PRIMARY KEY ("payment_policy_id")
);
