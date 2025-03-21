const AccountController = require("../../controllers/account");
const router = require("express").Router();
const { body, param } = require("express-validator");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication, permission } = require("../../middlewares/auth");
const {
  validate,
  existAccount,
  convertDateStringToISODate,
} = require("../../middlewares/validation");

router.use(authentication);

router.post("", 
  // permission(), 
  asyncHandler(AccountController.create));
router.get("", 
  // permission(), 
  asyncHandler(AccountController.getAll));
router.get("/:id", 
  // permission(), 
  asyncHandler(AccountController.getOne));
// router.delete("/", asyncHandler(AccountController.deleteAll));
router.put(
  "",
  // permission(), 
  body("email").isEmpty().withMessage("Can not update email"),
  body("birthday").custom(convertDateStringToISODate),
  validate,
  asyncHandler(AccountController.updateInformation)
);
router.put(
  "/:accountId",
  // permission(), 
  body("email").isEmpty().withMessage("Can not update email"),
  body("birthday").custom(convertDateStringToISODate),
  validate,
  asyncHandler(AccountController.adminUpdateAccount)
);
router.put(
  "/password",
  // permission(), 
  asyncHandler(AccountController.changePassword)
);

// lock account
router.put(
  "/toggleActive/:accountId",
  // permission(),
  param("accountId")
    .notEmpty()
    .withMessage("account ID is missing"),
  validate,
  asyncHandler(AccountController.toggleActiveAccount)
);

module.exports = router;
