const prisma = require("../config/prismaClient");

class DeliveryPolicyService {

    static async getAll() {
        return await prisma.deliveryPolicy.findMany({
            orderBy: {
                id: 'asc',
            },
        });
    }

    static async getCurrent() {
        return await prisma.deliveryPolicy.findFirst({
            where: {
                visible: true,
            }
        });
    }

    static async getById(policyId) {
        return await prisma.deliveryPolicy.findUnique({
            where: {
                id: +policyId,
            },
        });
    }

    static async create(content, visible) {
        if (visible) {
            await prisma.deliveryPolicy.updateMany({
                where: { visible: true },
                data: { visible: false },
            });
        }
        const newPolicy = await prisma.deliveryPolicy.create({
            data: { content, visible },
        });
        return newPolicy;
    }

    static async update(
        policyId,
        { content, visible }
    ) {

        if (visible) {
            await prisma.deliveryPolicy.updateMany({
                where: { visible: true },
                data: { visible: false },
            });
        }

        const updatedPolicy = await prisma.deliveryPolicy.update({
            where: {
                id: +policyId,
            },
            data: { content, visible }
        });
        return updatedPolicy;
    }

    static async toggleHide(policyId) {
        const policy = await prisma.deliveryPolicy.findUnique({
            where: {
                id: +policyId,
            },
            select: {
                visible: true,
            },
        });

        if (!policy.visible) {
            await prisma.deliveryPolicy.updateMany({
                where: { visible: true },
                data: { visible: false },
            });
        }

        return prisma.deliveryPolicy.update({
            where: {
                id: +policyId,
            },
            data: {
                visible: !policy.visible,
            },
        });
    }
}

module.exports = DeliveryPolicyService;
