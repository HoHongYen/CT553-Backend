const prisma = require("../config/prismaClient");

class ReturnPolicyService {

    static async getAll() {
        return await prisma.returnPolicy.findMany({
            orderBy: {
                id: 'asc',
            },
        });
    }

    static async getCurrent() {
        return await prisma.returnPolicy.findFirst({
            where: {
                visible: true,
            }
        });
    }

    static async getById(policyId) {
        return await prisma.returnPolicy.findUnique({
            where: {
                id: +policyId,
            },
        });
    }

    static async create(content, visible) {
        if (visible) {
            await prisma.returnPolicy.updateMany({
                where: { visible: true },
                data: { visible: false },
            });
        }
        const newPolicy = await prisma.returnPolicy.create({
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

        const updatedPolicy = await prisma.returnPolicy.update({
            where: {
                id: +policyId,
            },
            data: { content, visible }
        });
        return updatedPolicy;
    }

    static async toggleHide(policyId) {
        const policy = await prisma.returnPolicy.findUnique({
            where: {
                id: +policyId,
            },
            select: {
                visible: true,
            },
        });

        if (!policy.visible) {
            await prisma.returnPolicy.updateMany({
                where: { visible: true },
                data: { visible: false },
            });
        }

        return prisma.returnPolicy.update({
            where: {
                id: +policyId,
            },
            data: {
                visible: !policy.visible,
            },
        });
    }
}

module.exports = ReturnPolicyService;
