const { body, param, query } = require("express-validator");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication } = require("../../middlewares/auth");
const {
    validate,
} = require("../../middlewares/validation");
const SecurityPolicyController = require("../../controllers/securityPolicy");

const router = require("express").Router();

router.get(
    "/",
    validate,
    asyncHandler(SecurityPolicyController.getAll)
);

router.get("/current", asyncHandler(SecurityPolicyController.getCurrent));

router.get(
    "/:policyId",
    param("policyId")
        .notEmpty()
        .withMessage("policy ID is missing"),
    validate,
    asyncHandler(SecurityPolicyController.getById)
);

router.post(
    "/",
    body("visible").notEmpty().withMessage("Visibility is missing"),
    body("content").notEmpty().withMessage("Content is missing"),
    validate,
    asyncHandler(SecurityPolicyController.create)
);

router.put(
    "/:policyId",
    param("policyId")
        .notEmpty()
        .withMessage("policy ID is missing"),
    validate,
    asyncHandler(SecurityPolicyController.update)
);

// hide review
router.put(
    "/toggleHide/:policyId",
    param("policyId")
        .notEmpty()
        .withMessage("policyId ID is missing"),
    validate,
    asyncHandler(SecurityPolicyController.toggleHide)
);

module.exports = router;
