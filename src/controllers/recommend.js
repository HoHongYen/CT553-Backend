const { OKResponse } = require("../response/success");
const RecommendService = require("../services/recommend");

class RecommendController {

  static async getRecommendBaseOneRatings(req, res) {
    new OKResponse({
      metadata: await RecommendService.getRecommendBaseOneRatings(req.params.userId),
    }).send(res);
  }

  static async saveRatingRecommend(req, res) {
    new OKResponse({
      metadata: await RecommendService.saveRatingRecommend(req.body),
    }).send(res);
  }

  static async getRecommendBaseOnViewCounts(req, res) {
    new OKResponse({
      metadata: await RecommendService.getRecommendBaseOnViewCounts(req.params.userId),
    }).send(res);
  }

  static async addViewCountRecommend(req, res) {
    new OKResponse({
      metadata: await RecommendService.addViewCountRecommend(+req.body.accountId, +req.body.productId),
    }).send(res);
  }
}

module.exports = RecommendController;
