const { query } = require("express-validator");
const { validate } = require("../../middlewares/validation");
const VariantController = require("../../controllers/variant");
const { asyncHandler } = require("../../middlewares/asyncHandler");

const router = require("express").Router();

router.get(
  "/",
  query("variantIds").isArray().withMessage("variantIds should be an array"),
  query("variantIds.*")
    .isNumeric()
    .withMessage("variantIds should be an array of integer"),
  validate,
  asyncHandler(VariantController.getByVariantIds)
);

module.exports = router;
