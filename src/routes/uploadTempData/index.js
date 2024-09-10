const { uploadRoles, uploadPaymentMethods, uploadPaymentStatuses } = require("../../services/uploadTempData/basic");
const { uploadParentCategories, uploadChildrenCategories } = require("../../services/uploadTempData/categories");
const { deleteCategories, deleteImages, deleteProducts } = require("../../services/uploadTempData/delete");

const router = require("express").Router();

router.post(
  "/basic", (req, res) => {
    uploadRoles();
    uploadPaymentMethods();
    uploadPaymentStatuses();
    res.send("Basic data uploaded successfully");
  }
);

router.post(
  "/categories", (req, res) => {
    uploadParentCategories();
    // uploadChildrenCategories();
    res.send("Categories uploaded successfully");
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

module.exports = router;
