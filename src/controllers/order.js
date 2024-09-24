const { CreatedResponse, OKResponse } = require("../response/success");
const OrderService = require("../services/order");

class OrderController {
  static async create(req, res) {
    new CreatedResponse({
      metadata: await OrderService.create({
        ...req.body,
        buyerId: req.account.id,
      }),
    }).send(res);
  }

  static async updateOrderStatus(req, res) {
    new OKResponse({
      metadata: await OrderService.updateOrderStatus(
        +req.params.orderId,
        req.body
      ),
    }).send(res);
  }

  static async getAll(req, res) {
    console.log(req.query);
    new OKResponse({
      metadata: await OrderService.getAll({
        customerSearch: req.query.customerSearch,
        beginDate: req.query.beginDate,
        endDate: req.query.endDate,
        orderStatusId: +req.query.orderStatusId,
        paymentMethodId: +req.query.paymentMethodId,
        paymentStatusId: +req.query.paymentStatusId,
        sortBy: req.query.sortBy,
        page: +req.query.page || 1,
        limit: +req.query.limit,
      }),
    }).send(res);
  }

  static async getAllForReport(req, res) {
    new OKResponse({
      metadata: await OrderService.getAllForReport(),
    }).send(res);
  }

  static async getMenForReport(req, res) {
    new OKResponse({
      metadata: await OrderService.getMenForReport(),
    }).send(res);
  }

  static async getWomenForReport(req, res) {
    new OKResponse({
      metadata: await OrderService.getWomenForReport(),
    }).send(res);
  }
  static async getChildrenForReport(req, res) {
    new OKResponse({
      metadata: await OrderService.getChildrenForReport(),
    }).send(res);
  }

  static async cancel(req, res) {
    new OKResponse({
      metadata: await OrderService.cancel(+req.params.orderId),
    }).send(res);
  }

  static async getOrdersOfBuyerByOrderStatus(req, res) {
    new OKResponse({
      metadata: await OrderService.getOrdersOfBuyerByOrderStatus({
        buyerId: +req.account.id,
        orderStatusId: +req.query.orderStatusId,
        sortBy: req.query.sortBy,
        page: +req.query.page || 1,
        limit: +req.query.limit,
      }),
    }).send(res);
  }

  static async getById(req, res) {
    new OKResponse({
      metadata: await OrderService.getById(+req.params.orderId),
    }).send(res);
  }

  static async getAllOrderStatus(req, res) {
    new OKResponse({
      metadata: await OrderService.getAllOrderStatus(),
    }).send(res);
  }
}

module.exports = OrderController;
