const { body, param, query } = require("express-validator");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication } = require("../../middlewares/auth");
const {
    validate,
} = require("../../middlewares/validation");
const ReturnPolicyController = require("../../controllers/returnPolicy");

const router = require("express").Router();

router.get(
    "/",
    validate,
    asyncHandler(ReturnPolicyController.getAll)
);

router.get("/current", asyncHandler(ReturnPolicyController.getCurrent));

router.get(
    "/:policyId",
    param("policyId")
        .notEmpty()
        .withMessage("policy ID is missing"),
    validate,
    asyncHandler(ReturnPolicyController.getById)
);

router.post(
    "/",
    body("visible").notEmpty().withMessage("Visibility is missing"),
    body("content").notEmpty().withMessage("Content is missing"),
    validate,
    asyncHandler(ReturnPolicyController.create)
);

router.put(
    "/:policyId",
    param("policyId")
        .notEmpty()
        .withMessage("policy ID is missing"),
    validate,
    asyncHandler(ReturnPolicyController.update)
);

// hide review
router.put(
    "/toggleHide/:policyId",
    param("policyId")
        .notEmpty()
        .withMessage("policyId ID is missing"),
    validate,
    asyncHandler(ReturnPolicyController.toggleHide)
);

module.exports = router;
