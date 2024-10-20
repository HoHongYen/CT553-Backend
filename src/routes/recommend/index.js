const { param, body, query } = require("express-validator");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const {
    existAccount,
} = require("../../middlewares/validation");
const { authentication, permission } = require("../../middlewares/auth");
const { ADMIN, EMPLOYEE } = require("../../constant/roles");
const RecommendController = require("../../controllers/recommend");

const router = require("express").Router();


router.get("/ratings/:userId", asyncHandler(RecommendController.getRecommendBaseOneRatings));
router.get("/viewCounts/:userId", asyncHandler(RecommendController.getRecommendBaseOnViewCounts));

router.post("/viewCounts", asyncHandler(RecommendController.addViewCountRecommend));
router.post("/", asyncHandler(RecommendController.saveRatingRecommend));

module.exports = router;