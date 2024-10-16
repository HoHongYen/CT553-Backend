const { OKResponse } = require("../response/success");
const RecommendService = require("../services/recommend");

class RecommendController {

  static async getRecommend(req, res) {
    new OKResponse({
      metadata: await RecommendService.getRecommend(req.params.userId),
    }).send(res);
  }

  static async saveRecommend(req, res) {
    new OKResponse({
      metadata: await RecommendService.saveRecommend(req.body),
    }).send(res);
  }
}

module.exports = RecommendController;
