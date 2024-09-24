const prisma = require("../config/prismaClient");
const { ORDER_STATUS_ID_MAPPING } = require("../constant/orderStatus");
const { PAYMENT_STATUS_ID_MAPPING } = require("../constant/paymentStatus");
const { PAYMENT_METHOD_ID_MAPPING } = require("../constant/paymentMethod");
const CategoryService = require("./category");
const { BadRequest } = require("../response/error");

const commonIncludeOptionsInOrder = {
  buyer: true,
  deliveryAddress: true,
  orderDetail: {
    include: {
      variant: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              thumbnailImage: {
                select: {
                  path: true,
                },
              },
              productDiscount: true,
              variants: true,
            },
          },
        },
      },
    },
  },
  currentStatus: true,
  payment: {
    include: {
      paymentMethod: true,
      paymentStatus: true,
    },
  }
}

class OrderService {
  static async create({
    totalPrice,
    totalDiscount,
    finalPrice,
    shippingFee,
    buyerId,
    deliveryAddressId,
    paymentMethodId,
    items = [],
    usedCouponId,
  }) {
    await this.validateOrder({
      totalPrice,
      totalDiscount,
      finalPrice,
      shippingFee,
      items,
      usedCouponId,
    });

    const createdOrder = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          totalPrice,
          totalDiscount,
          finalPrice,
          shippingFee,
          buyerId,
          deliveryAddressId,
          currentStatusId: ORDER_STATUS_ID_MAPPING.AWAITING_CONFIRM,
          usedCouponId,
        },
      });

      await tx.orderDetail.createMany({
        data: items.map((item) => ({
          orderId: createdOrder.id,
          variantId: +item.variantId,
          quantity: item.quantity,
          price: item.price,
          discount: item.productDiscount,
        })),
      });

      await Promise.all(
        items.map((item) =>
          tx.variant.update({
            where: {
              id: +item.variantId,
            },
            data: {
              quantity: {
                decrement: +item.quantity,
              },
            },
          })
        )
      );

      const productSoldNumberToUpDate = [];

      items.forEach((item) => {
        const foundProductIndex = productSoldNumberToUpDate.findIndex(
          (product) => product.productId === +item.productId
        );

        if (foundProductIndex < 0) {
          productSoldNumberToUpDate.push({
            productId: +item.productId,
            quantity: +item.quantity,
          });
        } else {
          productSoldNumberToUpDate[foundProductIndex].quantity +=
            +item.quantity;
        }
      });

      await Promise.all(
        productSoldNumberToUpDate.map((product) =>
          tx.product.update({
            where: {
              id: product.productId,
            },
            data: {
              soldNumber: {
                increment: product.quantity,
              },
            },
          })
        )
      );

      await tx.payment.create({
        data: {
          amount: createdOrder.finalPrice,
          orderId: createdOrder.id,
          paymentMethodId,
          paymentStatusId: PAYMENT_STATUS_ID_MAPPING.PENDING,
        },
      });

      if (usedCouponId) {
        await tx.coupon.update({
          where: {
            id: usedCouponId,
          },
          data: {
            currentUse: {
              increment: 1,
            },
          },
        });

        await tx.collectedCoupons.update({
          where: {
            accountId_couponId: {
              accountId: buyerId,
              couponId: usedCouponId,
            },
          },
          data: {
            used: true,
          },
        });
      }

      return createdOrder;
    });

    // get payment method
    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: {
        id: paymentMethodId,
      },
    });

    return {
      ...createdOrder,
      paymentMethod,
    };
  }

  static async getAll({
    customerSearch,
    beginDate,
    endDate,
    orderStatusId = ORDER_STATUS_ID_MAPPING.ALL,
    paymentMethodId = PAYMENT_METHOD_ID_MAPPING.ALL,
    paymentStatusId = PAYMENT_STATUS_ID_MAPPING.ALL,
    sortBy,
    page = 1,
    limit,
  }) {

    let query = {
      include: commonIncludeOptionsInOrder,
      take: limit,
      orderBy: {
        createdAt: "desc",
      }
    };

    if (+orderStatusId != ORDER_STATUS_ID_MAPPING.ALL) {
      if (!query.where) Object.assign(query, { where: {} });
      query.where.currentStatusId = orderStatusId;
    }

    if (+paymentMethodId != PAYMENT_STATUS_ID_MAPPING.ALL) {
      if (!query.where) Object.assign(query, { where: {} });
      if (!query.where.payment) Object.assign(query.where, { payment: {} });
      query.where.payment.paymentMethodId = paymentMethodId;
    }

    if (+paymentStatusId != PAYMENT_STATUS_ID_MAPPING.ALL) {
      if (!query.where) Object.assign(query, { where: {} });
      if (!query.where.payment) Object.assign(query.where, { payment: {} });
      query.where.payment.paymentStatusId = paymentStatusId;
    }

    if (customerSearch) {
      // if customerSearch is a number, search by id
      let buyer = [];
      if (!isNaN(customerSearch)) {
        buyer = await prisma.account.findMany({
          where: {
            id: {
              equals: +customerSearch,
            },
          },
          select: {
            id: true,
          },
        });
      } else {
        buyer = await prisma.account.findMany({
          where: {
            fullName: {
              contains: customerSearch,
              mode: "insensitive",
            },
          },
          select: {
            id: true,
          },
        });
      }

      // find all orders of these buyers
      if (!query.where) Object.assign(query, { where: {} });
      if (buyer.length > 0) {
        query.where.buyerId = {
          in: buyer.map((b) => b.id),
        };
      } else {
        query.where.buyerId = -1;
      }
    }

    if (beginDate && endDate) {
      // end date is the next day of the input

      if (!query.where) Object.assign(query, { where: {} });
      query.where.createdAt = {
        gte: new Date(beginDate),
        lt: new Date(endDate + "T23:59:59.000Z"),
      };
    }

    console.log("query.where", query.where);

    // sort
    if (sortBy?.field === "createdAt") {
      query.orderBy = {
        createdAt: sortBy.direction,
      };
    } else if (sortBy?.field === "finalPrice") {
      query.orderBy = {
        finalPrice: sortBy.direction,
      };
    }

    // pagination
    const count = await prisma.order.count({
      where: query.where,
    });

    const offset = page > 1 ? (page - 1) * limit : 0;
    const totalPages = Math.ceil(count / limit);

    let orders = await prisma.order.findMany({ ...query, skip: offset });

    return {
      orders,
      pagination: {
        totalOrders: count,
        totalPages,
      },
    };
  }

  static async getAllForReport() {
    const orders = await prisma.order.findMany({
      select: {
        createdAt: true,
        finalPrice: true,
        OrderDetail: {
          select: {
            quantity: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return orders;
  }

  static async getMenForReport() {
    let menCategory = await prisma.category.findFirst({
      where: {
        name: "Nam",
      },
    });
    const childrenCategories = await CategoryService.getChildren(menCategory.id);
    const orders = await prisma.orderDetail.findMany({
      where: {
        variant: {
          product: {
            categoryId: {
              in: childrenCategories
            }
          },
        },
      },
      select: {
        quantity: true,
        order: {
          select: {
            createdAt: true,
          }
        },
        variant: {
          select: {
            product: {
              select: {
                price: true,
              },
            },
          },
        },
      },
    });
    return orders;
  }

  static async getWomenForReport() {
    let womenCategory = await prisma.category.findFirst({
      where: {
        name: "Nữ",
      },
    });
    const childrenCategories = await CategoryService.getChildren(womenCategory.id);
    const orders = await prisma.orderDetail.findMany({
      where: {
        variant: {
          product: {
            categoryId: {
              in: childrenCategories
            }
          },
        },
      },
      select: {
        quantity: true,
        order: {
          select: {
            createdAt: true,
          }
        },
        variant: {
          select: {
            product: {
              select: {
                price: true,
              },
            },
          },
        },
      },
    });
    return orders;
  }

  static async getChildrenForReport() {
    let childrenCategory = await prisma.category.findFirst({
      where: {
        name: "Trẻ em",
      },
    });
    const childrenCategories = await CategoryService.getChildren(childrenCategory.id);
    const orders = await prisma.orderDetail.findMany({
      where: {
        variant: {
          product: {
            categoryId: {
              in: childrenCategories
            }
          },
        },
      },
      select: {
        quantity: true,
        order: {
          select: {
            createdAt: true,
          }
        },
        variant: {
          select: {
            product: {
              select: {
                price: true,
              },
            },
          },
        },
      },
    });
    return orders;
  }

  static async getOrdersOfBuyerByOrderStatus({ buyerId, orderStatusId, sortBy, page, limit }) {

    let query = {
      where: {
        buyerId,
      },
      include: commonIncludeOptionsInOrder,
      take: limit,
      orderBy: {
        createdAt: "desc",
      }
    };

    if (+orderStatusId != ORDER_STATUS_ID_MAPPING.ALL) {
      query.where.currentStatusId = orderStatusId;
    }

    // sort
    if (sortBy?.field === "createdAt") {
      query.orderBy = {
        createdAt: sortBy.direction,
      };
    } else if (sortBy?.field === "finalPrice") {
      query.orderBy = {
        finalPrice: sortBy.direction,
      };
    }

    // pagination
    const count = await prisma.order.count({
      where: query.where,
    });

    const offset = page > 1 ? (page - 1) * limit : 0;
    const totalPages = Math.ceil(count / limit);

    let orders = await prisma.order.findMany({ ...query, skip: offset });

    query;
    return {
      orders,
      pagination: {
        totalOrders: count,
        totalPages,
      },
    };
  }

  static async updateOrderStatus(orderId, { fromStatus, toStatus }) {
    if (+fromStatus + 1 != +toStatus) {
      throw new BadRequest("Invalid request");
    }

    const foundOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (+fromStatus != foundOrder.currentStatusId) {
      throw new BadRequest("Invalid request");
    }

    return await prisma.order.update({
      where: { id: orderId },
      data: { currentStatusId: +toStatus },
    });
  }

  static async getById(orderId) {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: commonIncludeOptionsInOrder,
    });

    return order;
  }

  static async cancel(orderId) {
    const foundedOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderDetail: {
          include: {
            variant: true,
          },
        },
      },
    });

    if (
      foundedOrder.currentStatusId !=
      ORDER_STATUS_ID_MAPPING.AWAITING_CONFIRM &&
      foundedOrder != ORDER_STATUS_ID_MAPPING.AWAITING_FULFILLMENT
    ) {
      throw new BadRequest("You can not cancel the delivering order");
    }

    return await prisma.$transaction(async (tx) => {
      await Promise.all(
        foundedOrder.orderDetail.map((item) =>
          tx.variant.update({
            where: {
              id: item.variantId,
            },
            data: {
              quantity: {
                increment: item.quantity,
              },
            },
          })
        )
      );

      const productSoldNumberToUpDate = [];

      foundedOrder.orderDetail.forEach((item) => {
        const foundProductIndex = productSoldNumberToUpDate.findIndex(
          (product) => product.productId === item.variant.productId
        );

        if (foundProductIndex < 0) {
          productSoldNumberToUpDate.push({
            productId: item.variant.productId,
            quantity: item.quantity,
          });
        } else {
          productSoldNumberToUpDate[foundProductIndex].quantity +=
            item.quantity;
        }
      });

      await Promise.all(
        productSoldNumberToUpDate.map((product) =>
          tx.product.update({
            where: {
              id: product.productId,
            },
            data: {
              soldNumber: {
                decrement: product.quantity,
              },
            },
          })
        )
      );

      return await tx.order.update({
        where: { id: foundedOrder.id },
        data: {
          currentStatusId: ORDER_STATUS_ID_MAPPING.CANCELED,
        },
      });
    });
  }

  static async updatePaymentStatus(orderId, vnPayResponseCode) {
    const foundOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        payment: true,
      },
    });

    const paymentStatusIdToUpdate =
      vnPayResponseCode === "00"
        ? PAYMENT_STATUS_ID_MAPPING.SUCCESS
        : PAYMENT_STATUS_ID_MAPPING.FAILED;

    await prisma.payment.update({
      where: {
        orderId: foundOrder.id,
      },
      data: {
        paymentStatusId: paymentStatusIdToUpdate,
      },
    });
  }

  static async getAllOrderStatus() {
    return await prisma.orderStatus.findMany();
  }

  static async validateOrder({
    totalPrice,
    totalDiscount,
    shippingFee,
    finalPrice,
    items,
    usedCouponId,
  }) {
    const quantityInOrder = Object.fromEntries(
      items.map((item) => [+item.variantId, item.quantity])
    );

    const variantsInDB = await prisma.variant.findMany({
      where: {
        id: {
          in: items.map((item) => +item.variantId),
        },
      },
      include: {
        product: {
          include: {
            productDiscount: true,
          },
        },
      },
    });

    const reCalculateTotalPrice = variantsInDB.reduce((prev, variant) => {
      if (variant.quantity < +quantityInOrder[variant.id]) {
        throw new BadRequest("Quantity of some item is invalid");
      }
      let productDiscount = 0;
      if (variant.product.productDiscount.length > 0) {
        const discount = variant.product.productDiscount[0];
        if (discount.endDate > new Date()) {
          if (discount.discountType === "percentage") {
            productDiscount =
              (variant.price * discount.discountValue) / 100;
          } else {
            productDiscount = discount.discountValue;
          }
        }
      }
      return (
        prev +
        +quantityInOrder[variant.id] *
        (+variant.price - productDiscount)
      );
    }, 0);

    if (reCalculateTotalPrice != totalPrice) {
      throw new BadRequest("Total price is invalid");
    }

    if (usedCouponId) {
      const usedCoupon = await prisma.coupon.findUnique({
        where: {
          id: usedCouponId,
        },
      });

      const totalDiscountFromCoupon =
        usedCoupon?.discountType === "percentage"
          ? (reCalculateTotalPrice * usedCoupon.discountValue) / 100
          : usedCoupon?.discountValue;

      if (totalDiscountFromCoupon !== totalDiscount) {
        throw new BadRequest("Total discount from coupon is invalid");
      }
    }

    if (finalPrice != totalPrice - totalDiscount + shippingFee) {
      throw new BadRequest("Final price is invalid");
    }
  }
}

module.exports = OrderService;
