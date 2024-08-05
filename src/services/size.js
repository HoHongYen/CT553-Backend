const prisma = require("../config/prismaClient");

class SizeService {
  static async create(data) {
    return await prisma.size.create({
      data,
    });
  }

  static async getAll() {
    return await prisma.size.findMany({});
  }

  static async update(sizeId, updatedData) {
    return await prisma.size.update({
      where: {
        id: sizeId,
      },
      data: updatedData,
    });
  }

  static async delete(sizeId) {
    await prisma.size.delete({ where: { id: sizeId } });
  }
}

module.exports = SizeService;
