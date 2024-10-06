const { body, param, query } = require("express-validator");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication } = require("../../middlewares/auth");
const {
    validate,
} = require("../../middlewares/validation");
const PaymentPolicyController = require("../../controllers/paymentPolicy");

const router = require("express").Router();

router.get(
    "/",
    validate,
    asyncHandler(PaymentPolicyController.getAll)
);

router.get("/current", asyncHandler(PaymentPolicyController.getCurrent));

router.get(
    "/:policyId",
    param("policyId")
        .notEmpty()
        .withMessage("policy ID is missing"),
    validate,
    asyncHandler(PaymentPolicyController.getById)
);

router.post(
    "/",
    body("visible").notEmpty().withMessage("Visibility is missing"),
    body("content").notEmpty().withMessage("Content is missing"),
    validate,
    asyncHandler(PaymentPolicyController.create)
);

router.put(
    "/:policyId",
    param("policyId")
        .notEmpty()
        .withMessage("policy ID is missing"),
    validate,
    asyncHandler(PaymentPolicyController.update)
);

// hide review
router.put(
    "/toggleHide/:policyId",
    param("policyId")
        .notEmpty()
        .withMessage("policyId ID is missing"),
    validate,
    asyncHandler(PaymentPolicyController.toggleHide)
);

module.exports = router;
