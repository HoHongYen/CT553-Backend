const { CreatedResponse, OKResponse } = require("../response/success");
const PermissionService = require("../services/permission");

class PermissionController {

    static async getAll(req, res) {
        new OKResponse({
            metadata: await PermissionService.getAll(),
        }).send(res);
    }

    static async getByRole(req, res) {
        new OKResponse({
            metadata: await PermissionService.getByRole(req.params.roleId),
        }).send(res);
    }

    static async addPermissionToRole(req, res) {
        new OKResponse({
            metadata: await PermissionService.addPermissionToRole(req.params.roleId, req.body.permissionId),
        }).send(res);
    }

}

module.exports = PermissionController;
