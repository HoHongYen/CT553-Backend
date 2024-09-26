const prisma = require("../config/prismaClient");
const UploadService = require("./upload");

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

  static async getAllReviewsOfProduct(productId) {

    // calculate the average rating of the product
    const reviews = await prisma.review.findMany({
      where: {
        orderDetail: {
          variant: {
            productId,
          },
        },
      },
      include: {
        orderDetail: {
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    thumbnailImage: {
                      select: {
                        path: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        account: {
          select: {
            id: true,
            fullName: true,
            avatar: {
              select: {
                path: true,
              },
            }
          },
        },
        reviewImage: {
          select: {
            id: true,
            image: {
              select: {
                id: true,
                path: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      }
    });

    return reviews;
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
}

module.exports = ReviewService;
