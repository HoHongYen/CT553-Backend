const prisma = require("../config/prismaClient");
const { ORDER_STATUS_ID_MAPPING } = require("../constant/orderStatus");
const { PAYMENT_STATUS_ID_MAPPING } = require("../constant/paymentStatus");
const CategoryService = require("./category");
const { BadRequest } = require("../response/error");

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

    return await prisma.$transaction(async (tx) => {
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
  }

  static async getAll(filter) {
    const orders = await prisma.order.findMany({
      include: {
        buyer: true,
        currentStatus: true,
        Payment: {
          include: {
            paymentStatus: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return orders;
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

  static async getOrdersOfBuyerByOrderStatus({ buyerId, orderStatusId }) {
    const query = {
      buyerId,
    };

    if (+orderStatusId != ORDER_STATUS_ID_MAPPING.ALL) {
      query.currentStatusId = orderStatusId;
    }

    return await prisma.order.findMany({
      where: query,
      include: {
        OrderDetail: {
          include: {
            variant: {
              include: {
                color: {
                  include: {
                    productImage: {
                      include: {
                        image: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        currentStatus: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
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
    return await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        deliveryAddress: true,
        currentStatus: true,
        OrderDetail: {
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    name: true,
                  },
                },
                color: {
                  include: {
                    productImage: {
                      include: {
                        image: true,
                      },
                    },
                  },
                },
                size: true,
              },
            },
          },
        },
        buyer: true,
        Payment: {
          include: {
            paymentMethod: true,
            paymentStatus: true,
          },
        },
      },
    });
  }

  static async cancel(orderId) {
    const foundedOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        OrderDetail: {
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
        foundedOrder.OrderDetail.map((item) =>
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

      foundedOrder.OrderDetail.forEach((item) => {
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
        Payment: true,
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
        if (discount.discountType === "percentage") {
          productDiscount =
            (variant.product.price * discount.discountValue) / 100;
        } else {
          productDiscount = discount.discountValue;
        }
      }
      return (
        prev +
        +quantityInOrder[variant.id] *
        (+variant.product.price - productDiscount)
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
