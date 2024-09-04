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
router.use("/shippings", require("./shipping"));
router.use("/payments", require("./payment"));
router.use("/orders", require("./order"));
router.use("/coupons", require("./coupon"));

router.use("/uploadTempData", require("./uploadTempData"));

module.exports = router;
