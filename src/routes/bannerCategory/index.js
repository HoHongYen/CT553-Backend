const { param, body } = require("express-validator");
const BannerCategoryController = require("../../controllers/bannerCategory");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { existBannerCategory, validate } = require("../../middlewares/validation");
const { authentication, permission } = require("../../middlewares/auth");
const { ADMIN, EMPLOYEE } = require("../../constant/roles");

// const router = require("express").Router();
const express = require("express");
const router = express.Router();
const protectedRouter = express.Router();

protectedRouter.use(authentication);

protectedRouter.get("",
    //  permission(),
      asyncHandler(BannerCategoryController.getAll));

router.get("/:id", asyncHandler(BannerCategoryController.getOne));

// router.use(authentication);

protectedRouter.post(
    "",
    // permission(),
    body("name").notEmpty().withMessage("Name is missing"),
    validate,
    asyncHandler(BannerCategoryController.create)
);

protectedRouter.put(
    "/:id",
    // permission(),
    param("id").custom(existBannerCategory),
    validate,
    asyncHandler(BannerCategoryController.update)
);

module.exports = { router, protectedRouter };
