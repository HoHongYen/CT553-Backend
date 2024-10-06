const { CreatedResponse, OKResponse } = require("../response/success");
const SecurityPolicyService = require("../services/securityPolicy");

class SecurityPolicyController {

  static async getAll(req, res) {
    new OKResponse({
      metadata: await SecurityPolicyService.getAll(),
    }).send(res);
  }

  static async getCurrent(req, res) {
    new OKResponse({
      metadata: await SecurityPolicyService.getCurrent(),
    }).send(res);
  }

  static async getById(req, res) {
    new OKResponse({
      metadata: await SecurityPolicyService.getById(req.params.policyId),
    }).send(res);
  }

  static async create(req, res) {
    new CreatedResponse({
      metadata: await SecurityPolicyService.create(req.body.content, req.body.visible),
    }).send(res);
  }

  static async update(req, res) {
    new CreatedResponse({
      metadata: await SecurityPolicyService.update(req.params.policyId, req.body),
    }).send(res);
  }

  // update

  static async toggleHide(req, res) {
    new CreatedResponse({
      metadata: await SecurityPolicyService.toggleHide(req.params.policyId),
    }).send(res);
  } re
}

module.exports = SecurityPolicyController;
