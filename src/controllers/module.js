const { BadRequest } = require("../response/error");
const { CreatedResponse, OKResponse } = require("../response/success");
const ModuleService = require("../services/module");

class ModuleController {
  static async getAll(req, res) {
    new CreatedResponse({
      metadata: await ModuleService.getAll(),
    }).send(res);
  }
}

module.exports = ModuleController;
