const { param, body, query } = require("express-validator");
const VariantController = require("../../controllers/variant");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const {
  existVariant,
  validate,
  existColor,
  existSize,
  existProduct,
} = require("../../middlewares/validation");
const { authentication, permission } = require("../../middlewares/auth");
const { ADMIN, EMPLOYEE } = require("../../constant/roles");

const router = require("express").Router({ mergeParams: true });

// router.use(authentication);

router.post(
  "",
  // permission([ADMIN, EMPLOYEE]),
  body("quantity").isNumeric().withMessage("Quantity is not a number"),
  body("colorId")
    .notEmpty()
    .withMessage("Color id is missing")
    .custom(existColor),
  body("sizeId").notEmpty().withMessage("Size id is missing").custom(existSize),
  param("productId").custom(existProduct),
  validate,
  asyncHandler(VariantController.create)
);

router.put(
  "/",
  // permission([ADMIN, EMPLOYEE]),
  body("sizeId").notEmpty().withMessage("Size id is missing").custom(existSize),
  body("colorId")
    .notEmpty()
    .withMessage("Color id is missing")
    .custom(existColor),
  param("productId").custom(existProduct).custom(existVariant),
  validate,
  asyncHandler(VariantController.update)
);

router.delete(
  "/",
  // permission([ADMIN, EMPLOYEE]),
  body("sizeId").notEmpty().withMessage("Size id is missing").custom(existSize),
  body("colorId")
    .notEmpty()
    .withMessage("Color id is missing")
    .custom(existColor),
  param("productId").custom(existProduct).custom(existVariant),
  validate,
  asyncHandler(VariantController.delete)
);

module.exports = router;
