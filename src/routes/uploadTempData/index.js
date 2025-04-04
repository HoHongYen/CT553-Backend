const { param, body, query } = require("express-validator");
const {
  validate,
} = require("../../middlewares/validation");
const { uploadRoles, uploadPaymentMethods, uploadPaymentStatuses, uploadOrderStatuses, createDiscountForProducts, uploadModules, uploadPermissions } = require("../../services/uploadTempData/basic");
const { uploadParentCategories, uploadChildrenCategories } = require("../../services/uploadTempData/categories");
const { deleteCategories, deleteImages, deleteProducts } = require("../../services/uploadTempData/delete");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const UploadTempDataController = require("../../controllers/uploadTempData");

const router = require("express").Router();

router.post(
  "/basic", (req, res) => {
    // uploadRoles();
    // uploadPaymentMethods();
    // uploadPaymentStatuses();
    // uploadOrderStatuses();
    // createDiscountForProducts();
    // uploadModules();
    uploadPermissions();
    res.send("Basic data uploaded successfully");
  }
);

router.post(
  "/categories/parent", (req, res) => {
    uploadParentCategories();
    res.send("Parent categories uploaded successfully");
  }
);

router.post(
  "/categories/children", (req, res) => {
    uploadChildrenCategories();
    res.send("Children categories uploaded successfully");
  }
);

router.delete(
  "/categories", (req, res) => {
    deleteCategories();
    res.send("Categories deleted successfully");
  }
);

router.delete(
  "/uploads", (req, res) => {
    deleteImages();
    res.send("Uploaded images deleted successfully");
  }
)

router.delete(
  "/products", (req, res) => {
    deleteProducts();
    res.send("Products deleted successfully");
  }
)

router.post(
  "/crawl",
  body("url").notEmpty().withMessage("URL is missing"),
  validate,
  asyncHandler(UploadTempDataController.crawl)
)

router.post(
  "/crawlMany",
  asyncHandler(UploadTempDataController.crawlMany)
)

router.post(
  "/crawlCategory",
  asyncHandler(UploadTempDataController.crawlCategory)
)

module.exports = router;
