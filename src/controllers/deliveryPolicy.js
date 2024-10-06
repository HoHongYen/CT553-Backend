const { CreatedResponse, OKResponse } = require("../response/success");
const DeliveryPolicyService = require("../services/deliveryPolicy");

class DeliveryPolicyController {

  static async getAll(req, res) {
    new OKResponse({
      metadata: await DeliveryPolicyService.getAll(),
    }).send(res);
  }

  static async getCurrent(req, res) {
    new OKResponse({
      metadata: await DeliveryPolicyService.getCurrent(),
    }).send(res);
  }

  static async getById(req, res) {
    new OKResponse({
      metadata: await DeliveryPolicyService.getById(req.params.policyId),
    }).send(res);
  }

  static async create(req, res) {
    new CreatedResponse({
      metadata: await DeliveryPolicyService.create(req.body.content, req.body.visible),
    }).send(res);
  }

  static async update(req, res) {
    new CreatedResponse({
      metadata: await DeliveryPolicyService.update(req.params.policyId, req.body),
    }).send(res);
  }

  // update

  static async toggleHide(req, res) {
    new CreatedResponse({
      metadata: await DeliveryPolicyService.toggleHide(req.params.policyId),
    }).send(res);
  } re
}

module.exports = DeliveryPolicyController;
