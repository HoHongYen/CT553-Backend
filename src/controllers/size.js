const { CreatedResponse, OKResponse } = require("../response/success");
const SizeService = require("../services/size");

class SizeController {
  static async create(req, res) {
    new CreatedResponse({
      metadata: await SizeService.create(req.body),
    }).send(res);
  }

  static async getAll(req, res) {
    new OKResponse({
      metadata: await SizeService.getAll(),
    }).send(res);
  }

  static async update(req, res) {
    new OKResponse({
      metadata: await SizeService.update(+req.params.id, req.body),
    }).send(res);
  }

  static async delete(req, res) {
    new OKResponse({
      metadata: await SizeService.delete(+req.params.id),
    }).send(res);
  }
}

module.exports = SizeController;
