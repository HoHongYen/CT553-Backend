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

  static async createReply(req, res) {
    new CreatedResponse({
      metadata: await ReviewService.createReply(req.account.id, {
        orderId: req.body.orderId,
        variantId: req.body.variantId,
        productId: req.body.productId,
        comment: req.body.comment,
        replyToReviewId: req.body.replyToReviewId,
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


  static async getAllReviews(req, res) {
    new OKResponse({
      metadata: await ReviewService.getAllReviews({
        customerSearch: req.query.customerSearch,
        visible: req.query.visible,
        hasReply: req.query.hasReply,
        limit: +req.query.limit,
        page: +req.query.page || 1,
        sortBy: req.query.sortBy,
      }),
    }).send(res);
  }

  static async getTopReviews(req, res) {
    new OKResponse({
      metadata: await ReviewService.getTopReviews(),
    }).send(res);
  }

  static async getAllReviewsOfProduct(req, res) {
    new OKResponse({
      metadata: await ReviewService.getAllReviewsOfProduct(+req.params.productId, {
        limit: +req.query.limit,
        page: +req.query.page || 1,
        sortBy: req.query.sortBy,
      }),
    }).send(res);
  }

  static async getAllReviewsOfAccount(req, res) {
    new OKResponse({
      metadata: await ReviewService.getAllReviewsOfAccount(+req.params.accountId, {
        limit: +req.query.limit || 3,
        page: +req.query.page || 1,
        sortBy: req.query.sortBy,
      }),
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

  static async toggleHide(req, res) {
    new CreatedResponse({
      metadata: await ReviewService.toggleHide(req.params.reviewId),
    }).send(res);
  }

}

module.exports = ReviewController;
