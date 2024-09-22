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

module.exports = { uploadRoles, uploadPaymentMethods, uploadPaymentStatuses, uploadOrderStatuses };