const prisma = require("../config/prismaClient");
const UploadService = require("./upload");
const { commonIncludeOptionsInReview } = require("../utils/commonInclude");

class ReviewService {
  static async create(
    accountId, { orderId, variantId, productId, rating, comment, uploadedImageIds }
  ) {

    // check if the user has already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        accountId,
        orderId,
        variantId,
      },
    });

    if (existingReview) {
      throw new Error("You have already reviewed this product");
    }

    const newReview = await prisma.$transaction(async (tx) => {
      const createdReview = await tx.review.create({
        data: { accountId, orderId, variantId, productId, rating, comment },
      });

      await tx.reviewImage.createMany({
        data: uploadedImageIds.map((uploadedImageId) => ({
          imageId: uploadedImageId,
          reviewId: createdReview.id,
        })),
      });

      return createdReview;
    });

    console.log("newReview", newReview);
    return newReview;

  }

  static async createReply(
    accountId, { orderId, variantId, productId, comment, replyToReviewId, uploadedImageIds }
  ) {

    // check if this review has already been replied
    const existingReview = await prisma.review.findFirst({
      where: {
        orderId,
        variantId,
        replyToReviewId,
      },
    });

    if (existingReview) {
      throw new Error("This review has already been replied");
    }

    const newReplyReview = await prisma.$transaction(async (tx) => {
      const createdReview = await tx.review.create({
        data: { accountId, orderId, variantId, productId, comment, replyToReviewId },
      });

      await tx.reviewImage.createMany({
        data: uploadedImageIds.map((uploadedImageId) => ({
          imageId: uploadedImageId,
          reviewId: createdReview.id,
        })),
      });

      return createdReview;
    });

    console.log("new reply review", newReplyReview);
    return newReplyReview;
  }

  // for admin
  static async getAllReviews({ customerSearch, visible, hasReply, limit = 3, page, sortBy }) {

    let query = {
      include: commonIncludeOptionsInReview,
      take: limit,
      orderBy: {
        createdAt: "desc"
      }
    }

    // search
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

      // find all reviews of these account
      if (!query.where) Object.assign(query, { where: {} });
      if (buyer.length > 0) {
        query.where.accountId = {
          in: buyer.map((b) => b.id),
        }
      } else {
        query.where.buyerId = -1;
      }
    }

    console.log("visible", visible);

    // filter
    if (visible !== "all") {
      if (!query.where) Object.assign(query, { where: {} });
      query.where.visible = visible === "true";
    }

    // if (hasReply !== "all") {
    //   if (!query.where) Object.assign(query, { where: {} });
    //   // replyByReview is not empty
    // }

    // sort
    if (sortBy?.field === "createdAt") {
      query.orderBy = {
        createdAt: sortBy.direction,
      };
    } else if (sortBy?.field === "rating") {
      query.orderBy = {
        rating: sortBy.direction,
      };
    }

    // pagination
    const count = await prisma.review.count({
      where: query.where,
    })

    const offset = page > 1 ? (page - 1) * limit : 0;
    const totalPages = Math.ceil(count / limit);
    let reviews = await prisma.review.findMany({ ...query, skip: offset });

    return {
      reviews, pagination: {
        totalReviews: count,
        totalPages
      }
    }
  }

  // get top reviews for client
  static async getTopReviews() {

    let query = {
      where: {
        visible: true,
      },
      include: commonIncludeOptionsInReview,
      take: 10,
      orderBy: {
        rating: "desc",
        // createdAt: "desc"
      }
    }

    let reviews = await prisma.review.findMany({ ...query });

    // get top 3 newest reviews
    const top3NewestReviews = reviews.sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);

    return top3NewestReviews;
  }

  // for client
  static async getAllReviewsOfProduct(productId, { limit = 3, page, sortBy }) {
    let query = {
      where: {
        orderDetail: {
          variant: {
            productId,
          },
        },
        visible: true,
      },
      include: commonIncludeOptionsInReview,
      take: limit,
      orderBy: {
        createdAt: "desc"
      }
    }

    // sort
    if (sortBy?.field === "createdAt") {
      query.orderBy = {
        createdAt: sortBy.direction,
      };
    } else if (sortBy?.field === "rating") {
      query.orderBy = {
        rating: sortBy.direction,
      };
    }

    // pagination
    const count = await prisma.review.count({
      where: query.where,
    })

    const offset = page > 1 ? (page - 1) * limit : 0;
    const totalPages = Math.ceil(count / limit);

    let reviews = await prisma.review.findMany({ ...query, skip: offset });

    return {
      reviews, pagination: {
        totalReviews: count,
        totalPages
      }
    }
  }

  static async getReviewsTemp(accountId) {
    let query = {
      where: {
        accountId,
      },
      select: {
        id: true,
        rating: true,
        account: {
          select: {
            id: true,
            fullName: true,
          },
        },
        orderDetail: {
          select: {
            variant: {
              select: {
                id: true,
                product: {
                  select: {
                    id: true,
                    name: true,
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    }

    let reviews = await prisma.review.findMany({ ...query });

    const account = reviews[0].account;

    // all review with same product, we get the rating by averaging them
    const groupedReviews = (Object.keys(reviews).map((key) => {
      return reviews[key];
    })).reduce((acc, review) => {
      const product = review.orderDetail.variant.product;
      if (!acc[product.id]) {
        acc[product.id] = {
          product,
          totalRating: 0,
          totalReview: 0,
          averageRating: 0,
        }
      }

      acc[product.id].totalRating += review.rating;
      acc[product.id].totalReview += 1;
      acc[product.id].averageRating = acc[product.id].totalRating / acc[product.id].totalReview;

      return acc;
    }, {});

    const res = Object.keys(groupedReviews).map((key) => {
      return groupedReviews[key];
    }).map((groupedReview) => {
      return {
        product: groupedReview.product,
        rating: groupedReview.averageRating,
        account: account,
      }
    });

    const allProducts = await prisma.product.findMany({
      select: { id: true, name: true },
      orderBy: {
        id: "asc"
      }
    });
    console.log("allProducts", allProducts);
    // const listOfProductIds = ;

    const finalRes = allProducts.map((product) => {
      const found = res.find((review) => review.product.id === product.id);
      if (found) {
        return found;
      } else {
        return {
          product,
          rating: 0,
          account,
        }
      }
    });

    return finalRes;
  }

  static async getAllReviewsOfAccount(accountId) {
    const temp = await ReviewService.getReviewsTemp(accountId);
    console.log("temp", temp);



    return temp;
  }

  static async addImage(reviewId, { uploadedImageId }) {
    return await prisma.reviewImage.create({
      data: {
        reviewId,
        imageId: uploadedImageId,
      },
    });
  }

  static async deleteImage(reviewImageId, filename) {

    const { imageId } = await prisma.reviewImage.findUnique({
      where: {
        id: reviewImageId
      }
    });

    await Promise.all([
      prisma.reviewImage.delete({
        where: {
          id: reviewImageId
        }
      }),
      UploadService.destroyImage(imageId),
    ]);
  }

  static async update(
    reviewId,
    accountId,
    {
      rating,
      comment,
    }
  ) {

    const updatedReview = await prisma.review.update({
      where: {
        id: +reviewId,
      },
      data: {
        rating,
        comment,
      },
    });
    return updatedReview;
  }

  static async toggleHide(reviewId) {

    const review = await prisma.review.findUnique({
      where: {
        id: +reviewId,
      },
      select: {
        visible: true,
      },
    });

    return prisma.review.update({
      where: {
        id: +reviewId,
      },
      data: {
        visible: !review.visible,
      },
    });
  }

}

module.exports = ReviewService;
