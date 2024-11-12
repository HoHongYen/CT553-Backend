const { authentication } = require("../middlewares/auth");

const router = require("express").Router();

router.use("/auth", require("./auth"));

// router.use("/categories", require("./category"));
const categoryRouter = require("./category");
router.use("/categories", categoryRouter.router);
router.use("/categories", categoryRouter.protectedRouter);

router.use("/accounts", require("./account"));
router.use("/products/:productId/variants", require("./variant"));

// router.use("/products", require("./product"));
const productRouter = require("./product");
router.use("/products", productRouter.router);
router.use("/products", productRouter.protectedRouter);

router.use("/variants", require("./variant/variantInfo"));
router.use("/upload", require("./upload"));
router.use("/addresses", require("./address"));

// router.use("/reviews", require("./review"));
const reviewRouter = require("./review");
router.use("/reviews", reviewRouter.router);
router.use("/reviews", reviewRouter.protectedRouter);

router.use("/shippings", require("./shipping"));
router.use("/payments", require("./payment"));

// router.use("/orders", require("./order"));
const orderRouter = require("./order");
router.use("/orders", orderRouter.router);
router.use("/orders", orderRouter.protectedRouter);

router.use("/coupons", require("./coupon"));

router.use("/webhooks", require("./webhook"));

// router.use("/paymentPolicies", require("./paymentPolicy"));
const paymentPolicyRouter = require("./paymentPolicy");
router.use("/paymentPolicies", paymentPolicyRouter.router);
router.use("/paymentPolicies", paymentPolicyRouter.protectedRouter);

// router.use("/deliveryPolicies", require("./deliveryPolicy"));
const deliveryPolicyRouter = require("./deliveryPolicy");
router.use("/deliveryPolicies", deliveryPolicyRouter.router);
router.use("/deliveryPolicies", deliveryPolicyRouter.protectedRouter);

// router.use("/checkProductPolicies", require("./checkProductPolicy"));
const checkProductPolicyRouter = require("./checkProductPolicy");
router.use("/checkProductPolicies", checkProductPolicyRouter.router);
router.use("/checkProductPolicies", checkProductPolicyRouter.protectedRouter);

// router.use("/returnPolicies", require("./returnPolicy"));
const returnPolicyRouter = require("./returnPolicy");
router.use("/returnPolicies", returnPolicyRouter.router);
router.use("/returnPolicies", returnPolicyRouter.protectedRouter);

// router.use("/warrantyPolicies", require("./warrantyPolicy"));
const warrantyPolicyRouter = require("./warrantyPolicy");
router.use("/warrantyPolicies", warrantyPolicyRouter.router);
router.use("/warrantyPolicies", warrantyPolicyRouter.protectedRouter);

// router.use("/securityPolicies", require("./securityPolicy"));
const securityPolicyRouter = require("./securityPolicy");
router.use("/securityPolicies", securityPolicyRouter.router);
router.use("/securityPolicies", securityPolicyRouter.protectedRouter);

// router.use("/shopInfo", require("./shopInfo"));
const shopInfoRouter = require("./shopInfo");
router.use("/shopInfo", shopInfoRouter.router);
router.use("/shopInfo", shopInfoRouter.protectedRouter);

router.use("/recommend", require("./recommend"));

router.use("/sendEmail", require("./sendEmail"));

// router.use("/banners", require("./banner"));
const bannerRouter = require("./banner");
router.use("/banners", bannerRouter.router);
router.use("/banners", bannerRouter.protectedRouter);

// router.use("/bannerCategories", require("./bannerCategory"));
const bannerCategoryRouter = require("./bannerCategory");
router.use("/bannerCategories", bannerCategoryRouter.router);
router.use("/bannerCategories", bannerCategoryRouter.protectedRouter);

router.use("/modules", require("./module"));
router.use("/permissions", require("./permission"));

router.use("/uploadTempData", require("./uploadTempData"));

module.exports = router;
