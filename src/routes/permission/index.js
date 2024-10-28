const { param, body } = require("express-validator");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { existPermission, validate } = require("../../middlewares/validation");
const { authentication, permission } = require("../../middlewares/auth");
const { ADMIN, EMPLOYEE } = require("../../constant/roles");
const PermissionController = require("../../controllers/permission");

const router = require("express").Router();

router.use(authentication);

router.get("/", asyncHandler(PermissionController.getAll));

// get permission by role
router.get("/:roleId", asyncHandler(PermissionController.getByRole));

// add permission to role
router.post(
  "/:roleId",
  body("permissionId").isInt().custom(existPermission),
  validate,
  asyncHandler(PermissionController.addPermissionToRole)
);

module.exports = router;
