const { param, body } = require("express-validator");
const ColorController = require("../../controllers/color");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const {
  existColor,
  validate,
  existProduct,
  existUploadedImage,
  existProductImage,
} = require("../../middlewares/validation");
const { authentication, permission } = require("../../middlewares/auth");
const { ADMIN, EMPLOYEE } = require("../../constant/roles");

const router = require("express").Router();

router.get("", asyncHandler(ColorController.getAll));

// router.use(authentication);

router.post(
  "",
  // permission([ADMIN, EMPLOYEE]),
  body("name").notEmpty().withMessage("Name is missing"),
  body("productId")
    .notEmpty()
    .withMessage("Product ID is missing")
    .custom(existProduct),
  body("thumbnailImageId")
    .notEmpty()
    .withMessage("Thumbnail image ID is missing")
    .custom(existUploadedImage),
  body("productImageId")
    .notEmpty()
    .withMessage("Product image ID is missing")
    .custom(existProductImage),
  validate,
  asyncHandler(ColorController.create)
);

router.put(
  "/:id",
  // permission([ADMIN, EMPLOYEE]),
  param("id").custom(existColor),
  validate,
  asyncHandler(ColorController.update)
);

router.delete(
  "/:id",
  // permission([ADMIN, EMPLOYEE]),
  param("id").custom(existColor),
  validate,
  asyncHandler(ColorController.delete)
);

module.exports = router;
