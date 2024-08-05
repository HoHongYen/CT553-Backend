const { param, body } = require("express-validator");
const SizeController = require("../../controllers/size");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { existSize, validate } = require("../../middlewares/validation");
const { authentication, permission } = require("../../middlewares/auth");
const { ADMIN, EMPLOYEE } = require("../../constant/roles");

const router = require("express").Router();

router.get("", asyncHandler(SizeController.getAll));

// router.use(authentication);

router.post(
  "",
  // permission([ADMIN, EMPLOYEE]),
  body("name").notEmpty().withMessage("Name is missing"),
  body("description").notEmpty().withMessage("Description is missing"),
  validate,
  asyncHandler(SizeController.create)
);

router.put(
  "/:id",
  // permission([ADMIN, EMPLOYEE]),
  param("id").custom(existSize),
  validate,
  asyncHandler(SizeController.update)
);

router.delete(
  "/:id",
  // permission([ADMIN, EMPLOYEE]),
  param("id").custom(existSize),
  validate,
  asyncHandler(SizeController.delete)
);

module.exports = router;
