const { CreatedResponse, OKResponse } = require("../response/success");
const CheckProductPolicyService = require("../services/checkProductPolicy");

class CheckProductPolicyController {

  static async getAll(req, res) {
    new OKResponse({
      metadata: await CheckProductPolicyService.getAll(),
    }).send(res);
  }

  static async getCurrent(req, res) {
    new OKResponse({
      metadata: await CheckProductPolicyService.getCurrent(),
    }).send(res);
  }

  static async getById(req, res) {
    new OKResponse({
      metadata: await CheckProductPolicyService.getById(req.params.policyId),
    }).send(res);
  }

  static async create(req, res) {
    new CreatedResponse({
      metadata: await CheckProductPolicyService.create(req.body.content, req.body.visible),
    }).send(res);
  }

  static async update(req, res) {
    new CreatedResponse({
      metadata: await CheckProductPolicyService.update(req.params.policyId, req.body),
    }).send(res);
  }

  // update

  static async toggleHide(req, res) {
    new CreatedResponse({
      metadata: await CheckProductPolicyService.toggleHide(req.params.policyId),
    }).send(res);
  } re
}

module.exports = CheckProductPolicyController;
