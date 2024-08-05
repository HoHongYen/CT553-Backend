const prisma = require("../config/prismaClient");

class ColorService {
  static async create(data) {
    return await prisma.color.create({
      data,
    });
  }

  static async getAll() {
    return await prisma.color.findMany({});
  }

  static async update(colorId, updatedData) {
    return await prisma.color.update({
      where: {
        id: colorId,
      },
      data: updatedData,
    });
  }

  static async delete(colorId) {
    await prisma.color.delete({ where: { id: colorId } });
  }
}

module.exports = ColorService;
