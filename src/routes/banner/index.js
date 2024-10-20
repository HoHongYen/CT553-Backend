const { param, body } = require("express-validator");
const BannerController = require("../../controllers/banner");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { existBanner, validate } = require("../../middlewares/validation");
const { authentication, permission } = require("../../middlewares/auth");
const { ADMIN, EMPLOYEE } = require("../../constant/roles");

const router = require("express").Router();

router.get("/", asyncHandler(BannerController.getAll));

router.get("/admin", asyncHandler(BannerController.getAllForAdmin));

router.get("/getByBannerCategory/:bannerCategoryId", asyncHandler(BannerController.getBannerByBannerCategoryId));

// router.use(authentication);

router.post(
    "",
    // permission([ADMIN, EMPLOYEE]),
    body("imageId").notEmpty().withMessage("ImageId is missing"),
    body("priority").notEmpty().withMessage("Priority is missing"),
    body("bannerCategoryId").notEmpty().withMessage("BannerCategoryId is missing"),
    validate,
    asyncHandler(BannerController.create)
);

router.put(
    "/:id",
    // permission([ADMIN, EMPLOYEE]),
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

module.exports = router;
