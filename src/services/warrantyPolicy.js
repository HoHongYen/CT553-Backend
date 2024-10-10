const prisma = require("../config/prismaClient");

class WarrantyPolicyService {

    static async getAll() {
        return await prisma.warrantyPolicy.findMany({
            orderBy: {
                id: 'asc',
            },
        });
    }

    static async getCurrent() {
        return await prisma.warrantyPolicy.findFirst({
            where: {
                visible: true,
            }
        });
    }

    static async getById(policyId) {
        return await prisma.warrantyPolicy.findUnique({
            where: {
                id: +policyId,
            },
        });
    }

    static async create(content, visible) {
        if (visible) {
            await prisma.warrantyPolicy.updateMany({
                where: { visible: true },
                data: { visible: false },
            });
        }
        const newPolicy = await prisma.warrantyPolicy.create({
            data: { content, visible },
        });
        return newPolicy;
    }

    static async update(
        policyId,
        { content, visible }
    ) {

        if (visible) {
            await prisma.returnPolicy.updateMany({
                where: { visible: true },
                data: { visible: false },
            });
        }
        const updatedPolicy = await prisma.warrantyPolicy.update({
            where: {
                id: +policyId,
            },
            data: { content, visible }
        });
        return updatedPolicy;
    }

    static async toggleHide(policyId) {
        const policy = await prisma.warrantyPolicy.findUnique({
            where: {
                id: +policyId,
            },
            select: {
                visible: true,
            },
        });

        if (!policy.visible) {
            await prisma.warrantyPolicy.updateMany({
                where: { visible: true },
                data: { visible: false },
            });
        }

        return prisma.warrantyPolicy.update({
            where: {
                id: +policyId,
            },
            data: {
                visible: !policy.visible,
            },
        });
    }
}

module.exports = WarrantyPolicyService;
