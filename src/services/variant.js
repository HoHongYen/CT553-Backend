const prisma = require("../config/prismaClient");

class VariantService {
  static async create(productId, { colorId, sizeId, thumbnail, quantity }) {
    return await prisma.variant.create({
      data: {
        productId,
        colorId,
        sizeId,
        thumbnail,
        quantity,
      },
    });
  }

  static async getByVariantIds(variantIds = []) {
    return await prisma.variant.findMany({
      where: {
        id: {
          in: variantIds.map((id) => +id),
        },
      },
      include: {
        color: {
          include: {
            productImage: {
              include: {
                image: true,
              },
            },
            thumbnailImage: true,
          },
        },
        size: true,
        product: {
          include: {
            productDiscount: {
              where: {
                startDate: {
                  lte: new Date().toISOString(),
                },
                endDate: {
                  gte: new Date().toISOString(),
                },
              },
            },
          },
        },
      },
    });
  }

  static async update(productId, { colorId, sizeId, quantity, thumbnail }) {
    return await prisma.variant.update({
      where: {
        productId_colorId_sizeId: {
          productId,
          colorId,
          sizeId,
        },
      },
      data: {
        quantity,
        thumbnail,
      },
    });
  }

  static async delete(productId, { colorId, sizeId }) {
    await prisma.variant.delete({
      where: {
        productId_colorId_sizeId: {
          productId,
          colorId: +colorId,
          sizeId: +sizeId,
        },
      },
    });
  }
}

module.exports = VariantService;
