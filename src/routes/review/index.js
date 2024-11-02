const { body, param, query } = require("express-validator");
const ReviewController = require("../../controllers/review");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication, permission } = require("../../middlewares/auth");
const {
    validate,
    existAccount,
    existVariant,
    existOrder,
    existProduct,
    existUploadedImage,
    existReviewImage,
    existReview,
    existReviewOfAccount,
} = require("../../middlewares/validation");

// const router = require("express").Router();

const express = require("express");
const router = express.Router();
const protectedRouter = express.Router();

protectedRouter.use(authentication);

// get top 3 newest reviews and highest rating reviews of all products
router.get(
    "/top",
    validate,
    asyncHandler(ReviewController.getTopReviews)
);

// get all reviews of a product
router.get(
    "/:productId",
    query("productId").custom(existProduct),
    validate,
    asyncHandler(ReviewController.getAllReviewsOfProduct)
);

// router.use(authentication);

// get all reviews of an account by admin
protectedRouter.get(
    "/account/:accountId",
    permission(),
    validate,
    asyncHandler(ReviewController.getAllReviewsOfAccount)
);

// get all review by admin
protectedRouter.get(
    "",
    permission(),
    validate,
    asyncHandler(ReviewController.getAllReviews)
);

// check if user has reviewed this product for this order
protectedRouter.post(
    "/check",
    body("orderId").notEmpty().withMessage("Order ID is missing").custom(existOrder),
    body("variantId").notEmpty().withMessage("Variant ID is missing").custom(existVariant),
    validate,
    asyncHandler(ReviewController.checkIfUserHasReviewed)
);

protectedRouter.post(
    "",
    permission(),
    body("orderId").notEmpty().withMessage("Order ID is missing").custom(existOrder),
    body("variantId").notEmpty().withMessage("Variant ID is missing").custom(existVariant),
    body("productId").notEmpty().withMessage("Product ID is missing").custom(existProduct),
    body("rating").notEmpty().withMessage("Rating is missing"),
    body("comment").notEmpty().withMessage("Comment is missing"),
    validate,
    asyncHandler(ReviewController.create)
);

protectedRouter.post(
    "/reply",
    permission(),
    body("orderId").notEmpty().withMessage("Order ID is missing").custom(existOrder),
    body("variantId").notEmpty().withMessage("Variant ID is missing").custom(existVariant),
    body("productId").notEmpty().withMessage("Product ID is missing").custom(existProduct),
    body("comment").notEmpty().withMessage("Comment is missing"),
    body("replyToReviewId")
        .custom(existReview)
        .withMessage("Reply to review id not found"),
    validate,
    asyncHandler(ReviewController.createReply)
);

protectedRouter.put(
    "/reply/:reviewId",
    param("reviewId")
        .notEmpty()
        .withMessage("review ID is missing")
        .custom(existReviewOfAccount),
    body("comment").notEmpty().withMessage("Comment is missing"),
    validate,
    asyncHandler(ReviewController.updateReply)
);

// review_image begin
router.post(
    "/:id/add-image",
    param("id").custom(existReview),
    body("uploadedImageId")
        .notEmpty()
        .withMessage("uploadedImageId is missing")
        .custom(existUploadedImage),
    validate,
    asyncHandler(ReviewController.addImage)
);

router.delete(
    "/delete-image/:reviewImageId",
    param("reviewId").custom(existReview),
    param("reviewImageId").custom(existReviewImage),
    validate,
    asyncHandler(ReviewController.deleteImage)
);
// review_image end

protectedRouter.put(
    "/:reviewId",
    permission(),
    param("reviewId")
        .notEmpty()
        .withMessage("review ID is missing")
        .custom(existReviewOfAccount),
    body("rating").notEmpty().withMessage("Rating is missing"),
    body("comment").notEmpty().withMessage("Comment is missing"),
    validate,
    asyncHandler(ReviewController.update)
);

// hide review
protectedRouter.put(
    "/toggleHide/:reviewId",
    permission(),
    param("reviewId")
        .notEmpty()
        .withMessage("review ID is missing"),
    validate,
    asyncHandler(ReviewController.toggleHide)
);

module.exports = { router, protectedRouter };
