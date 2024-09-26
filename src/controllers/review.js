const { CreatedResponse, OKResponse } = require("../response/success");
const ReviewService = require("../services/review");

class ReviewController {
  static async create(req, res) {
    new CreatedResponse({
      metadata: await ReviewService.create(req.account.id, {
        orderId: req.body.orderId,
        variantId: req.body.variantId,
        productId: req.body.productId,
        rating: +req.body.rating,
        comment: req.body.comment,
        uploadedImageIds: req.body.uploadedImageIds || [],
      }),
    }).send(res);
  }

  static async addImage(req, res) {
    new CreatedResponse({
      metadata: await ReviewService.addImage(+req.params.id, req.body),
    }).send(res);
  }

  static async deleteImage(req, res) {
    new CreatedResponse({
      metadata: await ReviewService.deleteImage(
        +req.params.reviewImageId,
        req.filename
      ),
    }).send(res);
  }

  static async getAllReviewsOfProduct(req, res) {
    console.log("req.query.productId", req.params.productId);
    new OKResponse({
      metadata: await ReviewService.getAllReviewsOfProduct(+req.params.productId),
    }).send(res);
  }

  static async update(req, res) {
    new CreatedResponse({
      metadata: await ReviewService.update(req.params.reviewId, req.account.id, {
        rating: +req.body.rating,
        comment: req.body.comment,
      }),
    }).send(res);
  }

}

module.exports = ReviewController;
