const { param, body } = require("express-validator");
const CategoryController = require("../../controllers/category");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { existCategory, validate } = require("../../middlewares/validation");
const { authentication, permission } = require("../../middlewares/auth");
const { ADMIN, EMPLOYEE } = require("../../constant/roles");

const router = require("express").Router();

router.get("", asyncHandler(CategoryController.getAll));
router.get("/breadcrumb", asyncHandler(CategoryController.getBreadcrumb));

router.get("/:categoryId", asyncHandler(CategoryController.getOne));
router.get("/parent/:categoryId", asyncHandler(CategoryController.getRootParent));
router.get("/children/:categoryId", asyncHandler(CategoryController.getChildren));

// router.use(authentication);

router.post(
  "",
  // permission([ADMIN, EMPLOYEE]),
  body("name").notEmpty().withMessage("Name is missing"),
  body("slug").notEmpty().withMessage("Slug is missing"),
  body("thumbnailImageId").notEmpty().withMessage("ThumbnailImageId is missing"),
  body("parentId")
    .custom(existCategory)
    .withMessage("Parent category not found"),
  validate,
  asyncHandler(CategoryController.create)
);

router.put(
  "/:id",
  // permission([ADMIN, EMPLOYEE]),
  param("id").custom(existCategory),
  validate,
  asyncHandler(CategoryController.update)
);

router.delete(
  "/:id",
  // permission([ADMIN, EMPLOYEE]),
  param("id").custom(existCategory),
  validate,
  asyncHandler(CategoryController.delete)
);

module.exports = router;
