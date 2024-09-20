-- CreateTable
CREATE TABLE "order_statuses" (
    "order_status_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "order_statuses_pkey" PRIMARY KEY ("order_status_id")
);

-- CreateTable
CREATE TABLE "orders" (
    "order_id" SERIAL NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "total_discount" DOUBLE PRECISION NOT NULL,
    "final_price" DOUBLE PRECISION NOT NULL,
    "shipping_fee" DOUBLE PRECISION NOT NULL,
    "buyer_id" INTEGER NOT NULL,
    "delivery_address_id" INTEGER NOT NULL,
    "current_status_id" INTEGER NOT NULL,
    "used_coupon_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "order_trackings" (
    "order_tracking_id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "order_status_id" INTEGER NOT NULL,
    "begin_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finish_at" TIMESTAMP(3),

    CONSTRAINT "order_trackings_pkey" PRIMARY KEY ("order_tracking_id")
);

-- CreateTable
CREATE TABLE "order_details" (
    "order_id" INTEGER NOT NULL,
    "variant_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "order_details_pkey" PRIMARY KEY ("order_id","variant_id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "coupon_id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "discountType" TEXT NOT NULL,
    "discountValue" DOUBLE PRECISION NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "collected_quantity" INTEGER NOT NULL DEFAULT 0,
    "current_use" INTEGER NOT NULL DEFAULT 0,
    "minumin_price_to_use" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("coupon_id")
);

-- CreateTable
CREATE TABLE "account_coupons" (
    "account_id" INTEGER NOT NULL,
    "coupon_id" INTEGER NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_coupons_pkey" PRIMARY KEY ("account_id","coupon_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "order_trackings_order_id_order_status_id_key" ON "order_trackings"("order_id", "order_status_id");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "accounts"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_current_status_id_fkey" FOREIGN KEY ("current_status_id") REFERENCES "order_statuses"("order_status_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_delivery_address_id_fkey" FOREIGN KEY ("delivery_address_id") REFERENCES "addresses"("address_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_used_coupon_id_fkey" FOREIGN KEY ("used_coupon_id") REFERENCES "coupons"("coupon_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_trackings" ADD CONSTRAINT "order_trackings_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_trackings" ADD CONSTRAINT "order_trackings_order_status_id_fkey" FOREIGN KEY ("order_status_id") REFERENCES "order_statuses"("order_status_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_details" ADD CONSTRAINT "order_details_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_details" ADD CONSTRAINT "order_details_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variants"("variant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_coupons" ADD CONSTRAINT "account_coupons_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_coupons" ADD CONSTRAINT "account_coupons_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("coupon_id") ON DELETE RESTRICT ON UPDATE CASCADE;
