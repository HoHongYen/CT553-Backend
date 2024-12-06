const prisma = require("../config/prismaClient");
const bcrypt = require("bcrypt");
const { BadRequest } = require("../response/error");
const { generatePairTokens } = require("../utils/generateToken");
const { ADMIN, EMPLOYEE, getRole } = require("../constant/roles");
const { changeImageUrlToFile } = require("../utils/index");
const SendEmailService = require("./sendEmail");

class AuthService {
  static async register({
    fullName,
    email,
    password,
    phone,
    gender,
    birthday,
    avatarId,
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
        avatarId: +avatarId,
      },
    });

    console.log(newAccount);

    // send email to buyer
    // await SendEmailService.sendEmail(
    //   email,
    //   "Chào mừng đến với Decorpic",
    //   `<h3>Chào mừng đến với Guardian VietNam! </h3>
    //   <p>Chào <strong>${fullName}</strong>, chúc mừng bạn đã kích hoạt tài khoản khách hàng thành công. Lần mua hàng tiếp theo, đăng nhập để việc thanh toán thuận tiện hơn. </p>
    //   <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
    //   <strong><i>Cửa hàng bán tranh trang trí Decorpic.</i></strong>`
    // );

    console.log("send email success");

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

    // check if account is blocked
    if (!account.active) throw new BadRequest("Account is blocked");

    return generateToken(account);
  }

  static async loginWithGoogle({ email, fullName, phone, avatarURL }) {
    let account = await prisma.account.findUnique({
      where: { email },
      include: {
        role: {
          select: { role: true },
        },
      },
    });

    if (account) {
      // check if account is blocked
      if (!account.active) throw new BadRequest("Account is blocked");
      return generateToken(account);
    }

    // create account
    const form = new FormData();
    const file = await changeImageUrlToFile(avatarURL);
    form.append("image", file);

    const uploadedImageId = await fetch(`http://localhost:5000/api/upload/image`, {
      method: "POST",
      body: form
    }).then(function (a) {
      return a.json(); // call the json method on the response to get JSON
    }).then(function (res) {
      return res.metadata.id;
    })

    await prisma.account.create({
      data: {
        fullName,
        email,
        password: "",
        phone,
        gender: true,
        birthday: null,
        avatarId: uploadedImageId,
        isGoogleLogin: true,
      },
    });

    account = await prisma.account.findUnique({
      where: { email },
      include: {
        role: {
          select: { role: true },
        },
      },
    });

    // send email to buyer
    await SendEmailService.sendEmail(
      email,
      "Chào mừng đến với Decorpic",
      `<h3>Chào mừng đến với Guardian VietNam! </h3>
      <p>Chào <strong>${fullName}</strong>, chúc mừng bạn đã kích hoạt tài khoản khách hàng thành công. Lần mua hàng tiếp theo, đăng nhập để việc thanh toán thuận tiện hơn. </p>
      <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
      <strong><i>Cửa hàng bán tranh trang trí Decorpic.</i></strong>`
    );

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

    // check if account is blocked
    if (!account.active) throw new BadRequest("Account is blocked");

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

    // check if account is blocked
    if (!account.active) throw new BadRequest("Account is blocked");

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
    },
    tokens,
  };
}

module.exports = AuthService;
