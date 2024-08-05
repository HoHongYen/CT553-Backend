const AccountController = require("../../controllers/account");
const router = require("express").Router();
const { body, param } = require("express-validator");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication } = require("../../middlewares/auth");
const {
  validate,
  existAccount,
  convertDateStringToISODate,
} = require("../../middlewares/validation");

router.get("/", asyncHandler(AccountController.getAll));
router.get("/:id", asyncHandler(AccountController.getOne));
router.delete("/", asyncHandler(AccountController.deleteAll));
router.use(authentication);
router.put(
  "",
  body("email").isEmpty().withMessage("Can not update email"),
  body("birthday").custom(convertDateStringToISODate),
  validate,
  asyncHandler(AccountController.updateInformation)
);

module.exports = router;
