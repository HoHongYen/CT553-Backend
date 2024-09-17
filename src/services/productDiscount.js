const prisma = require("../config/prismaClient");
const { BadRequest } = require("../response/error");

class ProductDiscountService {
  static async create({
    productId,
    discountType,
    discountValue,
    startDate,
    endDate,
  }) {
    const foundedProductDiscount = await prisma.productDiscount.findFirst({
      where: {
        productId: +productId,
        endDate: {
          gte: new Date(startDate).toISOString(),
        },
      },
    });

    if (foundedProductDiscount) {
      throw new BadRequest(
        "There is already a discount for this product in this period"
      );
    }
    return await prisma.productDiscount.create({
      data: {
        productId: +productId,
        discountType,
        discountValue: +discountValue,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      },
    });
  }

  static async update({
    productId,
    discountType,
    discountValue,
    startDate,
    endDate,
  }) {

    const foundedProductDiscount = await prisma.productDiscount.findFirst({
      where: {
        productId: +productId,
      },
    });

    return await prisma.productDiscount.update({
      where: {
        id: foundedProductDiscount.id,
      },
      data: {
        discountType,
        discountValue: +discountValue,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      },
    });
  }

}

module.exports = ProductDiscountService;
