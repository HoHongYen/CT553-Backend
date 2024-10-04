const prisma = require("../config/prismaClient");

class WebhookService {

  static async getAll() {
    return await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            parent: {
              select: {
                slug: true,
              }
            },
            thumbnailImage: true,
          },
          orderBy: {
            children: {
              _count: "desc",
            },
          },
        },
        thumbnailImage: true,
      },
    });
  }
}

module.exports = WebhookService;
