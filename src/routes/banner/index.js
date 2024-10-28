const { param, body } = require("express-validator");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { existBanner, validate } = require("../../middlewares/validation");
const { authentication, permission } = require("../../middlewares/auth");
const { ADMIN, EMPLOYEE } = require("../../constant/roles");
const BannerController = require("../../controllers/banner");

// const router = require("express").Router();
const express = require("express");
const router = express.Router();
const protectedRouter = express.Router();

protectedRouter.use(authentication);

router.get("", asyncHandler(BannerController.getAll));
router.get("/getByBannerCategory/:bannerCategoryId", permission(), asyncHandler(BannerController.getBannerByBannerCategoryId));

// router.use(authentication);
protectedRouter.get("/admin", permission(), asyncHandler(BannerController.getAllForAdmin));

protectedRouter.post(
    "",
    permission(),
    body("imageId").notEmpty().withMessage("ImageId is missing"),
    body("priority").notEmpty().withMessage("Priority is missing"),
    body("bannerCategoryId").notEmpty().withMessage("BannerCategoryId is missing"),
    validate,
    asyncHandler(BannerController.create)
);

protectedRouter.put(
    "/:id",
    permission(),
    param("id").custom(existBanner),
    validate,
    asyncHandler(BannerController.update)
);

router.delete(
    "/:id",
    // permission([ADMIN, EMPLOYEE]),
    param("id").custom(existBanner),
    validate,
    asyncHandler(BannerController.delete)
);

module.exports = { router, protectedRouter };
