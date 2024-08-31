const prisma = require("../config/prismaClient");
const { CreatedResponse, OKResponse } = require("../response/success");
const ProductService = require("../services/product");
const ProductDiscountService = require("../services/productDiscount");

class ProductController {

  // crawl
  static async crawl(req, res) {
    new CreatedResponse({
      metadata: await ProductService.crawl(req.body),
    }).send(res);
  }

  static async create(req, res) {
    new CreatedResponse({
      metadata: await ProductService.create(req.body),
    }).send(res);
  }

  static async getAll(req, res) {
    const page = +req.query.page || 1;
    new OKResponse({
      metadata: await ProductService.getAll({
        type: req.query.type,
        categoryIds: req.query.categoryIds,
        limit: +req.query.limit,
        productIds: req.query.productIds,
        page,
      }),
    }).send(res);
  } 

  static async getOne(req, res) {
    new OKResponse({
      metadata: await ProductService.getOne(+req.params.id),
    }).send(res);
  }

  static async getOneBySlug(req, res) {
    new OKResponse({
      metadata: await ProductService.getOneBySlug(req.params.slug),
    }).send(res);
  }

  static async update(req, res) {
    new OKResponse({
      metadata: await ProductService.update(+req.params.id, req.body),
    }).send(res);
  }

  static async delete(req, res) {
    new OKResponse({
      metadata: await ProductService.delete(+req.params.id),
    }).send(res);
  }

  static async addImage(req, res) {
    new CreatedResponse({
      metadata: await ProductService.addImage(+req.params.id, req.body),
    }).send(res);
  }

  static async deleteImage(req, res) {
    new CreatedResponse({
      metadata: await ProductService.deleteImage(
        +req.params.imageId,
        req.filename
      ),
      // metadata: {},
    }).send(res);
  }

  static async createDiscount(req, res) {
    new CreatedResponse({
      message: "Product discount created",
      metadata: await ProductDiscountService.create({
        ...req.body,
        productId: +req.params.id,
      }),
    }).send(res);
  }

  static async search(req, res) {
    const query = req.query.q;

    new OKResponse({
      metadata: await ProductService.search(query),
    }).send(res);
  }

  static async getRecommendedProducts(req, res) {
    const accountId = +req.account.id;

    new OKResponse({
      metadata: await ProductService.getRecommendProductsBasedOnOrders(
        accountId
      ),
    }).send(res);
  }

  static async searchByImageUrl(req, res) {
    const imageUrl = req.query.imageUrl;
    let uploadedImagePath = "";
    if (imageUrl.startsWith(process.env.BACKEND_URL)) {
      uploadedImagePath = imageUrl.substring(
        process.env.BACKEND_URL.length + 1
      );
    }
    new OKResponse({
      metadata: await ProductService.imageSearch(imageUrl, uploadedImagePath),
    }).send(res);
  }
}

module.exports = ProductController;
