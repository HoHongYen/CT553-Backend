const { BadRequest } = require("../response/error");
const { CreatedResponse, OKResponse } = require("../response/success");
const CategoryService = require("../services/category");

class CategoryController {
  static async create(req, res) {
    new CreatedResponse({
      metadata: await CategoryService.create(req.body),
    }).send(res);
  }

  static async getAll(req, res) {
    new OKResponse({
      metadata: await CategoryService.getAll(),
    }).send(res);
  }

  static async getOne(req, res) {
    new OKResponse({
      metadata: await CategoryService.getOne(+req.params.categoryId),
    }).send(res);
  }

  static async getRootParent(req, res) {
    new OKResponse({
      metadata: await CategoryService.getRootParent(+req.params.categoryId),
    }).send(res);
  }

  static async getChildren(req, res) {
    new OKResponse({
      // metadata: await CategoryService.getCategoriesRecursivelyFromParent(+req.params.categoryId),
      metadata: await CategoryService.getChildren(+req.params.categoryId),
    }).send(res);
  }

  static async update(req, res) {
    new OKResponse({
      metadata: await CategoryService.update(+req.params.id, req.body),
    }).send(res);
  }

  static async delete(req, res) {
    new OKResponse({
      metadata: await CategoryService.delete(+req.params.id),
    }).send(res);
  }

  static async getBreadcumb(req, res) {
    const subCategoryId = +req.query.fromCategoryId;
    const productSlug = req.query.fromProductSlug;

    if (!subCategoryId && !productSlug) {
      throw new BadRequest("Invalid Request");
    }

    const breadcumb = productSlug
      ? await CategoryService.getBreadcumbFromProduct(productSlug)
      : await CategoryService.getBreadcumbFromSubCategory(subCategoryId);

    new OKResponse({
      metadata: breadcumb,
    }).send(res);
  }
}

module.exports = CategoryController;
