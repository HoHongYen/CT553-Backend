const { param, body, query } = require("express-validator");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const {
    existAccount,
} = require("../../middlewares/validation");
const { authentication, permission } = require("../../middlewares/auth");
const { ADMIN, EMPLOYEE } = require("../../constant/roles");
const RecommendController = require("../../controllers/recommend");

const router = require("express").Router();


router.get("/:userId", asyncHandler(RecommendController.getRecommend));

router.post("/", asyncHandler(RecommendController.saveRecommend));

module.exports = router;