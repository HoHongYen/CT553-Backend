const prisma = require("../config/prismaClient");

class ModuleService {
  static async getAll() {
    return await prisma.module.findMany();
  }
}

module.exports = ModuleService;
