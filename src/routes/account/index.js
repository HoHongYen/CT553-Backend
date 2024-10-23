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
const { ADMIN } = require("../../constant/roles");

router.get("/", asyncHandler(AccountController.getAll));
router.get("/:id", asyncHandler(AccountController.getOne));
// router.delete("/", asyncHandler(AccountController.deleteAll));
router.use(authentication);
router.post("/", asyncHandler(AccountController.create));
router.put(
  "/",
  body("email").isEmpty().withMessage("Can not update email"),
  body("birthday").custom(convertDateStringToISODate),
  validate,
  asyncHandler(AccountController.updateInformation)
);
router.put(
  "/:id",
  body("email").isEmpty().withMessage("Can not update email"),
  body("birthday").custom(convertDateStringToISODate),
  validate,
  asyncHandler(AccountController.adminUpdateAccount)
);
router.put(
  "/password",
  asyncHandler(AccountController.changePassword)
);

// lock account
router.put(
  "/toggleActive/:accountId",
  permission([ADMIN]),
  param("accountId")
      .notEmpty()
      .withMessage("account ID is missing"),
  validate,
  asyncHandler(AccountController.toggleActiveAccount)
);

module.exports = router;
