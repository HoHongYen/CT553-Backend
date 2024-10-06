const { body, param, query } = require("express-validator");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication } = require("../../middlewares/auth");
const {
    validate,
} = require("../../middlewares/validation");
const WarrantyPolicyController = require("../../controllers/warrantyPolicy");

const router = require("express").Router();

router.get(
    "/",
    validate,
    asyncHandler(WarrantyPolicyController.getAll)
);

router.get("/current", asyncHandler(WarrantyPolicyController.getCurrent));

router.get(
    "/:policyId",
    param("policyId")
        .notEmpty()
        .withMessage("policy ID is missing"),
    validate,
    asyncHandler(WarrantyPolicyController.getById)
);

router.post(
    "/",
    body("visible").notEmpty().withMessage("Visibility is missing"),
    body("content").notEmpty().withMessage("Content is missing"),
    validate,
    asyncHandler(WarrantyPolicyController.create)
);

router.put(
    "/:policyId",
    param("policyId")
        .notEmpty()
        .withMessage("policy ID is missing"),
    validate,
    asyncHandler(WarrantyPolicyController.update)
);

// hide review
router.put(
    "/toggleHide/:policyId",
    param("policyId")
        .notEmpty()
        .withMessage("policyId ID is missing"),
    validate,
    asyncHandler(WarrantyPolicyController.toggleHide)
);

module.exports = router;
