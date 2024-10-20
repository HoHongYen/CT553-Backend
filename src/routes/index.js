const { authentication } = require("../middlewares/auth");

const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/categories", require("./category"));
router.use("/accounts", require("./account"));
router.use("/products/:productId/variants", require("./variant"));
router.use("/products", require("./product"));
router.use("/variants", require("./variant/variantInfo"));
router.use("/upload", require("./upload"));
router.use("/addresses", require("./address"));
router.use("/reviews", require("./review"));
router.use("/shippings", require("./shipping"));
router.use("/payments", require("./payment"));
router.use("/orders", require("./order"));
router.use("/coupons", require("./coupon"));
router.use("/webhooks", require("./webhook"));
router.use("/paymentPolicies", require("./paymentPolicy"));
router.use("/deliveryPolicies", require("./deliveryPolicy"));
router.use("/checkProductPolicies", require("./checkProductPolicy"));
router.use("/returnPolicies", require("./returnPolicy"));
router.use("/warrantyPolicies", require("./warrantyPolicy"));
router.use("/securityPolicies", require("./securityPolicy"));
router.use("/shopInfo", require("./shopInfo"));
router.use("/recommend", require("./recommend"));
router.use("/banners", require("./banner"));
router.use("/bannerCategories", require("./bannerCategory"));

router.use("/uploadTempData", require("./uploadTempData"));

module.exports = router;
