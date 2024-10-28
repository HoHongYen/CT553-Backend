const prisma = require("../config/prismaClient");

class PermissionService {

    // for admin
    static async getAll() {
        const permissions = await prisma.permission.findMany();
        return permissions;
    }

    static async getByRole(roleId) {
        const permissions = await prisma.rolePermission.findMany({
            where: {
                roleId: +roleId
            },
        });
        // get id of permissions
        const permissionIds = permissions.map(permission => permission.permissionId);
        return permissionIds;
    }

    static async getByPermission(permissionId) {
        const roles = await prisma.rolePermission.findMany({
            where: {
                permissionId: +permissionId
            },
        });
        // get id of permissions
        const roleIds = roles.map(role => role.roleId);
        return roleIds;
    }

    static async addPermissionToRole(roleId, permissionId) {

        // check if permission already exists
        const rolePermission = await prisma.rolePermission.findFirst({
            where: {
                roleId: +roleId,
                permissionId: +permissionId,
            },
        });

        // remove permission if exists
        if (rolePermission) {
            await prisma.rolePermission.delete({
                where: {
                    id: rolePermission.id,
                },
            });
            return;
        }

        await prisma.rolePermission.create({
            data: {
                roleId: +roleId,
                permissionId: +permissionId,
            },
        });
    }

}

module.exports = PermissionService;
