const { uploadRoles, uploadPaymentMethods, uploadPaymentStatuses } = require("../../services/uploadTempData/basic");

const router = require("express").Router();

router.post(
  "/basic", (req, res) => {
    uploadRoles();
    uploadPaymentMethods();
    uploadPaymentStatuses();
    res.send("Basic data uploaded successfully");
  }
);

module.exports = router;
