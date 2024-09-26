const { body, param, query } = require("express-validator");
const ReviewController = require("../../controllers/review");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication } = require("../../middlewares/auth");
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

const router = require("express").Router();

router.use(authentication);

// get all reviews of a product
router.get(
    "/:productId",
    query("productId").custom(existProduct),
    validate,
    asyncHandler(ReviewController.getAllReviewsOfProduct)
);

router.post(
    "/",
    body("orderId").notEmpty().withMessage("Order ID is missing").custom(existOrder),
    body("variantId").notEmpty().withMessage("Variant ID is missing").custom(existVariant),
    body("productId").notEmpty().withMessage("Product ID is missing").custom(existProduct),
    body("rating").notEmpty().withMessage("Rating is missing"),
    body("comment").notEmpty().withMessage("Comment is missing"),
    validate,
    asyncHandler(ReviewController.create)
);

// review_product begin
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
// review_product end

router.put(
    "/:reviewId",
    param("reviewId")
        .notEmpty()
        .withMessage("review ID is missing")
        .custom(existReviewOfAccount),
    body("rating").notEmpty().withMessage("Rating is missing"),
    body("comment").notEmpty().withMessage("Comment is missing"),
    validate,
    asyncHandler(ReviewController.update)
);

module.exports = router;
