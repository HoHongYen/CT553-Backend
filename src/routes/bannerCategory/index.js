const { param, body } = require("express-validator");
const BannerCategoryController = require("../../controllers/bannerCategory");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { existBannerCategory, validate } = require("../../middlewares/validation");
const { authentication, permission } = require("../../middlewares/auth");
const { ADMIN, EMPLOYEE } = require("../../constant/roles");

const router = require("express").Router();

router.get("/", asyncHandler(BannerCategoryController.getAll));

router.get("/:id", asyncHandler(BannerCategoryController.getOne));

// router.use(authentication);

router.post(
    "",
    // permission([ADMIN, EMPLOYEE]),
    body("name").notEmpty().withMessage("Name is missing"),
    validate,
    asyncHandler(BannerCategoryController.create)
);

router.put(
    "/:id",
    // permission([ADMIN, EMPLOYEE]),
    param("id").custom(existBannerCategory),
    validate,
    asyncHandler(BannerCategoryController.update)
);

module.exports = router;
