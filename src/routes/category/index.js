const { param, body } = require("express-validator");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { existCategory, validate } = require("../../middlewares/validation");
const { authentication, permission } = require("../../middlewares/auth");
const CategoryController = require("../../controllers/category");

// const router = require("express").Router();

const express = require("express");
const router = express.Router();
const protectedRouter = express.Router();

protectedRouter.use(authentication);

router.get("", 
  // permission(),
   asyncHandler(CategoryController.getAll));
router.get("/admin", asyncHandler(CategoryController.getAllForAdmin));
router.get("/breadcrumb", asyncHandler(CategoryController.getBreadcrumb));
router.get("/:categoryId", asyncHandler(CategoryController.getOne));
router.get("/parent/:categoryId", asyncHandler(CategoryController.getRootParent));
router.get("/children/:categoryId", asyncHandler(CategoryController.getChildren));

protectedRouter.post(
  "",
  // permission(),
  body("name").notEmpty().withMessage("Name is missing"),
  body("slug").notEmpty().withMessage("Slug is missing"),
  body("thumbnailImageId").notEmpty().withMessage("ThumbnailImageId is missing"),
  body("parentId")
    .custom(existCategory)
    .withMessage("Parent category not found"),
  validate,
  asyncHandler(CategoryController.create)
);

protectedRouter.put(
  "/:id",
  // permission(),
  param("id").custom(existCategory),
  validate,
  asyncHandler(CategoryController.update)
);

router.delete(
  "/:id",
  param("id").custom(existCategory),
  validate,
  asyncHandler(CategoryController.delete)
);

module.exports = { router, protectedRouter };
