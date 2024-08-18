const prisma = require("../../config/prismaClient");

async function uploadRoles() {
    await prisma.role.createMany({
        data: [
            { role: "ADMIN" },
            { role: "EMPLOYEE" },
            { role: "USER" }
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
            { name: "PENDING" },
            { name: "SUCCESS" },
            { name: "FAILED" },
        ]
    });
}

module.exports = { uploadRoles, uploadPaymentMethods, uploadPaymentStatuses };