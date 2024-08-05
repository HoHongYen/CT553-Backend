const prisma = require("../config/prismaClient");
const bcrypt = require("bcrypt");
const { BadRequest } = require("../response/error");
const { generatePairTokens } = require("../utils/generateToken");
const { ADMIN, EMPLOYEE, getRole } = require("../constant/roles");
class AuthService {
  static async register({
    fullName,
    email,
    password,
    phone,
    gender,
    birthday,
  }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAccount = await prisma.account.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        phone,
        gender,
        birthday,
      },
    });
    return newAccount;
  }

  static async login({ email, password }) {
    const account = await prisma.account.findUnique({
      where: { email },
      include: {
        role: {
          select: { role: true },
        },
      },
    });

    if (!account) throw new BadRequest("Invalid credentials");

    const matchedPassword = await bcrypt.compare(password, account.password);

    if (!matchedPassword) throw new BadRequest("Invalid credentials");

    return generateToken(account);
  }

  static async loginWithGoogle({ email, fullName, phone, avatarId }) {
    let account = await prisma.account.findUnique({
      where: { email },
      include: {
        role: {
          select: { role: true },
        },
      },
    });

    // create account
    if (!account) {
      const newAccount = await prisma.account.create({
        data: {
          fullName,
          email,
          password: "",
          phone,
          gender: true,
          birthday: null,
          avatarId,
        },
      });
      account = await prisma.account.findUnique({
        where: { email: newAccount.email },
        include: {
          role: {
            select: { role: true },
          },
        },
      });
    }
    return generateToken(account);
  }

  static async adminLogin({ email, password }) {
    const account = await prisma.account.findUnique({
      where: {
        email,
        roleId: {
          in: [1, 2],
        },
      },
      include: {
        role: {
          select: { role: true },
        },
      },
    });

    if (!account) throw new BadRequest("Invalid credentials");

    const matchedPassword = await bcrypt.compare(password, account.password);

    if (!matchedPassword) throw new BadRequest("Invalid credentials");

    return generateToken(account);
  }

  static async adminLoginWithGoogle({ email }) {
    let account = await prisma.account.findUnique({
      where: {
        email,
        roleId: {
          in: [1, 2],
        },
      },
      include: {
        role: {
          select: { role: true },
        },
      },
    });

    if (!account) throw new BadRequest("Invalid credentials");
    return generateToken(account);
  }
}

function generateToken(account) {
  const tokens = generatePairTokens({
    id: account.id,
    role: getRole(account.roleId),
  });
  return {
    account: {
      ...account,
      password: undefined,
      role: account.role.role,
      roleId: undefined,
    },
    tokens,
  };
}

module.exports = AuthService;
