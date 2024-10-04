const {
    validate,
} = require("../../middlewares/validation");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const WebhookController = require("../../controllers/webhook");

const router = require("express").Router();

router.post(
    "/",
    asyncHandler(WebhookController.getAll)
);

module.exports = router;
