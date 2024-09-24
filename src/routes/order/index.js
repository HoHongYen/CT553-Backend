const { body, query, param } = require("express-validator");
const OrderController = require("../../controllers/order");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication } = require("../../middlewares/auth");
const {
  validate,
  existAddressOfAccount,
  existOrderOfAccount,
  existOrder,
} = require("../../middlewares/validation");
const { ORDER_STATUS_ID_MAPPING } = require("../../constant/orderStatus");

const router = require("express").Router();

router.get("/all", asyncHandler(OrderController.getAll));
router.get("/allForReport", asyncHandler(OrderController.getAllForReport));
router.get("/menForReport", asyncHandler(OrderController.getMenForReport));
router.get("/womenForReport", asyncHandler(OrderController.getWomenForReport));
router.get("/childrenForReport", asyncHandler(OrderController.getChildrenForReport));
router.get("/status-all", asyncHandler(OrderController.getAllOrderStatus));

// router.get(
//   "/:orderId",
//   validate,
//   asyncHandler(OrderController.getById)
// ); // VALIDATE ADMIN

router.use(authentication);

router.get("/:orderId", asyncHandler(OrderController.getById));
router.get("/customer/:orderId", asyncHandler(OrderController.customerGetById));

router.put(
  "/:orderId/status",
  param("orderId").custom(existOrder),
  body("fromStatus")
    .notEmpty()
    .withMessage("fromStatus is missing")
    .isIn(Object.values(ORDER_STATUS_ID_MAPPING))
    .withMessage("Invalid order status"),
  body("toStatus")
    .notEmpty()
    .withMessage("toStatus is missing")
    .isIn(Object.values(ORDER_STATUS_ID_MAPPING))
    .withMessage("Invalid order status"),
  validate,
  asyncHandler(OrderController.updateOrderStatus)
);

router.post(
  "",
  body("totalPrice").notEmpty().withMessage("Total price is missing"),
  body("totalDiscount").notEmpty().withMessage("Total discount is missing"),
  body("finalPrice").notEmpty().withMessage("Final price is missing"),
  body("shippingFee").notEmpty().withMessage("Shipping fee is missing"),
  body("deliveryAddressId")
    .notEmpty()
    .withMessage("deliveryAddressId is missing")
    .custom(existAddressOfAccount),
  body("paymentMethodId").notEmpty().withMessage("paymentMethodId is missing"),
  body("items")
    .notEmpty()
    .withMessage("Items is missing")
    .isArray()
    .withMessage("Items should be an array"),
  body("items.*.variantId")
    .notEmpty()
    .withMessage("Variant ID of item is missing"),
  body("items.*.productId")
    .notEmpty()
    .withMessage("Product ID of item is missing"),
  body("items.*.quantity")
    .notEmpty()
    .withMessage("Quantity of item is missing"),
  body("items.*.price").notEmpty().withMessage("Price of item is missing"),
  validate,
  asyncHandler(OrderController.create)
);

router.get(
  "/",
  query("orderStatusId").notEmpty().withMessage("Order status ID is mising"),
  validate,
  asyncHandler(OrderController.getOrdersOfBuyerByOrderStatus)
);

router.put(
  "/:orderId",
  param("orderId").custom(existOrderOfAccount),
  validate,
  asyncHandler(OrderController.cancel)
);

module.exports = router;
