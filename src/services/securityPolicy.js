const prisma = require("../config/prismaClient");

class SecurityPolicyService {

    static async getAll() {
        return await prisma.securityPolicy.findMany({
            orderBy: {
                id: 'asc',
            },
        });
    }

    static async getCurrent() {
        return await prisma.securityPolicy.findFirst({
            where: {
                visible: true,
            }
        });
    }

    static async getById(policyId) {
        return await prisma.securityPolicy.findUnique({
            where: {
                id: +policyId,
            },
        });
    }

    static async create(content, visible) {
        if (visible) {
            await prisma.securityPolicy.updateMany({
                where: { visible: true },
                data: { visible: false },
            });
        }
        const newPolicy = await prisma.securityPolicy.create({
            data: { content, visible },
        });
        return newPolicy;
    }

    static async update(
        policyId,
        { content, visible }
    ) {
        if (visible) {
            await prisma.securityPolicy.updateMany({
                where: { visible: true },
                data: { visible: false },
            });
        }
        const updatedPolicy = await prisma.securityPolicy.update({
            where: {
                id: +policyId,
            },
            data: { content, visible }
        });
        return updatedPolicy;
    }

    static async toggleHide(policyId) {
        const policy = await prisma.securityPolicy.findUnique({
            where: {
                id: +policyId,
            },
            select: {
                visible: true,
            },
        });

        if (!policy.visible) {
            await prisma.securityPolicy.updateMany({
                where: { visible: true },
                data: { visible: false },
            });
        }

        return prisma.securityPolicy.update({
            where: {
                id: +policyId,
            },
            data: {
                visible: !policy.visible,
            },
        });
    }
}

module.exports = SecurityPolicyService;
