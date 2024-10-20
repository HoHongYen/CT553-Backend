const prisma = require("../config/prismaClient");

class BannerCategoryService {
  static async create({ name }) {
    return await prisma.bannerCategory.create({
      data: { name },
    });
  }

  static async getAll() {
    return await prisma.bannerCategory.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  static async getOne(bannerCategoryId) {
    return await prisma.bannerCategory.findUnique({
      where: { id: bannerCategoryId },
    });
  }

  static async update(bannerCategoryId, updatedData) {
    return await prisma.bannerCategory.update({
      where: {
        id: bannerCategoryId,
      },
      data: updatedData,
    });
  }
}

module.exports = BannerCategoryService;
