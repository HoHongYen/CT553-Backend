-- CreateTable
CREATE TABLE "payment_methods" (
    "payment_method_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("payment_method_id")
);

-- CreateTable
CREATE TABLE "payment_statuses" (
    "payment_status_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "payment_statuses_pkey" PRIMARY KEY ("payment_status_id")
);

-- CreateTable
CREATE TABLE "payments" (
    "payment_id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentStatusId" INTEGER NOT NULL,
    "payment_method_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("payment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_order_id_key" ON "payments"("order_id");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods"("payment_method_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_paymentStatusId_fkey" FOREIGN KEY ("paymentStatusId") REFERENCES "payment_statuses"("payment_status_id") ON DELETE RESTRICT ON UPDATE CASCADE;
