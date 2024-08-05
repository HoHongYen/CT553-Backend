const { OKResponse } = require("../response/success");
const ShippingService = require("../services/shipping");

class ShippingController {
  static async calculateShippingFee(req, res) {
    new OKResponse({
      metadata: await ShippingService.calculateFee(req.body),
    }).send(res);
  }
}

module.exports = ShippingController;
