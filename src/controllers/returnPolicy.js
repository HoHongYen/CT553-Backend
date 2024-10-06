const { CreatedResponse, OKResponse } = require("../response/success");
const ReturnPolicyService = require("../services/returnPolicy");

class ReturnPolicyController {

  static async getAll(req, res) {
    new OKResponse({
      metadata: await ReturnPolicyService.getAll(),
    }).send(res);
  }

  static async getCurrent(req, res) {
    new OKResponse({
      metadata: await ReturnPolicyService.getCurrent(),
    }).send(res);
  }

  static async getById(req, res) {
    new OKResponse({
      metadata: await ReturnPolicyService.getById(req.params.policyId),
    }).send(res);
  }

  static async create(req, res) {
    new CreatedResponse({
      metadata: await ReturnPolicyService.create(req.body.content, req.body.visible),
    }).send(res);
  }

  static async update(req, res) {
    new CreatedResponse({
      metadata: await ReturnPolicyService.update(req.params.policyId, req.body),
    }).send(res);
  }

  // update

  static async toggleHide(req, res) {
    new CreatedResponse({
      metadata: await ReturnPolicyService.toggleHide(req.params.policyId),
    }).send(res);
  } re
}

module.exports = ReturnPolicyController;
