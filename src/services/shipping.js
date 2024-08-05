const GiaoHangNhanhService = require("./ghn");

class ShippingService {
  static async calculateFee({ toDistrictId, toWardCode, weightInGram }) {
    const shopInfo = (await GiaoHangNhanhService.getStoreInformation())
      .shops[0];

    const availableServices =
      await GiaoHangNhanhService.getAvailableShippingServices({
        shopId: shopInfo._id,
        fromDistrictId: shopInfo.district_id,
        toDistrictId,
      });

    const DEFAULT_SERVICE_ID = availableServices[0].service_id;

    const orderFee = await GiaoHangNhanhService.calculateOrderFee(
      shopInfo._id,
      {
        serviceId: DEFAULT_SERVICE_ID,
        fromDistrictId: shopInfo.district_id,
        fromWardCode: shopInfo.ward_code,
        toDistrictId,
        toWardCode,
        weightInGram,
      }
    );

    return orderFee.data;
  }
}

module.exports = ShippingService;
