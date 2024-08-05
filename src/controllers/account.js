const { OKResponse, CreatedResponse } = require("../response/success");
const AccountService = require("../services/account");

class AccountController {
  static async updateInformation(req, res) {
    delete req.body.password;
    delete req.body.email;
    new OKResponse({
      metadata: await AccountService.updateInformation(
        +req.account.id,
        req.body
      ),
    }).send(res); 
  }

  static async getAll(req, res) {
    new CreatedResponse({
      message: "Get all users successfully",
      metadata: await AccountService.getAll(),
    }).send(res);
  }

  static async getOne(req, res) {
    new CreatedResponse({
      message: "Get user successfully",
      metadata: await AccountService.getOne(+req.params.id),
    }).send(res);
  }

  static async deleteAll(req, res) {
    new CreatedResponse({
      message: "Delete all users successfully",
      metadata: await AccountService.deleteAll(req.body),
    }).send(res);
  }
}

module.exports = AccountController;
