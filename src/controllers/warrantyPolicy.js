const { CreatedResponse, OKResponse } = require("../response/success");
const WarrantyPolicyService = require("../services/warrantyPolicy");

class WarrantyPolicyController {

  static async getAll(req, res) {
    new OKResponse({
      metadata: await WarrantyPolicyService.getAll(),
    }).send(res);
  }

  static async getCurrent(req, res) {
    new OKResponse({
      metadata: await WarrantyPolicyService.getCurrent(),
    }).send(res);
  }

  static async getById(req, res) {
    new OKResponse({
      metadata: await WarrantyPolicyService.getById(req.params.policyId),
    }).send(res);
  }

  static async create(req, res) {
    new CreatedResponse({
      metadata: await WarrantyPolicyService.create(req.body.content, req.body.visible),
    }).send(res);
  }

  static async update(req, res) {
    new CreatedResponse({
      metadata: await WarrantyPolicyService.update(req.params.policyId, req.body),
    }).send(res);
  }

  // update

  static async toggleHide(req, res) {
    new CreatedResponse({
      metadata: await WarrantyPolicyService.toggleHide(req.params.policyId),
    }).send(res);
  } re
}

module.exports = WarrantyPolicyController;
