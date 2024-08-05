const { CreatedResponse, OKResponse } = require("../response/success");
const ColorService = require("../services/color");

class ColorController {
  static async create(req, res) {
    new CreatedResponse({
      metadata: await ColorService.create(req.body),
    }).send(res);
  }

  static async getAll(req, res) {
    new OKResponse({
      metadata: await ColorService.getAll(),
    }).send(res);
  }

  static async update(req, res) {
    new OKResponse({
      metadata: await ColorService.update(+req.params.id, req.body),
    }).send(res);
  }

  static async delete(req, res) {
    new OKResponse({
      metadata: await ColorService.delete(+req.params.id),
    }).send(res);
  }
}

module.exports = ColorController;
