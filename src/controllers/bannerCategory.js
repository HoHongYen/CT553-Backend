const { BadRequest } = require("../response/error");
const { CreatedResponse, OKResponse } = require("../response/success");
const BannerCategoryService = require("../services/bannerCategory");

class BannerCategoryController {
  static async create(req, res) {
    new CreatedResponse({
      metadata: await BannerCategoryService.create(req.body),
    }).send(res);
  }

  static async getAll(req, res) {
    new CreatedResponse({
      metadata: await BannerCategoryService.getAll(),
    }).send(res);
  }

  static async getOne(req, res) {
    new OKResponse({
      metadata: await BannerCategoryService.getOne(+req.params.id),
    }).send(res);
  }

  static async update(req, res) {
    new OKResponse({
      metadata: await BannerCategoryService.update(+req.params.id, req.body),
    }).send(res);
  }
}

module.exports = BannerCategoryController;
