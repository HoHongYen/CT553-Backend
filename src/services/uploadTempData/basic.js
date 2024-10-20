const prisma = require("../../config/prismaClient");
const { AWAITING_CONFIRM, AWAITING_FULFILLMENT, DELIVERING, DELIVERED, CANCELED, RETURNED } = require("../../constant/orderStatus");
const { PENDING, SUCCESS, FAILED } = require("../../constant/paymentStatus");

async function uploadRoles() {
    // delete all roles
    await prisma.role.createMany({
        data: [
            { role: "ADMIN" },
            { role: "EMPLOYEE" },
            { role: "USER" },
        ]
    });
}

async function uploadPaymentMethods() {
    await prisma.paymentMethod.createMany({
        data: [
            { name: "COD" },
            { name: "VNPAY" },
        ]
    });
}

async function uploadPaymentStatuses() {
    await prisma.paymentStatus.createMany({
        data: [
            { name: PENDING },
            { name: SUCCESS },
            { name: FAILED },
        ]
    });
}

async function uploadOrderStatuses() {
    await prisma.orderStatus.createMany({
        data: [
            { name: AWAITING_CONFIRM },
            { name: AWAITING_FULFILLMENT },
            { name: DELIVERING },
            { name: DELIVERED },
            { name: CANCELED },
            { name: RETURNED },
        ]
    });
}

async function createDiscountForProducts() {
    // array from 120 to 125
    const productIds = Array.from({ length: 6 }, (_, i) => i + 120);
    await prisma.$transaction(async (tx) => {
        for (const productId of productIds) {
            const discount = {
                discountType: "fixed_amount",
                discountValue: 300000,
                startDate: "2024-10-15",
                endDate: "2024-12-28",
            };

            await tx.productDiscount.create({
                data: {
                    productId: +productId,
                    discountType: discount.discountType,
                    discountValue: +discount.discountValue,
                    startDate: new Date(discount.startDate).toISOString(),
                    endDate: new Date(discount.endDate + "T23:59:59.000Z").toISOString(),
                }
            });
        }
    });
}

module.exports = { uploadRoles, uploadPaymentMethods, uploadPaymentStatuses, uploadOrderStatuses, createDiscountForProducts };