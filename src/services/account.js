const prisma = require("../config/prismaClient");
const { BadRequest } = require("../response/error");

class AccountService {
  static async getAll() {
    const accounts = await prisma.account.findMany({
      include: {
        avatar: true,
      },
    });
    return accounts;
  }

  static async updateInformation(accountId, updatedData) {
    if (updatedData.birthday) {
      updatedData.birthday = new Date(updatedData.birthday).toISOString();
    }
    const updatedAccount = await prisma.account.update({
      where: {
        id: accountId,
      },
      data: updatedData,
      include: {
        avatar: true,
      },
    });

    delete updatedAccount.password;

    return updatedAccount;
  }

  static async getOne(accountId) {
    const account = await prisma.account.findUnique({
      where: {
        id: accountId,
      },
      include: {
        avatar: true,
      },
    });
    return {
      ...account,
      password: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    };
  }

  static async deleteAll() {
    const deletedAccount = await prisma.account.deleteMany();
    return deletedAccount;
  }
}

module.exports = AccountService;
