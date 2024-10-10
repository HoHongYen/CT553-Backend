const prisma = require("../config/prismaClient");

class CheckProductPolicyService {

    static async getAll() {
        return await prisma.checkProductPolicy.findMany({
            orderBy: {
                id: 'asc',
            },
        });
    }

    static async getCurrent() {
        return await prisma.checkProductPolicy.findFirst({
            where: {
                visible: true,
            }
        });
    }

    static async getById(policyId) {
        return await prisma.checkProductPolicy.findUnique({
            where: {
                id: +policyId,
            },
        });
    }

    static async create(content, visible) {
        if (visible) {
            await prisma.checkProductPolicy.updateMany({
                where: { visible: true },
                data: { visible: false },
            });
        }
        const newPolicy = await prisma.checkProductPolicy.create({
            data: { content, visible },
        });
        return newPolicy;
    }

    static async update(
        policyId,
        { content, visible }
    ) {

        if (visible) {
            await prisma.checkProductPolicy.updateMany({
                where: { visible: true },
                data: { visible: false },
            });
        }

        const updatedPolicy = await prisma.checkProductPolicy.update({
            where: {
                id: +policyId,
            },
            data: { content, visible }
        });
        return updatedPolicy;
    }

    static async toggleHide(policyId) {
        const policy = await prisma.checkProductPolicy.findUnique({
            where: {
                id: +policyId,
            },
            select: {
                visible: true,
            },
        });

        if (!policy.visible) {
            await prisma.checkProductPolicy.updateMany({
                where: { visible: true },
                data: { visible: false },
            });
        }

        return prisma.checkProductPolicy.update({
            where: {
                id: +policyId,
            },
            data: {
                visible: !policy.visible,
            },
        });
    }
}

module.exports = CheckProductPolicyService;
