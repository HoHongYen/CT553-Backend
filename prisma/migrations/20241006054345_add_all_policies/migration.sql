-- CreateTable
CREATE TABLE "delivery_policies" (
    "delivery_policy_id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "delivery_policies_pkey" PRIMARY KEY ("delivery_policy_id")
);

-- CreateTable
CREATE TABLE "check_product_policies" (
    "check_product_policy_id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "check_product_policies_pkey" PRIMARY KEY ("check_product_policy_id")
);

-- CreateTable
CREATE TABLE "return_policies" (
    "return_policy_id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "return_policies_pkey" PRIMARY KEY ("return_policy_id")
);

-- CreateTable
CREATE TABLE "warranty_policies" (
    "warranty_policy_id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warranty_policies_pkey" PRIMARY KEY ("warranty_policy_id")
);

-- CreateTable
CREATE TABLE "security_policies" (
    "security_policy_id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "security_policies_pkey" PRIMARY KEY ("security_policy_id")
);
