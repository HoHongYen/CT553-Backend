const prisma = require("../config/prismaClient");
const UploadService = require("./upload");
const { commonIncludeOptionsInReview } = require("../utils/commonInclude");

class ReviewService {

  static async checkIfUserHasReviewed(accountId, { orderId, variantId }) {
    const existingReview = await prisma.review.findFirst({
      where: {
        accountId,
        orderId,
        variantId,
      },
      include: commonIncludeOptionsInReview,
    });
    if (existingReview) {
      return existingReview;
    }
    return null;
  }

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
      throw new Error("You have already reviewed this product for this order");
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

      // create rating for recommend
      // check if user has rated this product, rating will be updated, count plus 1
      const existingRatingRecommendation = await tx.ratingRecommendation.findFirst({
        where: {
          accountId,
          productId,
        }
      });

      if (existingRatingRecommendation) {
        const updatedRatingRecommendation = await tx.ratingRecommendation.update({
          where: {
            id: existingRatingRecommendation.id
          },
          data: {
            count: existingRatingRecommendation.count + 1,
            rating: (existingRatingRecommendation.rating * (existingRatingRecommendation.count) + rating) / (existingRatingRecommendation.count + 1)
          }
        });

        return createdReview;
      }

      await tx.ratingRecommendation.create({
        data: { accountId, productId, rating, count: 1 }
      })

      return createdReview;
    });

    console.log("newReview", newReview);
    return newReview;

  }

  static async createReply(
    accountId, { orderId, variantId, productId, comment, replyToReviewId, uploadedImageIds }
  ) {
    console.log("replyToReviewId", replyToReviewId);
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
      where: {
        replyToReviewId: null,
      },
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

    // filter
    if (visible !== "all") {
      if (!query.where) Object.assign(query, { where: {} });
      query.where.visible = visible === "true";
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

    let reviews = await prisma.review.findMany({ ...query });

    // filter by hasReply
    if (hasReply === "true") {
      reviews = reviews.filter((review) => review.replyByReview.length > 0);
    } else if (hasReply === "false") {
      reviews = reviews.filter((review) => review.replyByReview.length === 0);
    }

    // pagination
    const count = reviews.length;
    const totalPages = Math.ceil(count / limit);
    reviews = reviews.slice((page - 1) * limit, page * limit);

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
        replyToReviewId: null,
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
        replyToReviewId: null,
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

  static async updateReply(
    reviewId,
    accountId,
    {
      comment,
    }
  ) {

    const updatedReview = await prisma.review.update({
      where: {
        id: +reviewId,
      },
      data: {
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
