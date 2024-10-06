const { body, param, query } = require("express-validator");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication } = require("../../middlewares/auth");
const {
    validate,
} = require("../../middlewares/validation");
const CheckProductPolicyController = require("../../controllers/checkProductPolicy");

const router = require("express").Router();

router.get(
    "/",
    validate,
    asyncHandler(CheckProductPolicyController.getAll)
);

router.get("/current", asyncHandler(CheckProductPolicyController.getCurrent));

router.get(
    "/:policyId",
    param("policyId")
        .notEmpty()
        .withMessage("policy ID is missing"),
    validate,
    asyncHandler(CheckProductPolicyController.getById)
);

router.post(
    "/",
    body("visible").notEmpty().withMessage("Visibility is missing"),
    body("content").notEmpty().withMessage("Content is missing"),
    validate,
    asyncHandler(CheckProductPolicyController.create)
);

router.put(
    "/:policyId",
    param("policyId")
        .notEmpty()
        .withMessage("policy ID is missing"),
    validate,
    asyncHandler(CheckProductPolicyController.update)
);

// hide review
router.put(
    "/toggleHide/:policyId",
    param("policyId")
        .notEmpty()
        .withMessage("policyId ID is missing"),
    validate,
    asyncHandler(CheckProductPolicyController.toggleHide)
);

module.exports = router;
